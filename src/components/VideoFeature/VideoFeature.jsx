import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import styles from './VideoFeature.module.css'

export default function VideoFeature() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section className={styles.section} ref={ref} id="story">
      {/* Big editorial quote running across the top */}
      <motion.div
        className={styles.runningText}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
      >
        <span>made with&nbsp;</span>
        <em>real love</em>
        <span>&nbsp;(and real fruit)</span>
      </motion.div>

      <div className={styles.grid}>
        {/* Left: large video */}
        <motion.div
          className={styles.videoMain}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            className={styles.video}
            src="/videos/soda-cans.webm"
            autoPlay muted loop playsInline
          />
          <div className={styles.videoLabel}>
            <span>✦ Crafted in small batches</span>
          </div>
        </motion.div>

        {/* Right: text + small video */}
        <div className={styles.rightCol}>
          <motion.div
            className={styles.textBlock}
            style={{ y }}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.eyebrow}>Our Story</span>
            <h2 className={styles.title}>
              we got<br />
              <em>fed&nbsp;up</em><br />
              with boring soda.
            </h2>
            <p className={styles.body}>
              In 2022, two friends with a blender, 40 pounds of fruit, and a burning
              hatred of high-fructose corn syrup started PYROSIS in a garage.
            </p>
            <p className={styles.body}>
              We wanted soda that tasted like something real — not a chemistry experiment.
              After 200 failed batches (seriously), we cracked the formula.
            </p>
            <a href="#benefits" className={styles.link}>Read the whole story →</a>
          </motion.div>

          <motion.div
            className={styles.videoSmall}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <video
              className={styles.video}
              src="/videos/soda-pour.webm"
              autoPlay muted loop playsInline
            />
            <div className={styles.smallCaption}>The pour — our favorite part.</div>
          </motion.div>
        </div>
      </div>

      {/* Bottom: two more videos side by side */}
      <div className={styles.bottomRow}>
        {['/videos/soda-lifestyle.webm', '/videos/soda-bubbles.webm'].map((src, i) => (
          <motion.div
            key={src}
            className={styles.bottomVideo}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 + i * 0.12 }}
          >
            <video src={src} autoPlay muted loop playsInline className={styles.video} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
