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

function MarqueeEditor({ items, onChange }) {
  const [newItem, setNewItem] = useState('')

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  const add = () => {
    if (!newItem.trim()) return
    onChange([...items, newItem.trim()])
    setNewItem('')
  }

  return (
    <div>
      <div className={styles.pillWrap}>
        {items.map((item, i) => (
          <span key={i} className={styles.pill}>
            {item}
            <button className={styles.pillX} onClick={() => remove(i)}>✕</button>
          </span>
        ))}
      </div>
      <div className={styles.pillAddRow}>
        <input
          className={styles.input}
          placeholder="Add item..."
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className={styles.btnSmall} onClick={add}>Add</button>
      </div>
    </div>
  )
}

function FooterLinks({ links, onChange }) {
  const updateItem = (cat, i, value) => {
    const next = {
      ...links,
      [cat]: links[cat].map((l, idx) => idx === i ? value : l),
    }
    onChange(next)
  }

  const removeItem = (cat, i) => {
    onChange({ ...links, [cat]: links[cat].filter((_, idx) => idx !== i) })
  }

  const addItem = (cat) => {
    onChange({ ...links, [cat]: [...links[cat], 'New Link'] })
  }

  return (
    <div>
      {Object.entries(links).map(([cat, ls]) => (
        <div key={cat} className={styles.linkCat}>
          <div className={styles.linkCatTitle}>{cat}</div>
          {ls.map((l, i) => (
            <div key={i} className={styles.linkItem}>
              <input className={styles.input} value={l}
                onChange={e => updateItem(cat, i, e.target.value)} />
              <button className={styles.btnRemove} onClick={() => removeItem(cat, i)}>✕</button>
            </div>
          ))}
          <button className={styles.btnAdd} style={{ marginTop: '0.25rem' }}
            onClick={() => addItem(cat)}>+ Add link</button>
        </div>
      ))}
    </div>
  )
}

export default function TabText({ onSaved }) {
  const { config, updateSection } = useSite()
  const v = config.video
  const t = config.testimonials
  const f = config.footer
  const m = config.marquee

  const setV = (key, val) => { updateSection('video', { [key]: val }); onSaved() }
  const setT = (key, val) => { updateSection('testimonials', { [key]: val }); onSaved() }
  const setF = (key, val) => { updateSection('footer', { [key]: val }); onSaved() }
  const setM = (key, val) => { updateSection('marquee', { [key]: val }); onSaved() }

  const setStat = (i, key, value) => {
    const next = t.stats.map((s, idx) => idx === i ? { ...s, [key]: value } : s)
    updateSection('testimonials', { stats: next })
    onSaved()
  }

  return (
    <div>
      {/* ── Video / Our Story ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Our Story Section</div>
        <div className={styles.row}>
          <Field label="Eyebrow">
            <input className={styles.input} value={v.eyebrow} onChange={e => setV('eyebrow', e.target.value)} />
          </Field>
          <Field label="Video label">
            <input className={styles.input} value={v.videoLabel} onChange={e => setV('videoLabel', e.target.value)} />
          </Field>
        </div>
        <Field label="Title">
          <input className={styles.input} value={v.title} onChange={e => setV('title', e.target.value)} />
        </Field>
        <Field label="Body paragraph 1">
          <textarea className={styles.textarea} rows={3} value={v.body1}
            onChange={e => setV('body1', e.target.value)} />
        </Field>
        <Field label="Body paragraph 2">
          <textarea className={styles.textarea} rows={3} value={v.body2}
            onChange={e => setV('body2', e.target.value)} />
        </Field>
        <div className={styles.row}>
          <Field label="Video caption">
            <input className={styles.input} value={v.caption} onChange={e => setV('caption', e.target.value)} />
          </Field>
          <Field label="Link text">
            <input className={styles.input} value={v.linkText} onChange={e => setV('linkText', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Testimonials Section</div>
        <div className={styles.row}>
          <Field label="Eyebrow">
            <input className={styles.input} value={t.eyebrow} onChange={e => setT('eyebrow', e.target.value)} />
          </Field>
          <Field label="Title">
            <input className={styles.input} value={t.title} onChange={e => setT('title', e.target.value)} />
          </Field>
        </div>
        <div className={styles.sectionTitle} style={{ marginTop: '1rem' }}>Summary Stats</div>
        {t.stats.map((s, i) => (
          <div key={i} className={styles.row} style={{ marginBottom: '0.5rem' }}>
            <Field label={`Stat ${i + 1} — Value`}>
              <input className={styles.input} value={s.val} onChange={e => setStat(i, 'val', e.target.value)} />
            </Field>
            <Field label="Label">
              <input className={styles.input} value={s.label} onChange={e => setStat(i, 'label', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Footer</div>
        <Field label="CTA Headline">
          <input className={styles.input} value={f.ctaHeadline} onChange={e => setF('ctaHeadline', e.target.value)} />
        </Field>
        <div className={styles.row}>
          <Field label="CTA Primary button">
            <input className={styles.input} value={f.ctaBtnPrimary} onChange={e => setF('ctaBtnPrimary', e.target.value)} />
          </Field>
          <Field label="CTA Secondary link">
            <input className={styles.input} value={f.ctaBtnSecondary} onChange={e => setF('ctaBtnSecondary', e.target.value)} />
          </Field>
        </div>
        <Field label="Brand tagline (use \\n for line break)">
          <input className={styles.input} value={f.tagline} onChange={e => setF('tagline', e.target.value)} />
        </Field>
        <div className={styles.row}>
          <Field label="Newsletter text">
            <input className={styles.input} value={f.newsletterText} onChange={e => setF('newsletterText', e.target.value)} />
          </Field>
          <Field label="Copyright">
            <input className={styles.input} value={f.copyright} onChange={e => setF('copyright', e.target.value)} />
          </Field>
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>Navigation Links</div>
        <FooterLinks
          links={f.links}
          onChange={next => { updateSection('footer', { links: next }); onSaved() }}
        />
      </div>

      {/* ── Marquee ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Marquee Items</div>
        <p style={{ fontSize: '0.82rem', color: '#9C8878', marginBottom: '0.75rem' }}>
          These scroll across both marquee bands. Include emojis as separate items.
        </p>
        <MarqueeEditor
          items={m.items}
          onChange={next => setM('items', next)}
        />
      </div>
    </div>
  )
}
