import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'pyrosis_site_config'

export const DEFAULT_SITE_CONFIG = {
  hero: {
    kicker:     '✦ New flavors just dropped',
    sub:        'Refreshing & all-natural. Real fruit. Zero compromise.',
    btnPrimary: 'SHOP ALL FLAVORS',
    btnGhost:   'See flavors ↓',
    stats: [
      { num: '12+',  label: 'flavors' },
      { num: '0g',   label: 'added sugar' },
      { num: '9B',   label: 'prebiotics' },
      { num: '100%', label: 'real fruit' },
    ],
    heroFlavors: [
      { name: 'Citrus Burst',  emoji: '🍊', color: '#FF5C1A', dark: '#C43D08' },
      { name: 'Berry Rush',    emoji: '🫐', color: '#C8255A', dark: '#8F1A40' },
      { name: 'Tropical Wave', emoji: '🥭', color: '#00A67E', dark: '#007357' },
    ],
    heroImages: ['/images/product-hero.jpg'],
  },

  media: {
    videoMain:     '/videos/soda-cans.webm',
    videoSmall:    '/videos/soda-pour.webm',
    videoBottom1:  '/videos/soda-lifestyle.webm',
    videoBottom2:  '/videos/soda-bubbles.webm',
    productImages: {
      1: '', 2: '', 3: '', 4: '', 5: '', 6: '',
    },
  },

  benefits: {
    eyebrow:   'Good Stuff Inside',
    title:     "soda that's actually good for you.",
    sub:       "We read every label so you don't have to. Here's what's inside every PYROSIS can.",
    claimNum:  '200+',
    claimText: 'batches tested before a single can left our garage.',
    claimLink: 'Meet the obsessives →',
    items: [
      { icon: '🌿', title: 'Real Fruit Juice',    color: '#00A67E', desc: 'Every can starts with real, cold-pressed juice. Not concentrate. Not flavor packets. Actual fruit.' },
      { icon: '⚡', title: 'Natural Lift',         color: '#E8B000', desc: 'A gentle boost from green tea & B-vitamins. Zero jitters. Zero crash. Just good vibes.' },
      { icon: '🦠', title: '9 Billion Prebiotics', color: '#C8255A', desc: 'Your gut deserves love too. We pack in clinically-studied prebiotics in every single can.' },
      { icon: '🚫', title: 'Nothing Fake',         color: '#6B24C2', desc: "No artificial colors. No HFCS. No weird additives you can't pronounce. Promise." },
    ],
  },

  products: {
    eyebrow:     'The Lineup',
    subtitle:    'Six flavors. All real. Zero compromise.\nRefreshing & all-natural — every single one.',
    viewAllText: 'View full collection →',
    overrides:   {},
  },

  testimonials: {
    eyebrow: 'Real Reviews',
    title:   "don't take our word for it.",
    stats: [
      { val: '4.9★', label: 'avg rating' },
      { val: '50K+', label: 'happy drinkers' },
      { val: '98%',  label: 'would recommend' },
    ],
  },

  video: {
    eyebrow:    'Our Story',
    title:      'we got fed up with boring soda.',
    body1:      'In 2022, two friends with a blender, 40 pounds of fruit, and a burning hatred of high-fructose corn syrup started PYROSIS in a garage.',
    body2:      'We wanted soda that tasted like something real — not a chemistry experiment. After 200 failed batches (seriously), we cracked the formula.',
    videoLabel: '✦ Crafted in small batches',
    caption:    'The pour — our favorite part.',
    linkText:   'Read the whole story →',
  },

  marquee: {
    items: [
      'Citrus Burst', '🍊', 'Berry Rush', '🫐',
      'Tropical Wave', '🥭', 'Grape Galaxy', '🍇',
      'Lemon Haze', '🍋', 'Cherry Bomb', '🍒',
      'Real Fruit', '✦', 'Zero Junk', '✦', 'Gut-Friendly', '✦',
    ],
  },

  footer: {
    ctaHeadline:     'ready to feel fizzy?',
    ctaBtnPrimary:   'Shop All Flavors',
    ctaBtnSecondary: 'Find your match →',
    tagline:         'Crafted with real fruit.\nMade to make you smile.',
    newsletterText:  'New drops, deals, and fruit facts.',
    copyright:       '© 2025 PYROSIS Inc.',
    links: {
      Shop:  ['All Flavors', 'Variety Packs', 'Subscribe & Save', 'Gift Cards'],
      Learn: ['Our Story', 'Ingredients', 'Sustainability', 'Blog'],
      Help:  ['FAQ', 'Shipping', 'Returns', 'Contact'],
    },
  },

  colors: {
    '--cream':      '#FFF7EE',
    '--cream-dark': '#F5EDE0',
    '--cream-mid':  '#FAF0E4',
    '--ink':        '#1A1208',
    '--ink-soft':   '#4A3728',
    '--muted':      '#9C8878',
    '--citrus':     '#FF5C1A',
    '--berry':      '#C8255A',
    '--tropical':   '#00A67E',
    '--grape':      '#6B24C2',
    '--lemon':      '#E8B000',
    '--cherry':     '#D62839',
    '--forest':     '#1D4D38',
    '--sage':       '#A8C5A0',
    '--peach':      '#FFBF94',
  },
}

function deepMerge(defaults, saved) {
  const result = { ...defaults }
  for (const key of Object.keys(saved)) {
    if (
      key in defaults &&
      typeof defaults[key] === 'object' &&
      !Array.isArray(defaults[key]) &&
      defaults[key] !== null &&
      typeof saved[key] === 'object' &&
      !Array.isArray(saved[key]) &&
      saved[key] !== null
    ) {
      result[key] = deepMerge(defaults[key], saved[key])
    } else {
      result[key] = saved[key]
    }
  }
  return result
}

function loadConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_SITE_CONFIG
    return deepMerge(DEFAULT_SITE_CONFIG, JSON.parse(saved))
  } catch {
    return DEFAULT_SITE_CONFIG
  }
}

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [config, setConfig] = useState(loadConfig)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  useEffect(() => {
    const root = document.documentElement
    Object.entries(config.colors).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
  }, [config.colors])

  const updateSection = (section, patch) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }))
  }

  const updateProduct = (id, patch) => {
    setConfig(prev => ({
      ...prev,
      products: {
        ...prev.products,
        overrides: {
          ...prev.products.overrides,
          [id]: { ...(prev.products.overrides[id] ?? {}), ...patch },
        },
      },
    }))
  }

  const resetConfig = () => {
    setConfig(DEFAULT_SITE_CONFIG)
    localStorage.removeItem(STORAGE_KEY)
    const root = document.documentElement
    Object.entries(DEFAULT_SITE_CONFIG.colors).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
  }

  return (
    <SiteContext.Provider value={{ config, updateSection, updateProduct, resetConfig }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
