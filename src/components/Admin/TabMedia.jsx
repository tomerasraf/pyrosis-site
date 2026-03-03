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

function UrlInput({ value, onChange, placeholder }) {
  return (
    <div className={styles.mediaRow}>
      <input
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
      {value && (
        <button
          className={styles.btnRemove}
          style={{ flexShrink: 0 }}
          onClick={() => onChange('')}
          title="Clear"
        >✕</button>
      )}
    </div>
  )
}

function ImagePreview({ src }) {
  if (!src) return null
  return (
    <div className={styles.mediaPreview}>
      <img src={src} alt="preview" className={styles.mediaPreviewImg} />
    </div>
  )
}

function VideoPreview({ src }) {
  if (!src) return null
  return (
    <div className={styles.mediaPreview}>
      <video src={src} autoPlay muted loop playsInline className={styles.mediaPreviewImg} />
    </div>
  )
}

export default function TabMedia({ onSaved }) {
  const { config, updateSection } = useSite()
  const heroImages = config.hero.heroImages ?? ['/images/product-hero.jpg']
  const media = config.media

  /* ── Hero carousel helpers ── */
  const setHeroImages = (next) => {
    updateSection('hero', { heroImages: next })
    onSaved()
  }
  const addHeroImage = () => setHeroImages([...heroImages, ''])
  const removeHeroImage = (i) => setHeroImages(heroImages.filter((_, idx) => idx !== i))
  const updateHeroImage = (i, val) => setHeroImages(heroImages.map((img, idx) => idx === i ? val : img))

  /* ── Video helpers ── */
  const setVideo = (key, val) => {
    updateSection('media', { [key]: val })
    onSaved()
  }

  /* ── Product image helpers ── */
  const setProductImage = (id, val) => {
    updateSection('media', {
      productImages: { ...media.productImages, [id]: val }
    })
    onSaved()
  }

  return (
    <div>
      {/* ── Hero Carousel ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Hero Image Carousel</div>
        <p style={{ fontSize: '0.82rem', color: '#9C8878', marginBottom: '1rem' }}>
          Add image URLs or local paths (e.g. <code style={{ color: '#FF5C1A' }}>/images/hero-2.jpg</code>).
          Multiple images will fade in/out synced with the flavor rotation.
        </p>
        {heroImages.map((img, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <Field label={`Image ${i + 1}`}>
              <UrlInput
                value={img}
                onChange={val => updateHeroImage(i, val)}
                placeholder="/images/your-photo.jpg or https://..."
              />
            </Field>
            {img && <ImagePreview src={img} />}
            {heroImages.length > 1 && (
              <button className={styles.btnRemove} style={{ marginTop: '0.25rem' }}
                onClick={() => removeHeroImage(i)}>Remove</button>
            )}
          </div>
        ))}
        <button className={styles.btnAdd} onClick={addHeroImage}>+ Add Image</button>
      </div>

      {/* ── About / Story Videos ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>About Section Videos</div>
        <p style={{ fontSize: '0.82rem', color: '#9C8878', marginBottom: '1rem' }}>
          Paste a URL or local path (e.g. <code style={{ color: '#FF5C1A' }}>/videos/my-video.webm</code>).
        </p>

        <Field label="Main video (large left)">
          <UrlInput
            value={media.videoMain}
            onChange={val => setVideo('videoMain', val)}
            placeholder="/videos/soda-cans.webm"
          />
        </Field>
        <VideoPreview src={media.videoMain} />

        <Field label="Small video (right column)">
          <UrlInput
            value={media.videoSmall}
            onChange={val => setVideo('videoSmall', val)}
            placeholder="/videos/soda-pour.webm"
          />
        </Field>
        <VideoPreview src={media.videoSmall} />

        <div className={styles.row}>
          <div>
            <Field label="Bottom video 1 (left)">
              <UrlInput
                value={media.videoBottom1}
                onChange={val => setVideo('videoBottom1', val)}
                placeholder="/videos/soda-lifestyle.webm"
              />
            </Field>
            <VideoPreview src={media.videoBottom1} />
          </div>
          <div>
            <Field label="Bottom video 2 (right)">
              <UrlInput
                value={media.videoBottom2}
                onChange={val => setVideo('videoBottom2', val)}
                placeholder="/videos/soda-bubbles.webm"
              />
            </Field>
            <VideoPreview src={media.videoBottom2} />
          </div>
        </div>
      </div>

      {/* ── Product Photos ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Product Photos</div>
        <p style={{ fontSize: '0.82rem', color: '#9C8878', marginBottom: '1rem' }}>
          Optional. If set, replaces the emoji icon on the product card. Leave blank to use emoji.
        </p>
        {BASE_PRODUCTS.map(p => (
          <div key={p.id} style={{ marginBottom: '1rem' }}>
            <Field label={`${p.icon} ${p.name}`}>
              <UrlInput
                value={media.productImages[p.id] ?? ''}
                onChange={val => setProductImage(p.id, val)}
                placeholder={`/images/product-${p.id}.jpg`}
              />
            </Field>
            {media.productImages[p.id] && <ImagePreview src={media.productImages[p.id]} />}
          </div>
        ))}
      </div>
    </div>
  )
}
