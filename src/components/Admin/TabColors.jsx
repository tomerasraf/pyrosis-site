import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import styles from '../../pages/AdminPage.module.css'

const COLOR_META = {
  '--cream':      'Page Background',
  '--cream-dark': 'Subtle Background',
  '--cream-mid':  'Mid Background',
  '--ink':        'Primary Text',
  '--ink-soft':   'Secondary Text',
  '--muted':      'Muted Text',
  '--citrus':     'Citrus Accent',
  '--berry':      'Berry Accent',
  '--tropical':   'Tropical Accent',
  '--grape':      'Grape Accent',
  '--lemon':      'Lemon Accent',
  '--cherry':     'Cherry Accent',
  '--forest':     'Dark Green (Sections)',
  '--sage':       'Sage Green',
  '--peach':      'Peach',
}

function ColorRow({ varName, label, value, onChange }) {
  const [hex, setHex] = useState(value)

  const handlePicker = (e) => {
    setHex(e.target.value)
    onChange(varName, e.target.value)
  }

  const handleText = (e) => {
    const val = e.target.value
    setHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChange(varName, val)
    }
  }

  return (
    <div className={styles.colorRow}>
      <div className={styles.colorSwatch} style={{ background: hex }} />
      <span className={styles.colorVarName}>{varName}</span>
      <span className={styles.colorLabel}>{label}</span>
      <div className={styles.colorInputWrap}>
        <input
          type="color"
          className={styles.colorPicker}
          value={hex}
          onChange={handlePicker}
        />
        <input
          type="text"
          className={styles.colorHex}
          value={hex}
          onChange={handleText}
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default function TabColors({ onSaved }) {
  const { config, updateSection } = useSite()

  const handleChange = (varName, value) => {
    updateSection('colors', { ...config.colors, [varName]: value })
    onSaved()
  }

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>CSS Color Variables</div>
        <p style={{ fontSize: '0.82rem', color: '#9C8878', marginBottom: '1rem' }}>
          Changes apply instantly to the entire site. Colors are saved automatically.
        </p>
        {Object.entries(config.colors).map(([varName, value]) => (
          <ColorRow
            key={varName}
            varName={varName}
            label={COLOR_META[varName] ?? varName}
            value={value}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  )
}
