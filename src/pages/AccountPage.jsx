import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import styles from './AccountPage.module.css'

function AuthForms({ defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/account'

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register'
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const data = await api.post(endpoint, body)
      login(data.token, data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.error || err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authCard}>
      <div className={styles.tabRow}>
        <button
          className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
          onClick={() => { setTab('login'); setError('') }}
        >
          Sign In
        </button>
        <button
          className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
          onClick={() => { setTab('register'); setError('') }}
        >
          Create Account
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={tab}
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
        >
          {tab === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                className={styles.input}
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
              placeholder="jane@example.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <motion.button
            type="submit"
            className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
          </motion.button>
        </motion.form>
      </AnimatePresence>
    </div>
  )
}

function ProfilePanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.profileCard}>
      <div className={styles.avatar}>
        {user.name.charAt(0).toUpperCase()}
      </div>
      <h2 className={styles.profileName}>{user.name}</h2>
      <p className={styles.profileEmail}>{user.email}</p>

      <div className={styles.profileLinks}>
        <Link to="/account/orders" className={styles.profileLink}>
          <span>📦</span>
          <div>
            <p className={styles.profileLinkTitle}>Order History</p>
            <p className={styles.profileLinkSub}>View and track your orders</p>
          </div>
          <span className={styles.arrow}>→</span>
        </Link>
        <Link to="/shop" className={styles.profileLink}>
          <span>🛍</span>
          <div>
            <p className={styles.profileLinkTitle}>Shop Now</p>
            <p className={styles.profileLinkSub}>Browse all flavors</p>
          </div>
          <span className={styles.arrow}>→</span>
        </Link>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  )
}

export default function AccountPage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {isAuthenticated ? 'MY ACCOUNT' : 'WELCOME BACK'}
        </h1>
      </div>
      <div className={styles.container}>
        {isAuthenticated ? <ProfilePanel /> : <AuthForms />}
      </div>
    </main>
  )
}
