import { Router } from 'express'
import Stripe from 'stripe'
import Order from '../models/Order.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// POST /api/payments/create-intent
router.post('/create-intent', async (req, res) => {
  const { amount, currency = 'usd' } = req.body
  if (!amount || amount < 50) return res.status(400).json({ error: 'Invalid amount' })

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    })
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

// POST /api/payments/webhook — MUST use raw body (set in index.js)
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    try {
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: pi.id },
        { status: 'paid' }
      )
    } catch (err) {
      console.error('Webhook order update failed:', err)
    }
  }

  res.json({ received: true })
})

export default router
