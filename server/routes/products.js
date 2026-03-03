import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { tag, sort } = req.query
    let query = Product.find({ inStock: true })

    if (tag && tag !== 'All') query = query.where('tags').in([tag])

    if (sort === 'price-asc')  query = query.sort({ price:  1 })
    if (sort === 'price-desc') query = query.sort({ price: -1 })
    if (sort === 'cals-asc')   query = query.sort({ cals:   1 })

    const products = await query.lean()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) }).lean()
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
