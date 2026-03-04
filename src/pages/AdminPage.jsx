import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import TabHero from '../components/Admin/TabHero'
import TabBenefits from '../components/Admin/TabBenefits'
import TabProducts from '../components/Admin/TabProducts'
import TabColors from '../components/Admin/TabColors'
import TabText from '../components/Admin/TabText'
import TabMedia from '../components/Admin/TabMedia'
import styles from './AdminPage.module.css'

const TABS = ['Hero', 'Benefits', 'Products', 'Colors', 'Text & Footer', 'Photos & Videos']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [savedVisible, setSavedVisible] = useState(false)
  const { resetConfig } = useSite()
  const navigate = useNavigate()

  const onSaved = useCallback(() => {
    setSavedVisible(true)
    setTimeout(() => setSavedVisible(false), 1800)
  }, [])

  const handleReset = () => {
    if (confirm('Reset all customizations to defaults?')) {
      resetConfig()
      onSaved()
    }
  }

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>PYROSIS</span>
          <span className={styles.badge}>Admin</span>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.saved} ${savedVisible ? styles.savedVisible : ''}`}>
            ✓ Saved
          </span>
          <button className={styles.btnReset} onClick={handleReset}>
            Reset All
          </button>
          <button className={styles.btnBack} onClick={() => navigate('/')}>
            ← Back to Site
          </button>
        </div>
      </header>

      <nav className={styles.tabs}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`${styles.tab} ${i === activeTab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {activeTab === 0 && <TabHero onSaved={onSaved} />}
        {activeTab === 1 && <TabBenefits onSaved={onSaved} />}
        {activeTab === 2 && <TabProducts onSaved={onSaved} />}
        {activeTab === 3 && <TabColors onSaved={onSaved} />}
        {activeTab === 4 && <TabText onSaved={onSaved} />}
        {activeTab === 5 && <TabMedia onSaved={onSaved} />}
      </div>
    </div>
  )
}
