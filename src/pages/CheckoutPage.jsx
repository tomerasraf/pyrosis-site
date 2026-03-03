import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import ProgressBar from '../components/Checkout/ProgressBar'
import CartReviewStep from '../components/Checkout/CartReviewStep'
import ShippingStep from '../components/Checkout/ShippingStep'
import PaymentStep from '../components/Checkout/PaymentStep'
import styles from './CheckoutPage.module.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const STRIPE_APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#FF5C1A',
    colorBackground: '#ffffff',
    borderRadius: '12px',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
}

export default function CheckoutPage() {
  const { items, totalPrice, dispatch } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [cartData, setCartData] = useState({})
  const [shipping, setShipping] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [error, setError] = useState('')

  // Step 0 → 1: save cart data
  const handleCartNext = (data) => {
    setCartData(data)
    setStep(1)
  }

  // Step 1 → 2: save shipping, create payment intent
  const handleShippingNext = async ({ shipping: shippingData }) => {
    setShipping(shippingData)
    setError('')

    const discount = cartData.discount || 0
    const subtotal = totalPrice - discount
    const shipping_cost = subtotal >= 25 ? 0 : 4.99
    const total = subtotal + shipping_cost
    setTotalAmount(total)

    try {
      const data = await api.post('/payments/create-intent', {
        amount: Math.round(total * 100),
        currency: 'usd',
      }, token)
      setClientSecret(data.clientSecret)
      setStep(2)
    } catch (err) {
      setError(err.error || 'Failed to initialize payment. Please try again.')
    }
  }

  // Step 2 → 3: payment succeeded, create order
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const order = await api.post('/orders', {
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          packLabel: i.packLabel || 'Single Can',
          price: i.price,
          qty: i.qty,
          icon: i.icon,
        })),
        shipping,
        total: totalAmount,
        promoCode: cartData.promoCode || null,
        stripePaymentIntentId: paymentIntent.id,
      }, token)

      dispatch({ type: 'CLEAR' })
      navigate(`/order-confirmation/${order._id || order.id}`)
    } catch (err) {
      setError(err.error || 'Order creation failed. Contact support with payment ID: ' + paymentIntent.id)
    }
  }

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -40 },
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Checkout</h1>
        <ProgressBar step={step} />

        {error && (
          <div className={styles.globalError}>
            ⚠ {error}
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.formArea}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="cart" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                  <CartReviewStep onNext={handleCartNext} />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="ship" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                  <ShippingStep onNext={handleShippingNext} onBack={() => setStep(0)} />
                </motion.div>
              )}
              {step === 2 && clientSecret && (
                <motion.div key="pay" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
                    <PaymentStep
                      onBack={() => setStep(1)}
                      onSuccess={handlePaymentSuccess}
                      totalAmount={totalAmount}
                    />
                  </Elements>
                </motion.div>
              )}
              {step === 2 && !clientSecret && (
                <motion.div key="loading" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                  <div className={styles.loadingPayment}>
                    <div className={styles.spinner} />
                    <p>Setting up secure payment…</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Order Summary</h3>
            <ul className={styles.sidebarItems}>
              {items.map(item => (
                <li key={item.id} className={styles.sidebarItem}>
                  <span className={styles.sidebarIcon}>{item.icon}</span>
                  <div className={styles.sidebarItemInfo}>
                    <p className={styles.sidebarItemName}>{item.name}</p>
                    <p className={styles.sidebarItemSub}>{item.packLabel || 'Single Can'} × {item.qty}</p>
                  </div>
                  <span className={styles.sidebarItemPrice}>${(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.sidebarTotal}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <p className={styles.sidebarNote}>{totalPrice >= 25 ? '✓ Free shipping' : `Add $${(25 - totalPrice).toFixed(2)} for free shipping`}</p>
          </aside>
        </div>
      </div>
    </main>
  )
}
