import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './CheckoutSteps.module.css'

const EMPTY = { firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '', country: 'US' }

const Field = ({ name, label, type = 'text', half, form, errors, set, setErrors }) => (
  <div className={`${styles.field} ${half ? styles.fieldHalf : ''}`}>
    <label className={styles.fieldLabel}>{label}</label>
    <input
      className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
      type={type}
      value={form[name]}
      onChange={e => { set(name, e.target.value); setErrors(er => ({ ...er, [name]: '' })) }}
    />
    {errors[name] && <span className={styles.fieldError}>{errors[name]}</span>}
  </div>
)

export default function ShippingStep({ onNext, onBack }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Required'
    if (!form.zip.trim()) e.zip = 'Required'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onNext({ shipping: form })
  }

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Shipping Details</h2>
      <div className={styles.form}>
        <div className={styles.fieldRow}>
          <Field name="firstName" label="First Name" half form={form} errors={errors} set={set} setErrors={setErrors} />
          <Field name="lastName" label="Last Name" half form={form} errors={errors} set={set} setErrors={setErrors} />
        </div>
        <Field name="email" label="Email Address" type="email" form={form} errors={errors} set={set} setErrors={setErrors} />
        <Field name="address" label="Street Address" form={form} errors={errors} set={set} setErrors={setErrors} />
        <div className={styles.fieldRow}>
          <Field name="city" label="City" half form={form} errors={errors} set={set} setErrors={setErrors} />
          <Field name="state" label="State" half form={form} errors={errors} set={set} setErrors={setErrors} />
        </div>
        <div className={styles.fieldRow}>
          <Field name="zip" label="ZIP Code" half form={form} errors={errors} set={set} setErrors={setErrors} />
          <div className={`${styles.field} ${styles.fieldHalf}`}>
            <label className={styles.fieldLabel}>Country</label>
            <select className={styles.input} value={form.country} onChange={e => set('country', e.target.value)}>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <motion.button
          className={styles.nextBtn}
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue to Payment →
        </motion.button>
      </div>
    </div>
  )
}
