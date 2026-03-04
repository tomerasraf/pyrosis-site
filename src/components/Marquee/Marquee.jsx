import { useSite } from '../../context/SiteContext'
import styles from './Marquee.module.css'

export default function Marquee({ bg = 'var(--forest)', color = 'var(--white)' }) {
  const { config } = useSite()
  const repeated = [...config.marquee.items, ...config.marquee.items]

  return (
    <div className={styles.band} style={{ background: bg, color }}>
      <div className={styles.track}>
        {repeated.map((item, i) => (
          <span key={i} className={styles.item}>{item}</span>
        ))}
      </div>
    </div>
  )
}
