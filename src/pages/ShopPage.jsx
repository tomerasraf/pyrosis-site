import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../data/products'
import styles from './ShopPage.module.css'

const TAGS = ['All', 'Bright', 'Bold', 'Tropical', 'Zesty', 'Floral', 'Crisp', 'Cooling', 'Deep', 'Spiced', 'Smooth', 'Complex', 'Unique', 'Clean', 'Creamy', 'Velvety', 'Energizing']
const UNIQUE_TAGS = ['All', ...new Set(PRODUCTS.flatMap(p => p.tags))]

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'cals-asc', label: 'Calories: Low → High' },
]

function ProductCard({ p }) {
  const { dispatch } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    dispatch({ type: 'ADD', product: p })
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      className={styles.card}
      style={{ '--c': p.color, '--bg': p.bg }}
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${p.id}`} className={styles.cardVisual}>
        <span className={styles.blob} />
        <span className={styles.cardIcon}>{p.icon}</span>
        <span className={styles.cardTag}>{p.tag}</span>
      </Link>
      <div className={styles.cardBody}>
        <div>
          <p className={styles.flavorLine}>{p.flavor}</p>
          <h3 className={styles.cardName}>{p.name}</h3>
          <p className={styles.cardDesc}>{p.desc}</p>
          <div className={styles.tagRow}>
            {p.tags.map(t => (
              <span key={t} className={styles.pill}>{t}</span>
            ))}
          </div>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.priceRow}>
            <span className={styles.price}>${p.price.toFixed(2)}</span>
            <span className={styles.cals}>{p.cals} cal · {p.caffeine}</span>
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

export default function ShopPage() {
  const [activeTag, setActiveTag] = useState('All')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let list = activeTag === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.tags.includes(activeTag))
    if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'cals-asc')   list = [...list].sort((a, b) => a.cals - b.cals)
    return list
  }, [activeTag, sort])

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          THE FULL LINEUP
        </motion.h1>
        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Six flavors. All real. Zero compromise.
        </motion.p>
      </div>

      <div className={styles.container}>
        <div className={styles.controls}>
          <div className={styles.tagScroll}>
            {UNIQUE_TAGS.map(tag => (
              <button
                key={tag}
                className={`${styles.tagBtn} ${activeTag === tag ? styles.tagBtnActive : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <p className={styles.resultCount}>{filtered.length} flavor{filtered.length !== 1 ? 's' : ''}</p>

        <motion.div className={styles.grid} layout>
          <AnimatePresence mode="popLayout">
            {filtered.map(p => <ProductCard key={p.id} p={p} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
