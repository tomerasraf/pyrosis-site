import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import styles from '../../pages/AdminPage.module.css'

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}

function BenefitCard({ item, index, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false)
  const set = (key, value) => onUpdate(index, { ...item, [key]: value })

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F5EDE0' }}>{item.title}</div>
        </div>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: item.color, flexShrink: 0 }} />
        <span className={`${styles.cardChevron} ${open ? styles.cardChevronOpen : ''}`}>▼</span>
      </div>
      {open && (
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <Field label="Icon (emoji)">
              <input className={styles.input} value={item.icon} onChange={e => set('icon', e.target.value)} />
            </Field>
            <Field label="Title">
              <input className={styles.input} value={item.title} onChange={e => set('title', e.target.value)} />
            </Field>
          </div>
          <Field label="Description">
            <textarea className={styles.textarea} value={item.desc} rows={3}
              onChange={e => set('desc', e.target.value)} />
          </Field>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Field label="Accent color">
              <input type="color" className={styles.colorPicker} value={item.color}
                onChange={e => set('color', e.target.value)} />
            </Field>
            <button className={styles.btnRemove} style={{ marginTop: '1.4rem' }}
              onClick={() => onRemove(index)}>Remove card</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TabBenefits({ onSaved }) {
  const { config, updateSection } = useSite()
  const b = config.benefits

  const set = (key, value) => { updateSection('benefits', { [key]: value }); onSaved() }

  const updateItem = (i, newItem) => {
    const next = b.items.map((item, idx) => idx === i ? newItem : item)
    updateSection('benefits', { items: next })
    onSaved()
  }

  const removeItem = (i) => {
    updateSection('benefits', { items: b.items.filter((_, idx) => idx !== i) })
    onSaved()
  }

  const addItem = () => {
    updateSection('benefits', {
      items: [...b.items, { icon: '✦', title: 'New Benefit', color: '#FF5C1A', desc: 'Description here.' }]
    })
    onSaved()
  }

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Section Header</div>
        <Field label="Eyebrow">
          <input className={styles.input} value={b.eyebrow} onChange={e => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Title">
          <input className={styles.input} value={b.title} onChange={e => set('title', e.target.value)} />
        </Field>
        <Field label="Subtitle">
          <textarea className={styles.textarea} rows={2} value={b.sub}
            onChange={e => set('sub', e.target.value)} />
        </Field>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Benefit Cards</div>
        {b.items.map((item, i) => (
          <BenefitCard key={i} item={item} index={i} onUpdate={updateItem} onRemove={removeItem} />
        ))}
        <button className={styles.btnAdd} onClick={addItem}>+ Add Card</button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Claim Banner</div>
        <div className={styles.row}>
          <Field label="Big number">
            <input className={styles.input} value={b.claimNum} onChange={e => set('claimNum', e.target.value)} />
          </Field>
          <Field label="Claim text">
            <input className={styles.input} value={b.claimText} onChange={e => set('claimText', e.target.value)} />
          </Field>
        </div>
        <Field label="Link text">
          <input className={styles.input} value={b.claimLink} onChange={e => set('claimLink', e.target.value)} />
        </Field>
      </div>
    </div>
  )
}
