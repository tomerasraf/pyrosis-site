import { Router } from 'express'
import Order from '../models/Order.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/orders — create order after payment
router.post('/', optionalAuth, async (req, res) => {
  const { items, shipping, total, promoCode, stripePaymentIntentId } = req.body

  if (!items?.length || !shipping || !total || !stripePaymentIntentId) {
    return res.status(400).json({ error: 'Missing required order fields' })
  }

  try {
    const order = await Order.create({
      userId: req.user?.id || null,
      items,
      shipping,
      total,
      promoCode: promoCode || null,
      stripePaymentIntentId,
      status: 'paid',
    })
    res.status(201).json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// GET /api/orders — user's order history
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean()
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /api/orders/:id — single order
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id }).lean()
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

export default router
