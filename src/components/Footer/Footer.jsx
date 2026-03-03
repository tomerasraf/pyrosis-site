import { motion } from 'framer-motion'
import { useSite } from '../../context/SiteContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { config } = useSite()
  const { ctaHeadline, ctaBtnPrimary, ctaBtnSecondary, tagline, newsletterText, copyright, links } = config.footer

  return (
    <footer className={styles.footer}>
      {/* Big editorial CTA banner */}
      <div className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeadline}>{ctaHeadline}</h2>
          <div className={styles.ctaActions}>
            <motion.a
              href="#shop"
              className={styles.ctaBtn}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {ctaBtnPrimary}
            </motion.a>
            <a href="#flavors" className={styles.ctaSecondary}>
              {ctaBtnSecondary}
            </a>
          </div>
        </div>
        {/* Decorative large emoji row */}
        <div className={styles.emojiRow} aria-hidden>
          {['🍊','🫐','🥭','🍇','🍋','🍒'].map(e => <span key={e}>{e}</span>)}
        </div>
      </div>

      {/* Main footer grid */}
      <div className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.brand}>
              <span className={styles.logo}>PYROSIS<sup className={styles.tm}>®</sup></span>
              <p className={styles.tagline}>
                {tagline.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
              <div className={styles.socials}>
                {['IG', 'TT', 'TW', 'YT'].map(s => (
                  <motion.a
                    key={s}
                    href="#"
                    className={styles.social}
                    whileHover={{ scale: 1.15, background: 'var(--citrus)', color: 'var(--white)' }}
                  >
                    {s}
                  </motion.a>
                ))}
              </div>
            </div>

            {Object.entries(links).map(([cat, ls]) => (
              <div key={cat} className={styles.col}>
                <h5 className={styles.colTitle}>{cat}</h5>
                <ul className={styles.linkList}>
                  {ls.map(l => (
                    <li key={l}><a href="#" className={styles.footLink}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}

            <div className={styles.col}>
              <h5 className={styles.colTitle}>Stay Fizzy</h5>
              <p className={styles.newsletterText}>{newsletterText}</p>
              <form className={styles.form} onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="your@email.com" className={styles.input} />
                <button type="submit" className={styles.submitBtn}>→</button>
              </form>
            </div>
          </div>

          <div className={styles.legalRow}>
            <span className={styles.copy}>{copyright}</span>
            <div className={styles.legal}>
              {['Privacy', 'Terms', 'Accessibility'].map(l => (
                <a key={l} href="#" className={styles.legalLink}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
