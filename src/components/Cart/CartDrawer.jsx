import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { items, open, totalQty, totalPrice, dispatch } = useCart()
  const navigate = useNavigate()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE' })}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>Your Cart {totalQty > 0 && <span className={styles.count}>{totalQty}</span>}</h3>
              <button className={styles.close} onClick={() => dispatch({ type: 'CLOSE' })} aria-label="Close cart">✕</button>
            </div>

            {items.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🛒</span>
                <p>Your cart is empty.</p>
                <a href="#flavors" className={styles.browseBtn} onClick={() => dispatch({ type: 'CLOSE' })}>
                  Browse flavors →
                </a>
              </div>
            ) : (
              <>
                <ul className={styles.itemList}>
                  {items.map(item => (
                    <li key={item.id} className={styles.item}>
                      <div className={styles.itemIcon} style={{ background: item.bg }}>
                        <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                      </div>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemFlavor}>{item.flavor}</p>
                        <div className={styles.itemRow}>
                          <span className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</span>
                          <div className={styles.qty}>
                            <button onClick={() => dispatch({ type: 'SET_QTY', id: item.id, qty: item.qty - 1 })}>−</button>
                            <span>{item.qty}</span>
                            <button onClick={() => dispatch({ type: 'SET_QTY', id: item.id, qty: item.qty + 1 })}>+</button>
                          </div>
                        </div>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                        aria-label="Remove item"
                      >✕</button>
                    </li>
                  ))}
                </ul>

                <div className={styles.footer}>
                  <div className={styles.subtotal}>
                    <span>Subtotal</span>
                    <span className={styles.subtotalAmt}>${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className={styles.shipping}>Free shipping on orders over $25</p>
                  <motion.button
                    className={styles.checkoutBtn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      dispatch({ type: 'CLOSE' })
                      navigate('/checkout')
                    }}
                  >
                    Checkout →
                  </motion.button>
                  <button
                    className={styles.continueBtn}
                    onClick={() => dispatch({ type: 'CLOSE' })}
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
