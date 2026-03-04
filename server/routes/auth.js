import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = Router()

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg })

    const { name, email, password } = req.body
    try {
      const existing = await User.findOne({ email })
      if (existing) return res.status(400).json({ error: 'Email already in use' })

      const passwordHash = await bcrypt.hash(password, 12)
      const user = await User.create({ name, email, passwordHash })
      const token = signToken(user)

      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Registration failed' })
    }
  }
)

// POST /api/auth/login
router.post('/login',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg })

    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(401).json({ error: 'Invalid credentials' })

      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

      const token = signToken(user)
      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Login failed' })
    }
  }
)

export default router
