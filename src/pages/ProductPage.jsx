import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { getProductById, PRODUCTS } from '../data/products'
import styles from './ProductPage.module.css'

const PACKS = [
  { label: 'Single Can', qty: 1, priceKey: 'price' },
  { label: '4-Pack', qty: 4, priceKey: 'pricePack4' },
  { label: '12-Pack', qty: 12, priceKey: 'pricePack12' },
]

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch } = useCart()
  const product = getProductById(id)
  const [packIdx, setPackIdx] = useState(0)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <main className={styles.notFound}>
        <h2>Flavor not found.</h2>
        <Link to="/shop" className={styles.backBtn}>← Back to shop</Link>
      </main>
    )
  }

  const pack = PACKS[packIdx]
  const price = product[pack.priceKey]

  const handleAdd = () => {
    dispatch({
      type: 'ADD',
      product: {
        ...product,
        id: `${product.id}-pack${packIdx}`,
        price,
        packLabel: pack.label,
        qty: 1,
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3)

  return (
    <main className={styles.page} style={{ '--c': product.color, '--bg': product.bg }}>
      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className={styles.container}>
        {/* Visual side */}
        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.visualInner}>
            <span className={styles.blob} />
            <span className={styles.mainIcon}>{product.icon}</span>
            <span className={styles.tagBadge}>{product.tag}</span>
          </div>
        </motion.div>

        {/* Info side */}
        <motion.div
          className={styles.info}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.flavorLine}>{product.subtitle}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.desc}>{product.longDesc}</p>

          <div className={styles.pillRow}>
            {product.tags.map(t => (
              <span key={t} className={styles.pill}>{t}</span>
            ))}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{product.cals}</span>
              <span className={styles.statLabel}>Calories</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{product.sugar}</span>
              <span className={styles.statLabel}>Sugar</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{product.caffeine}</span>
              <span className={styles.statLabel}>Caffeine</span>
            </div>
          </div>

          {/* Pack selector */}
          <div className={styles.packSection}>
            <p className={styles.packLabel}>Choose your pack</p>
            <div className={styles.packRow}>
              {PACKS.map((p, i) => (
                <button
                  key={i}
                  className={`${styles.packBtn} ${packIdx === i ? styles.packBtnActive : ''}`}
                  onClick={() => setPackIdx(i)}
                >
                  <span className={styles.packName}>{p.label}</span>
                  <span className={styles.packPrice}>${product[p.priceKey].toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.ctaRow}>
            <motion.button
              className={`${styles.addBtn} ${added ? styles.addBtnDone : ''}`}
              onClick={handleAdd}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {added ? '✓ Added to Cart' : `Add ${pack.label} — $${price.toFixed(2)}`}
            </motion.button>
          </div>

          {/* Ingredients */}
          <details className={styles.details}>
            <summary>Ingredients</summary>
            <p className={styles.ingredientList}>{product.ingredients.join(', ')}</p>
          </details>

          {/* Nutrition */}
          <details className={styles.details}>
            <summary>Nutrition Facts</summary>
            <div className={styles.nutrition}>
              <div className={styles.nutRow}><span>Serving Size</span><span>{product.nutrition.servingSize}</span></div>
              <div className={styles.nutRow}><span>Calories</span><strong>{product.nutrition.calories}</strong></div>
              <div className={styles.nutRow}><span>Total Fat</span><span>{product.nutrition.totalFat}</span></div>
              <div className={styles.nutRow}><span>Sodium</span><span>{product.nutrition.sodium}</span></div>
              <div className={styles.nutRow}><span>Total Carbs</span><span>{product.nutrition.totalCarbs}</span></div>
              <div className={styles.nutRow}><span>Sugar</span><span>{product.nutrition.sugar}</span></div>
              <div className={styles.nutRow}><span>Protein</span><span>{product.nutrition.protein}</span></div>
            </div>
          </details>
        </motion.div>
      </div>

      {/* Related */}
      <div className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>You might also like</h2>
        <div className={styles.relatedGrid}>
          {related.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className={styles.relatedCard} style={{ '--c': p.color, '--bg': p.bg }}>
              <span className={styles.relatedIcon}>{p.icon}</span>
              <div>
                <p className={styles.relatedName}>{p.name}</p>
                <p className={styles.relatedFlavor}>{p.flavor}</p>
              </div>
              <span className={styles.relatedPrice}>${p.price.toFixed(2)}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
