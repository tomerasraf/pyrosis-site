import { useState, useRef } from 'react'
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

function FlavorList({ flavors, onChange }) {
  const dragIdx = useRef(null)

  const update = (i, key, value) => {
    const next = flavors.map((f, idx) => idx === i ? { ...f, [key]: value } : f)
    onChange(next)
  }

  const remove = (i) => onChange(flavors.filter((_, idx) => idx !== i))

  const add = () => onChange([...flavors, { name: 'New Flavor', emoji: '✦', color: '#FF5C1A', dark: '#C43D08' }])

  const onDragStart = (i) => { dragIdx.current = i }

  const onDrop = (i) => {
    const from = dragIdx.current
    if (from === null || from === i) return
    const next = [...flavors]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    onChange(next)
    dragIdx.current = null
  }

  return (
    <div>
      {flavors.map((f, i) => (
        <div
          key={i}
          className={styles.flavorRow}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => onDrop(i)}
        >
          <span className={styles.flavorDrag}>⠿</span>
          <div className={styles.flavorInputs}>
            <input
              className={styles.input}
              placeholder="Name"
              value={f.name}
              onChange={e => update(i, 'name', e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Emoji"
              value={f.emoji}
              onChange={e => update(i, 'emoji', e.target.value)}
              style={{ maxWidth: 70 }}
            />
            <input
              type="color"
              className={styles.colorPicker}
              value={f.color}
              onChange={e => update(i, 'color', e.target.value)}
              title="Accent color"
            />
            <input
              type="color"
              className={styles.colorPicker}
              value={f.dark}
              onChange={e => update(i, 'dark', e.target.value)}
              title="Dark color"
            />
          </div>
          <button className={styles.btnRemove} onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className={styles.btnAdd} onClick={add}>+ Add Flavor</button>
    </div>
  )
}

export default function TabHero({ onSaved }) {
  const { config, updateSection } = useSite()
  const hero = config.hero

  const set = (key, value) => {
    updateSection('hero', { [key]: value })
    onSaved()
  }

  const setStat = (i, key, value) => {
    const next = hero.stats.map((s, idx) => idx === i ? { ...s, [key]: value } : s)
    updateSection('hero', { stats: next })
    onSaved()
  }

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Copy</div>
        <Field label="Kicker text">
          <input className={styles.input} value={hero.kicker} onChange={e => set('kicker', e.target.value)} />
        </Field>
        <Field label="Sub text">
          <input className={styles.input} value={hero.sub} onChange={e => set('sub', e.target.value)} />
        </Field>
        <div className={styles.row}>
          <Field label="Primary button">
            <input className={styles.input} value={hero.btnPrimary} onChange={e => set('btnPrimary', e.target.value)} />
          </Field>
          <Field label="Ghost button">
            <input className={styles.input} value={hero.btnGhost} onChange={e => set('btnGhost', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Stats Bar</div>
        {hero.stats.map((s, i) => (
          <div key={i} className={styles.row} style={{ marginBottom: '0.5rem' }}>
            <Field label={`Stat ${i + 1} — Number`}>
              <input className={styles.input} value={s.num} onChange={e => setStat(i, 'num', e.target.value)} />
            </Field>
            <Field label="Label">
              <input className={styles.input} value={s.label} onChange={e => setStat(i, 'label', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Flavor Rotation</div>
        <p style={{ fontSize: '0.82rem', color: '#9C8878', marginBottom: '1rem' }}>
          Drag to reorder. These cycle automatically in the hero.
        </p>
        <FlavorList
          flavors={hero.heroFlavors}
          onChange={next => { updateSection('hero', { heroFlavors: next }); onSaved() }}
        />
      </div>
    </div>
  )
}
