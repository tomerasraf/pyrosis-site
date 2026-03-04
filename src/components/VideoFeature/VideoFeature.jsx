import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useSite } from '../../context/SiteContext'
import styles from './VideoFeature.module.css'

export default function VideoFeature() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const { config } = useSite()
  const { eyebrow, title, body1, body2, videoLabel, caption, linkText } = config.video
  const { videoMain, videoSmall, videoBottom1, videoBottom2 } = config.media

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
            src={videoMain || '/videos/soda-cans.webm'}
            autoPlay muted loop playsInline
          />
          <div className={styles.videoLabel}>
            <span>{videoLabel}</span>
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
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.body}>{body1}</p>
            <p className={styles.body}>{body2}</p>
            <a href="#benefits" className={styles.link}>{linkText}</a>
          </motion.div>

          <motion.div
            className={styles.videoSmall}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <video
              className={styles.video}
              src={videoSmall || '/videos/soda-pour.webm'}
              autoPlay muted loop playsInline
            />
            <div className={styles.smallCaption}>{caption}</div>
          </motion.div>
        </div>
      </div>

      {/* Bottom: two more videos side by side */}
      <div className={styles.bottomRow}>
        {[videoBottom1 || '/videos/soda-lifestyle.webm', videoBottom2 || '/videos/soda-bubbles.webm'].map((src, i) => (
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
