import styles from './Marquee.module.css'

const items = [
  'Citrus Burst', '🍊', 'Berry Rush', '🫐',
  'Tropical Wave', '🥭', 'Grape Galaxy', '🍇',
  'Lemon Haze', '🍋', 'Cherry Bomb', '🍒',
  'Real Fruit', '✦', 'Zero Junk', '✦', 'Gut-Friendly', '✦',
]

export default function Marquee({ bg = 'var(--forest)', color = 'var(--white)' }) {
  const repeated = [...items, ...items]

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
