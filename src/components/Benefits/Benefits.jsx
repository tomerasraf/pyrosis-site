import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import FizzParticles from '../Hero/FizzParticles'
import { useSite } from '../../context/SiteContext'
import styles from './Benefits.module.css'

export default function Benefits() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { config } = useSite()
  const { eyebrow, title, sub, claimNum, claimText, claimLink, items } = config.benefits

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
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.sub}>{sub}</p>
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
          <span className={styles.claimNum}>{claimNum}</span>
          <span className={styles.claimText}>{claimText}</span>
          <a href="#story" className={styles.claimLink}>{claimLink}</a>
        </motion.div>
      </div>
    </section>
  )
}
