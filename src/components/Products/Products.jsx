import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { PRODUCTS as BASE_PRODUCTS } from '../../data/products'
import { useSite } from '../../context/SiteContext'
import styles from './Products.module.css'

function Card({ p, i, productImage }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { dispatch } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    dispatch({ type: 'ADD', product: p })
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      style={{ '--c': p.color, '--bg': p.bg }}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${p.id}`} className={styles.cardVisual}>
        <span className={styles.blob} />
        {productImage
          ? <img src={productImage} alt={p.name} className={styles.cardImg} />
          : <span className={styles.cardIcon}>{p.icon}</span>
        }
        <span className={styles.cardTag}>{p.tag}</span>
      </Link>

      <div className={styles.cardBody}>
        <div>
          <p className={styles.flavorLine}>{p.flavor}</p>
          <h3 className={styles.cardName}>{p.name}</h3>
          <p className={styles.cardDesc}>{p.desc}</p>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.priceRow}>
            <span className={styles.price}>${p.price.toFixed(2)}</span>
            <span className={styles.cals}>{p.cals} cal</span>
          </div>
          <motion.button
            className={`${styles.addBtn} ${added ? styles.addBtnDone : ''}`}
            onClick={handleAdd}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={added ? 'done' : 'add'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {added ? '✓ Added' : 'Add +'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

export default function Products() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { config } = useSite()
  const { eyebrow, subtitle, viewAllText, overrides } = config.products
  const productImages = config.media?.productImages ?? {}
  const products = BASE_PRODUCTS.map(p => ({ ...p, ...(overrides[p.id] ?? {}) }))

  return (
    <section className={styles.section} id="flavors">
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.title}>
            THE<br />LINEUP
          </h2>
          <p className={styles.subtitle}>
            {subtitle.split('\n').map((line, i) => (
              <span key={i}>{line}{i < subtitle.split('\n').length - 1 && <br />}</span>
            ))}
          </p>
        </motion.div>

        <div className={styles.grid}>
          {products.map((p, i) => <Card key={p.id} p={p} i={i} productImage={productImages[p.id] || ''} />)}
        </div>

        <div className={styles.viewAll}>
          <a href="#shop" className={styles.viewBtn}>{viewAllText}</a>
        </div>
      </div>
    </section>
  )
}
