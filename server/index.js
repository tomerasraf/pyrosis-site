import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes     from './routes/auth.js'
import productRoutes  from './routes/products.js'
import orderRoutes    from './routes/orders.js'
import paymentRoutes  from './routes/payments.js'

const app = express()
const PORT = process.env.PORT || 3001

// ⚠ Webhook route MUST come before express.json() — needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/payments', paymentRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }))

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected')
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('✗ MongoDB connection failed:', err.message)
    process.exit(1)
  })
