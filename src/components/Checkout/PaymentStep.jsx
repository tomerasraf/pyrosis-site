import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import styles from './CheckoutSteps.module.css'

export default function PaymentStep({ onBack, onSuccess, totalAmount }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: submitErr } = await elements.submit()
    if (submitErr) {
      setError(submitErr.message)
      setLoading(false)
      return
    }

    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmErr) {
      setError(confirmErr.message)
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent)
    } else {
      setError('Payment not completed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Payment</h2>
      <p className={styles.stepSub}>Your payment info is secure and encrypted.</p>

      <div className={styles.stripeWrapper}>
        <PaymentElement />
      </div>

      {error && <p className={styles.payError}>{error}</p>}

      <div className={styles.totalDisplay}>
        Total charged: <strong>${totalAmount.toFixed(2)}</strong>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.backBtn} onClick={onBack} disabled={loading}>← Back</button>
        <motion.button
          className={`${styles.nextBtn} ${loading ? styles.loading : ''}`}
          onClick={handlePay}
          disabled={loading || !stripe}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? 'Processing…' : `Pay $${totalAmount.toFixed(2)}`}
        </motion.button>
      </div>
    </div>
  )
}
