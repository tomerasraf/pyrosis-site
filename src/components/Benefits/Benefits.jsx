import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import FizzParticles from '../Hero/FizzParticles'
import styles from './Benefits.module.css'

const items = [
  { icon: '🌿', title: 'Real Fruit Juice',    color: '#00A67E', desc: 'Every can starts with real, cold-pressed juice. Not concentrate. Not flavor packets. Actual fruit.' },
  { icon: '⚡', title: 'Natural Lift',         color: '#E8B000', desc: 'A gentle boost from green tea & B-vitamins. Zero jitters. Zero crash. Just good vibes.' },
  { icon: '🦠', title: '9 Billion Prebiotics', color: '#C8255A', desc: 'Your gut deserves love too. We pack in clinically-studied prebiotics in every single can.' },
  { icon: '🚫', title: 'Nothing Fake',         color: '#6B24C2', desc: 'No artificial colors. No HFCS. No weird additives you can\'t pronounce. Promise.' },
]

export default function Benefits() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="benefits" ref={ref}>
      <FizzParticles color="#a8c5a0" />

      {/* Wavy top divider */}
      <div className={styles.waveTop}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="var(--cream-dark)" />
        </svg>
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <span className={styles.eyebrow}>Good Stuff Inside</span>
          <h2 className={styles.title}>
            soda that's<br />
            <em>actually&nbsp;good</em><br />
            for you.
          </h2>
          <p className={styles.sub}>
            We read every label so you don't have to. Here's what's inside every PYROSIS can.
          </p>
        </motion.div>

        <div className={styles.cards}>
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              className={styles.card}
              style={{ '--c': item.color }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <span className={styles.iconCircle}>{item.icon}</span>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <p className={styles.cardDesc}>{item.desc}</p>
              <div className={styles.cardBar} />
            </motion.div>
          ))}
        </div>

        {/* Big claim */}
        <motion.div
          className={styles.claim}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <span className={styles.claimNum}>200+</span>
          <span className={styles.claimText}>
            batches tested before a single can left our garage.
          </span>
          <a href="#story" className={styles.claimLink}>Meet the obsessives →</a>
        </motion.div>
      </div>
    </section>
  )
}
