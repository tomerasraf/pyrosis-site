import { useState, Suspense, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { useInView } from 'react-intersection-observer'
import { PRODUCTS } from '../../data/products'
import styles from './FlavorExplorer.module.css'

// Use first 4 products for the explorer
const flavors = PRODUCTS.slice(0, 4)

function Orb({ color, color2 }) {
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
      <Sphere args={[1.4, 64, 64]}>
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.25}
          metalness={0.05} roughness={0.25} distort={0.45} speed={2} />
      </Sphere>
    </Float>
  )
}

export default function FlavorExplorer() {
  const [active, setActive] = useState(0)
  const f = flavors[active]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <span className={styles.eyebrow}>Flavor Explorer</span>
          <h2 className={styles.title}>
            find your<br /><em>flavor match.</em>
          </h2>
        </motion.div>

        <div className={styles.layout}>
          {/* Tabs */}
          <motion.nav
            className={styles.tabs}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            {flavors.map((fl, i) => (
              <button
                key={fl.id}
                onClick={() => setActive(i)}
                className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
                style={{ '--c': fl.color }}
              >
                <span className={styles.tabEmoji}>{fl.emoji}</span>
                <span className={styles.tabName}>{fl.name}</span>
                {i === active && (
                  <motion.span layoutId="tabMarker" className={styles.tabMarker} style={{ background: fl.color }} />
                )}
              </button>
            ))}
          </motion.nav>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={f.id}
              className={styles.panel}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              style={{ '--c': f.color }}
            >
              <div className={styles.orbWrap}>
                <Canvas camera={{ position: [0, 0, 3.8], fov: 52 }} dpr={[1, 2]}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[3, 3, 3]} intensity={2.5} color={f.color} />
                  <pointLight position={[-3, -2, 2]} intensity={1.5} color={f.color2} />
                  <Suspense fallback={null}>
                    <Orb color={f.color} color2={f.color2} />
                  </Suspense>
                </Canvas>
              </div>

              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <span className={styles.infoEmoji}>{f.emoji}</span>
                  <div>
                    <h3 className={styles.infoName}>{f.name}</h3>
                    <p className={styles.infoSub}>{f.subtitle}</p>
                  </div>
                </div>

                <p className={styles.infoDesc}>{f.desc}</p>

                <div className={styles.tags}>
                  {f.tags.map(t => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>

                <div className={styles.nutrition}>
                  {[['cals', f.cals], ['sugar', f.sugar], ['caffeine', f.caffeine]].map(([l, v]) => (
                    <div key={l} className={styles.nutriItem}>
                      <strong className={styles.nutriVal}>{v}</strong>
                      <span className={styles.nutriLabel}>{l}</span>
                    </div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={`/product/${f.id}`}
                    className={styles.shopBtn}
                    style={{ background: f.color }}
                  >
                    Try {f.name} →
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
