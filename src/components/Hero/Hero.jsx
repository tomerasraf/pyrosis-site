import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FizzParticles from './FizzParticles'
import styles from './Hero.module.css'

const flavors = [
  { name: 'Citrus Burst',  emoji: '🍊', color: '#FF5C1A', dark: '#C43D08' },
  { name: 'Berry Rush',    emoji: '🫐', color: '#C8255A', dark: '#8F1A40' },
  { name: 'Tropical Wave', emoji: '🥭', color: '#00A67E', dark: '#007357' },
]

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const flavor = flavors[idx]

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % flavors.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className={styles.hero} id="hero">

      {/* ── BIG BLOB SHAPE with fizz particles ── */}
      <motion.div
        className={styles.blob}
        animate={{ backgroundColor: flavor.color }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        <FizzParticles color="#ffffff" />
      </motion.div>

      {/* ── MASKED PRODUCT PHOTO ── */}
      <div className={styles.photoWrap}>
        <img
          src="/images/product-hero.jpg"
          alt="Fizzr soda cans"
          className={styles.productPhoto}
          draggable={false}
        />
        <motion.div
          className={styles.photoOverlay}
          animate={{ backgroundColor: flavor.color }}
          transition={{ duration: 0.9 }}
        />
      </div>

      {/* ── FLAVOR LABEL pinned inside blob ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={flavor.name}
          className={styles.flavorBadge}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <span>{flavor.emoji}</span>
          <span>{flavor.name}</span>
        </motion.div>
      </AnimatePresence>

      {/* ── LEFT TEXT COLUMN ── */}
      <div className={styles.textCol}>

        <motion.p
          className={styles.kicker}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          ✦ New flavors just dropped
        </motion.p>

        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          SPARKLING<br />
          <AnimatePresence mode="wait">
            <motion.span
              key={flavor.color}
              className={styles.accent}
              style={{ color: flavor.color }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {flavor.name.toUpperCase()}
            </motion.span>
          </AnimatePresence><br />
          SODA
        </motion.h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.55 }}
        >
          Refreshing &amp; all-natural.<br />
          Real fruit. Zero compromise.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <motion.a
            href="#shop"
            className={styles.btnPrimary}
            style={{ background: flavor.color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            SHOP ALL FLAVORS
          </motion.a>
          <a href="#flavors" className={styles.btnGhost}>
            See flavors ↓
          </a>
        </motion.div>

        {/* Flavor picker dots */}
        <motion.div
          className={styles.picker}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {flavors.map((f, i) => (
            <motion.button
              key={f.name}
              onClick={() => setIdx(i)}
              className={styles.dot}
              animate={{
                width:      i === idx ? 32 : 10,
                background: i === idx ? f.color : '#D4C5B4',
                borderRadius: 5,
              }}
              transition={{ duration: 0.3 }}
              aria-label={f.name}
            />
          ))}
        </motion.div>
      </div>

      {/* ── STATS BAR pinned to bottom ── */}
      <motion.div
        className={styles.statsBar}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        {[['12+', 'flavors'], ['0g', 'added sugar'], ['9B', 'prebiotics'], ['100%', 'real fruit']].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <strong className={styles.statN} style={{ color: flavor.color }}>{n}</strong>
            <span className={styles.statL}>{l}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
