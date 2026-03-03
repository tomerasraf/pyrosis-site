import styles from './ProgressBar.module.css'

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm']

export default function ProgressBar({ step }) {
  return (
    <div className={styles.wrapper}>
      {STEPS.map((label, i) => (
        <div key={label} className={styles.stepWrapper}>
          <div className={`${styles.circle} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}>
            {i < step ? '✓' : i + 1}
          </div>
          <span className={`${styles.label} ${i === step ? styles.labelActive : ''}`}>{label}</span>
          {i < STEPS.length - 1 && (
            <div className={`${styles.line} ${i < step ? styles.lineDone : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}
