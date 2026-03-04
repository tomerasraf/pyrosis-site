import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { PRODUCTS as BASE_PRODUCTS } from '../../data/products'
import styles from '../../pages/AdminPage.module.css'

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}

function ProductCard({ base, override, onUpdate }) {
  const [open, setOpen] = useState(false)
  const p = { ...base, ...override }

  const set = (key, value) => onUpdate(base.id, { [key]: value })

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: '1.4rem' }}>{p.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F5EDE0' }}>{p.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#9C8878' }}>{p.flavor} · ${p.price.toFixed(2)}</div>
        </div>
        <label className={styles.toggle} onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={p.inStock}
            onChange={e => set('inStock', e.target.checked)}
          />
          <span className={styles.toggleTrack} />
        </label>
        <span style={{ fontSize: '0.7rem', color: '#9C8878', marginLeft: '0.25rem' }}>
          {p.inStock ? 'In Stock' : 'Out'}
        </span>
        <span className={`${styles.cardChevron} ${open ? styles.cardChevronOpen : ''}`}>▼</span>
      </div>

      {open && (
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <Field label="Name">
              <input className={styles.input} value={p.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Flavor line">
              <input className={styles.input} value={p.flavor} onChange={e => set('flavor', e.target.value)} />
            </Field>
          </div>

          <Field label="Short description">
            <input className={styles.input} value={p.desc} onChange={e => set('desc', e.target.value)} />
          </Field>

          <div className={styles.row3}>
            <Field label="Price (single)">
              <input className={styles.input} type="number" step="0.01" min="0" value={p.price}
                onChange={e => set('price', parseFloat(e.target.value) || 0)} />
            </Field>
            <Field label="Price (4-pack)">
              <input className={styles.input} type="number" step="0.01" min="0" value={p.pricePack4}
                onChange={e => set('pricePack4', parseFloat(e.target.value) || 0)} />
            </Field>
            <Field label="Price (12-pack)">
              <input className={styles.input} type="number" step="0.01" min="0" value={p.pricePack12}
                onChange={e => set('pricePack12', parseFloat(e.target.value) || 0)} />
            </Field>
          </div>

          <div className={styles.row}>
            <Field label="Tag badge">
              <input className={styles.input} value={p.tag} onChange={e => set('tag', e.target.value)} />
            </Field>
            <Field label="Tags (comma-separated)">
              <input className={styles.input} value={p.tags?.join(', ') ?? ''}
                onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
            </Field>
          </div>

          <div className={styles.row3}>
            <Field label="Accent color">
              <input type="color" className={styles.colorPicker} value={p.color}
                onChange={e => set('color', e.target.value)} />
            </Field>
            <Field label="Accent color 2">
              <input type="color" className={styles.colorPicker} value={p.color2}
                onChange={e => set('color2', e.target.value)} />
            </Field>
            <Field label="Background color">
              <input type="color" className={styles.colorPicker} value={p.bg}
                onChange={e => set('bg', e.target.value)} />
            </Field>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TabProducts({ onSaved }) {
  const { config, updateProduct, updateSection } = useSite()
  const p = config.products

  const handleUpdate = (id, patch) => {
    updateProduct(id, patch)
    onSaved()
  }

  const setP = (key, val) => { updateSection('products', { [key]: val }); onSaved() }

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Section Header</div>
        <div className={styles.row}>
          <Field label="Eyebrow">
            <input className={styles.input} value={p.eyebrow} onChange={e => setP('eyebrow', e.target.value)} />
          </Field>
          <Field label="View all link text">
            <input className={styles.input} value={p.viewAllText} onChange={e => setP('viewAllText', e.target.value)} />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea className={styles.textarea} rows={2} value={p.subtitle}
            onChange={e => setP('subtitle', e.target.value)} />
        </Field>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Products</div>
        <p style={{ fontSize: '0.82rem', color: '#9C8878', marginBottom: '1rem' }}>
          Click a product to expand. Toggle the switch to control stock status.
        </p>
        {BASE_PRODUCTS.map(base => (
          <ProductCard
            key={base.id}
            base={base}
            override={config.products.overrides[base.id] ?? {}}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  )
}
