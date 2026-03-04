import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import styles from './CheckoutSteps.module.css'

const PROMOS = { 'PYROSIS10': 0.10, 'FIRE20': 0.20 }

export default function CartReviewStep({ onNext }) {
  const { items, totalPrice, dispatch } = useCart()
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoError, setPromoError] = useState('')

  const discount = promoApplied ? totalPrice * PROMOS[promoApplied] : 0
  const finalTotal = totalPrice - discount

  const applyPromo = () => {
    const code = promo.trim().toUpperCase()
    if (PROMOS[code]) {
      setPromoApplied(code)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code.')
      setPromoApplied(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <span>🛒</span>
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Review Your Order</h2>
      <ul className={styles.itemList}>
        {items.map(item => (
          <li key={item.id} className={styles.item}>
            <div className={styles.itemIcon} style={{ background: item.bg }}>
              <span>{item.icon}</span>
            </div>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemSub}>{item.packLabel || item.flavor}</p>
            </div>
            <div className={styles.qtyControls}>
              <button onClick={() => dispatch({ type: 'SET_QTY', id: item.id, qty: item.qty - 1 })}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => dispatch({ type: 'SET_QTY', id: item.id, qty: item.qty + 1 })}>+</button>
            </div>
            <span className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className={styles.promoRow}>
        <input
          className={styles.promoInput}
          placeholder="Promo code"
          value={promo}
          onChange={e => setPromo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applyPromo()}
        />
        <button className={styles.promoBtn} onClick={applyPromo}>Apply</button>
      </div>
      {promoError && <p className={styles.promoError}>{promoError}</p>}
      {promoApplied && <p className={styles.promoSuccess}>🎉 {promoApplied} — {PROMOS[promoApplied] * 100}% off applied!</p>}

      <div className={styles.totals}>
        <div className={styles.totalRow}><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
        {discount > 0 && <div className={styles.totalRow}><span>Discount</span><span style={{ color: 'var(--tropical)' }}>−${discount.toFixed(2)}</span></div>}
        <div className={styles.totalRow}><span>Shipping</span><span>{finalTotal >= 25 ? 'Free' : '$4.99'}</span></div>
        <div className={`${styles.totalRow} ${styles.totalFinal}`}>
          <span>Total</span>
          <span>${(finalTotal < 25 ? finalTotal + 4.99 : finalTotal).toFixed(2)}</span>
        </div>
      </div>

      <motion.button
        className={styles.nextBtn}
        onClick={() => onNext({ discount, promoCode: promoApplied })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue to Shipping →
      </motion.button>
    </div>
  )
}
