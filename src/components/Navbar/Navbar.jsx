import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

const sectionLinks = [
  { label: 'Flavors',   href: '#flavors' },
  { label: 'Our Story', href: '#story' },
  { label: 'Good Stuff', href: '#benefits' },
  { label: 'Reviews',   href: '#reviews' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalQty, dispatch: cartDispatch } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>PYROSIS</span>
          <span className={styles.logoSup}>®</span>
        </Link>

        <ul className={styles.links}>
          {isHome ? (
            sectionLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>{link.label}</a>
              </li>
            ))
          ) : (
            <>
              <li><Link to="/" className={styles.link}>Home</Link></li>
              <li><Link to="/shop" className={styles.link}>Shop</Link></li>
            </>
          )}
        </ul>

        <div className={styles.navRight}>
          <Link to="/shop" className={styles.ctaBtn}>Shop Now</Link>

          <Link to="/account" className={styles.accountBtn}>
            {isAuthenticated ? user.name.split(' ')[0] : 'Sign In'}
          </Link>

          <motion.button
            className={styles.cartBtn}
            onClick={() => cartDispatch({ type: 'TOGGLE_OPEN' })}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Open cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <AnimatePresence>
              {totalQty > 0 && (
                <motion.span
                  key="badge"
                  className={styles.cartBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {totalQty}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barTop : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barMid : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barBot : ''}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {isHome ? sectionLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 + 0.05 }}
              >
                {link.label}
              </motion.a>
            )) : (
              <>
                <Link to="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/shop" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Shop</Link>
                <Link to="/account" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Account</Link>
              </>
            )}
            <Link to="/shop" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
              Shop All Flavors →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
