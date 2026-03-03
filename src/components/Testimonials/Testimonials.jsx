import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import styles from './Testimonials.module.css'

const reviews = [
  { id: 1, name: 'Sarah K.',   handle: '@sarahkdrinks',   avatar: '👩‍🦰', rating: 5, flavor: 'Berry Rush',    fc: '#C8255A', text: "Berry Rush is hands-down the best soda I've ever tasted. I switched from sugary sodas a year ago and PYROSIS made it painless — I genuinely don't miss them." },
  { id: 2, name: 'Marcus T.',  handle: '@marcust',        avatar: '👨🏽‍💻', rating: 5, flavor: 'Citrus Burst',  fc: '#FF5C1A', text: "I was skeptical about 'healthy soda' but Citrus Burst blew me away. Actually tastes like citrus, not like a citrus-scented cleaning product." },
  { id: 3, name: 'Jess M.',    handle: '@jessm_wellness', avatar: '🧘‍♀️', rating: 5, flavor: 'Tropical Wave', fc: '#00A67E', text: "Tropical Wave in the morning is my new ritual. Light, refreshing, no crash. My whole family is converted. My dog probably would be too if he could open cans." },
  { id: 4, name: 'Ryan O.',    handle: '@ryanofit',       avatar: '🏋️', rating: 5, flavor: 'Grape Galaxy',  fc: '#6B24C2', text: "Grape Galaxy is complex and satisfying. I drink one every afternoon instead of my second coffee. My therapist says this counts as growth." },
  { id: 5, name: 'Priya S.',   handle: '@priyaeats',      avatar: '👩🏽‍🍳', rating: 5, flavor: 'Lemon Haze',   fc: '#E8B000', text: "As a nutritionist I'm picky. PYROSIS passes every test — real ingredients, prebiotics, low sugar. Lemon Haze is basically liquid sunlight." },
]

function Stars() {
  return <div className={styles.stars}>{Array.from({length:5}).map((_,i)=><span key={i}>★</span>)}</div>
}

function Card({ r, i }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08 }}
    >
      <Stars />
      <p className={styles.text}>"{r.text}"</p>
      <div className={styles.cardFooter}>
        <div className={styles.reviewer}>
          <span className={styles.avatar}>{r.avatar}</span>
          <div>
            <p className={styles.name}>{r.name}</p>
            <p className={styles.handle}>{r.handle}</p>
          </div>
        </div>
        <span className={styles.badge} style={{ background: `${r.fc}18`, color: r.fc, borderColor: `${r.fc}30` }}>
          {r.flavor}
        </span>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [page, setPage] = useState(0)
  const perPage = 3
  const total = Math.ceil(reviews.length / perPage)
  const visible = reviews.slice(page * perPage, page * perPage + perPage)

  return (
    <section className={styles.section} id="reviews" ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <span className={styles.eyebrow}>Real Reviews</span>
          <h2 className={styles.title}>
            don't take<br /><em>our word for it.</em>
          </h2>

          <div className={styles.summaryRow}>
            {[['4.9★', 'avg rating'], ['50K+', 'happy drinkers'], ['98%', 'would recommend']].map(([v, l]) => (
              <div key={l} className={styles.summaryItem}>
                <strong className={styles.summaryVal}>{v}</strong>
                <span className={styles.summaryLabel}>{l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {visible.map((r, i) => <Card key={r.id} r={r} i={i} />)}
          </motion.div>
        </AnimatePresence>

        <div className={styles.pagination}>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
