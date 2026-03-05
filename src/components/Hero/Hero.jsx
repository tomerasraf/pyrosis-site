import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FizzParticles from './FizzParticles'
import { useSite } from '../../context/SiteContext'
import styles from './Hero.module.css'

export default function Hero() {
  const { config } = useSite()
  const { kicker, sub, btnPrimary, btnGhost, stats, heroFlavors, heroImages } = config.hero
  const flavors = heroFlavors.length > 0 ? heroFlavors : [{ name: 'Citrus Burst', emoji: '🍊', color: '#FF5C1A', dark: '#C43D08' }]
  const images = heroImages && heroImages.filter(Boolean).length > 0 ? heroImages.filter(Boolean) : ['/images/product-hero.jpg']
  const [idx, setIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const flavor = flavors[idx % flavors.length]

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % flavors.length), 4500)
    return () => clearInterval(t)
  }, [flavors.length])

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => setImgIdx(i => (i + 1) % images.length), 4500)
    return () => clearInterval(t)
  }, [images.length])

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

      {/* ── MASKED PRODUCT PHOTO CAROUSEL ── */}
      <div className={styles.photoWrap}>
        <AnimatePresence mode="sync">
          <motion.img
            key={images[imgIdx % images.length]}
            src={images[imgIdx % images.length]}
            alt="Pyrosis soda"
            className={styles.productPhoto}
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: images.length > 1 ? 'absolute' : 'relative', inset: 0 }}
          />
        </AnimatePresence>
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
          {kicker}
        </motion.p>

        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          SPARKLING
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
          </AnimatePresence>
          SODA
        </motion.h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.55 }}
        >
          {sub}
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
            {btnPrimary}
          </motion.a>
          <a href="#flavors" className={styles.btnGhost}>
            {btnGhost}
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
                width: i === idx ? 32 : 10,
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
        {stats.map(({ num, label }) => (
          <div key={label} className={styles.statItem}>
            <strong className={styles.statN} style={{ color: flavor.color }}>{num}</strong>
            <span className={styles.statL}>{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
