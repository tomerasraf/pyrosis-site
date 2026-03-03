import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import styles from './OrdersPage.module.css'

const STATUS_COLORS = {
  pending:  { bg: '#FFF8E0', color: '#B88A00' },
  paid:     { bg: '#E8FFF7', color: '#00A67E' },
  shipped:  { bg: '#E8F0FF', color: '#2563EB' },
  delivered:{ bg: '#F0FFF4', color: '#16A34A' },
}

export default function OrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/orders', token)
      .then(data => setOrders(data))
      .catch(err => setError(err.error || 'Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <div className={styles.spinner} />
          <p>Loading orders…</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>ORDER HISTORY</h1>
      </div>

      <div className={styles.container}>
        {error && <p className={styles.error}>{error}</p>}

        {orders.length === 0 && !error ? (
          <div className={styles.empty}>
            <span>📦</span>
            <p>No orders yet.</p>
            <Link to="/shop" className={styles.shopBtn}>Shop Now →</Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map((order, i) => {
              const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending
              return (
                <motion.div
                  key={order._id || order.id}
                  className={styles.orderCard}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className={styles.orderHeader}>
                    <div>
                      <p className={styles.orderId}>#{(order._id || order.id).slice(-8).toUpperCase()}</p>
                      <p className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <span
                      className={styles.statusBadge}
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <ul className={styles.itemList}>
                    {order.items.map((item, j) => (
                      <li key={j} className={styles.item}>
                        <span className={styles.itemIcon}>{item.icon}</span>
                        <div>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemSub}>{item.packLabel} × {item.qty}</p>
                        </div>
                        <span className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.orderFooter}>
                    <div className={styles.shippingTo}>
                      <span>📍</span>
                      <span>{order.shipping?.city}, {order.shipping?.state}</span>
                    </div>
                    <div className={styles.total}>
                      Total: <strong>${order.total.toFixed(2)}</strong>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className={styles.backRow}>
          <Link to="/account" className={styles.backLink}>← Back to Account</Link>
        </div>
      </div>
    </main>
  )
}
