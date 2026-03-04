import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './OrderConfirmPage.module.css'

export default function OrderConfirmPage() {
  const { id } = useParams()

  return (
    <main className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className={styles.checkCircle}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
        >
          ✓
        </motion.div>

        <h1 className={styles.title}>Order Confirmed!</h1>
        <p className={styles.sub}>
          Thanks for your order. We'll have your drinks fired up and shipped soon.
        </p>

        <div className={styles.orderBox}>
          <span className={styles.orderLabel}>Order ID</span>
          <span className={styles.orderId}>{id}</span>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <span className={styles.dot}>✓</span>
            <div>
              <p className={styles.timelineTitle}>Order Received</p>
              <p className={styles.timelineSub}>We got it!</p>
            </div>
          </div>
          <div className={styles.timelineConnector} />
          <div className={styles.timelineItem}>
            <span className={`${styles.dot} ${styles.dotPending}`}>→</span>
            <div>
              <p className={styles.timelineTitle}>Processing</p>
              <p className={styles.timelineSub}>1–2 business days</p>
            </div>
          </div>
          <div className={styles.timelineConnector} />
          <div className={styles.timelineItem}>
            <span className={`${styles.dot} ${styles.dotPending}`}>📦</span>
            <div>
              <p className={styles.timelineTitle}>Shipped</p>
              <p className={styles.timelineSub}>3–5 business days</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/account/orders" className={styles.primaryBtn}>View Order History</Link>
          <Link to="/shop" className={styles.secondaryBtn}>Continue Shopping</Link>
        </div>
      </motion.div>
    </main>
  )
}
