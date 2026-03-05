# Web Design Knowledge Base

A reusable reference for building modern, high-quality marketing/e-commerce sites.
Extracted from pyrosis-site. Adapt freely to new projects.

---

## 1. Design Tokens (CSS Variables)

Always define tokens in `:root`. Group by purpose.

```css
:root {
  /* Core palette */
  --bg:        #FFF7EE;   /* warm cream — better than pure white */
  --bg-dark:   #F5EDE0;
  --bg-mid:    #FAF0E4;
  --ink:       #1A1208;   /* near-black with warmth */
  --ink-soft:  #4A3728;   /* secondary text */
  --muted:     #9C8878;   /* labels, captions */


  /* Typography */
  --font-display:   'Bebas Neue', Impact, sans-serif;   /* big headers */
  --font-condensed: 'Barlow Condensed', sans-serif;     /* sub-labels, buttons */
  --font-body:      'Inter', -apple-system, sans-serif; /* body copy */

  /* Border radius scale */
  --radius-sm:   12px;
  --radius-md:   20px;
  --radius-lg:   32px;
  --radius-pill: 999px;
}
```

**Key principles:**
- Use warm off-white (`#FFF7EE`) instead of pure white as page background — friendlier.
- Near-black (`#1A1208`) with a warm tint looks more refined than `#000`.
- Pill radius (`999px`) for buttons/badges; larger radii for cards; variable for blobs/organic shapes.

---

## 2. Typography System

```css
/* Big display headlines */
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;        /* Bebas Neue is optically bold at any weight */
  line-height: 0.92–0.95; /* tight! critical for large display type */
  letter-spacing: 0.01–0.03em;
  text-transform: uppercase;
}

/* Sub-headings, labels, buttons */
h4, h5, h6, .label {
  font-family: var(--font-condensed);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06–0.22em; /* more tracking = smaller text */
}
```

### Eyebrow / Kicker pattern
Small all-caps label above a big headline — creates hierarchy without clutter.

```css
.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);   /* or brand color on dark bg */
}
```

### Fluid font sizes with `clamp()`
```css
font-size: clamp(3rem, 5.5vw, 5rem);   /* min, preferred, max */
```
Use for all display headings — they scale smoothly without JS or media query hacks.

---

## 3. Layout Patterns

### Container
```css
.container {
  max-width: 1280px;   /* or 1320px for wider product grids */
  margin: 0 auto;
  padding: 0 2rem;
}
```

### Section spacing
```css
.section {
  padding: 6rem 0 7rem;   /* generous vertical rhythm */
  position: relative;
  overflow: hidden;        /* contain absolute children / blobs */
}
```

### 3/4 column product grids
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* or 4 for benefits */
  gap: 1.25rem;
}
@media (max-width: 1024px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px)  { .grid { grid-template-columns: 1fr; } }
```

### Footer layout
```css
.footerGrid {
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;  /* brand col wider */
}
@media (max-width: 1100px) {
  .footerGrid { grid-template-columns: 1fr 1fr; }
  .brand { grid-column: 1 / -1; }  /* brand spans full width */
}
```

---

## 4. Component Patterns

### Navbar

**Behavior:** transparent on load → frosted glass on scroll.

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  transition: background 0.4s ease, padding 0.4s ease;
}

.nav.scrolled {
  background: rgba(255, 247, 238, 0.92);
  backdrop-filter: blur(16px);
  padding-block: 0.9rem;          /* shrinks slightly */
  box-shadow: 0 1px 0 rgba(0,0,0,0.08);
}
```

**Nav link underline on hover:**
```css
.link { position: relative; }
.link::after {
  content: '';
  position: absolute;
  bottom: -3px; left: 0;
  width: 0; height: 1.5px;
  background: var(--primary);
  border-radius: 1px;
  transition: width 0.25s ease;
}
.link:hover::after { width: 100%; }
```

**Hamburger animation (CSS only):**
```css
.barTop  { transform: translateY(7px) rotate(45deg); }
.barMid  { opacity: 0; transform: scaleX(0); }
.barBot  { transform: translateY(-7px) rotate(-45deg); }
```
Apply these classes when `menuOpen === true`.

---

### Hero Section

**Layout:** full-viewport, text left / visual right (split layout).

- Organic blob shape on the right as a color anchor.
- Product photo in a rounded oval frame with `border-radius: 50% 50% 48% 52% / 55% 55% 45% 45%`.
- Stats bar pinned to bottom with `backdrop-filter: blur(12px)`.

**Blob shape:**
```css
.blob {
  border-radius: 44% 56% 60% 40% / 38% 38% 62% 62%;
  /* Animate by changing these values with JS or CSS keyframes */
}
```

**Glassmorphism badge:**
```css
.badge {
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: var(--radius-pill);
}
```

**Frosted stats bar:**
```css
.statsBar {
  background: rgba(255, 247, 238, 0.85);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(0,0,0,0.08);
}
```

---

### Card Components

**Product / feature card:**
```css
.card {
  border-radius: var(--radius-lg);
  transition: transform 0.28s ease, box-shadow 0.28s ease;
  border: 1.5px solid color-mix(in srgb, var(--accent-color) 12%, transparent);
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px color-mix(in srgb, var(--accent-color) 15%, transparent);
}
```

**Per-card accent color via CSS custom property:**
```jsx
<div className={styles.card} style={{ '--c': product.color }}>
```
Then in CSS:
```css
.iconCircle  { background: color-mix(in srgb, var(--c) 15%, transparent); }
.cardBar     { background: var(--c); }
```

**Hover reveal bottom bar:**
```css
.cardBar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--c);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}
.card:hover .cardBar { transform: scaleX(1); }
```

**Review/testimonial card:**
```css
.card {
  background: var(--white);
  border: 1.5px solid var(--bg-dark);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
}
.card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border-color: rgba(0,0,0,0.12);
}
```

---

### Buttons

**Primary (pill):**
```css
.btnPrimary {
  padding: 0.85rem 2.2rem;
  border-radius: var(--radius-pill);
  background: var(--primary);   /* or use inline style for dynamic color */
  color: white;
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: filter 0.2s, transform 0.15s;
}
.btnPrimary:hover { filter: brightness(0.9); }
```

**Ghost (underline link style):**
```css
.btnGhost {
  font-family: var(--font-condensed);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  border-bottom: 1.5px solid rgba(74, 55, 40, 0.25);
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
}
.btnGhost:hover { color: var(--ink); border-color: var(--ink); }
```

**Subtle lift on hover (for nav CTA):**
```css
.ctaBtn:hover { transform: translateY(-1px); }
```

---

### Gradient / Color Stripe Accent

Thin multi-color bar at top of section — signals vibrancy without being heavy.
```css
.section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #FF5C1A, #C8255A, #00A67E, #6B24C2);
}
```

---

### Wave Section Divider

SVG-based wave between sections (e.g., cream → dark section).
```html
<div class="waveTop">
  <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
    <path d="M0,60 C360,0 1080,0 1440,60 L1440,0 L0,0 Z"
          fill="var(--cream)" />
  </svg>
</div>
```
```css
.waveTop {
  position: absolute;
  top: -1px; left: 0; right: 0;
  height: 60px;
  line-height: 0;
}
.waveTop svg { width: 100%; height: 100%; }
```

---

### Marquee / Ticker

Infinite scroll ticker using CSS animation only.
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.track {
  display: flex;
  animation: marquee 20s linear infinite;
  width: max-content;
}
/* Duplicate items to create seamless loop */
```

---

### Cart / Drawer

```css
.drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 420px;
  z-index: 200;
  background: var(--white);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer.open { transform: translateX(0); }

.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  z-index: 199;
}
```

---

### Progress Bar (multi-step)

```css
.track {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.line {
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 2px;
  background: var(--bg-dark);
  transform: translateY(-50%);
}
.fill {
  height: 2px;
  background: var(--primary);
  transition: width 0.4s ease;
}
```

---

## 5. Dark Section on Cream Background

Pattern for high-contrast feature section (e.g. benefits on forest green):

```css
.section {
  background: var(--secondary);   /* dark */
  color: var(--white);
  padding: 5rem 0 7rem;
}

/* Cards on dark bg */
.card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-md);
  padding: 1.8rem 1.5rem;
}
.card:hover {
  background: rgba(255,255,255,0.10);
  border-color: color-mix(in srgb, var(--c) 40%, transparent);
}

/* Muted body text on dark */
.desc { color: rgba(255,255,255,0.6); }
.sub  { color: rgba(255,255,255,0.45); }
```

---

## 6. Scrollbar Styling

```css
::-webkit-scrollbar       { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg-dark); }
::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 3px; }
```

---

## 7. Global Resets / Base

```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; overflow-x: hidden; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  overflow-x: hidden;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a    { text-decoration: none; color: inherit; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }
img, video { max-width: 100%; display: block; }
section { position: relative; overflow: hidden; }
```

---

## 8. Micro-interactions Cheat Sheet

| Effect | CSS |
|--------|-----|
| Card lift | `transform: translateY(-6px)` on hover |
| Icon bounce | `transform: translateY(-5px) scale(1.08)` on hover |
| Blob expand | `transform: scale(1.25)` on parent hover |
| Button dim | `filter: brightness(0.9)` — works for any bg color |
| Sliding underline | `width: 0 → 100%` via `::after` pseudo-element |
| Bottom bar reveal | `scaleX(0) → scaleX(1)` from left |
| Opacity fade text | Use `rgba(255,255,255,0.6)` etc, no JS needed |

---

## 9. Responsive Breakpoints

```css
/* Desktop-first approach used in this project */
@media (max-width: 1100px) { /* large tablet / small laptop */ }
@media (max-width: 1024px) { /* tablet landscape */ }
@media (max-width: 900px)  { /* tablet portrait — hero layout change */ }
@media (max-width: 768px)  { /* mobile — nav hamburger appears */ }
@media (max-width: 600px)  { /* small mobile — grids go 1 col */ }
@media (max-width: 500px)  { /* very small — stat bars wrap */ }
```

---

## 10. CTA Banner (Footer/Section)

Full-width accent-color strip with big headline + button.

```css
.ctaBanner {
  background: var(--primary);
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
}
.ctaHeadline {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 5.5rem);
  color: white;
  line-height: 0.95;
  text-transform: uppercase;
}
.ctaHeadline em {
  font-style: normal;
  color: var(--ink);  /* dark text in accent word for contrast */
}
/* Decorative background emoji/icons */
.emojiRow {
  position: absolute;
  right: -1rem; top: 50%;
  transform: translateY(-50%);
  font-size: 3.5rem;
  opacity: 0.12;
  pointer-events: none;
}
```

---

## 11. Glassmorphism Patterns

```css
/* Floating pill badge */
.badge {
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: var(--radius-pill);
}

/* Nav scrolled state */
.nav.scrolled {
  background: rgba(255,247,238,0.92);
  backdrop-filter: blur(16px);
}

/* Frosted stats bar */
.bar {
  background: rgba(255,247,238,0.85);
  backdrop-filter: blur(12px);
}

/* Input on dark bg */
.input {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
}
.input:focus { border-color: var(--primary); }
```

---

## 12. Font Loading (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Google Fonts used:**
- `Bebas Neue` — display headlines
- `Barlow Condensed` (400/600/700) — sub-labels, buttons, UI
- `Inter` (400/500/600/700) — body copy

---

## 13. Avatar / User Initials Pattern

```css
.avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;   /* emoji or initials */
}
```

---

## 14. Pagination Dots

```css
.dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--bg-dark);
  border: 1.5px solid var(--muted);
  cursor: pointer;
  transition: all 0.3s;
}
.dotActive {
  background: var(--primary);
  border-color: var(--primary);
  width: 24px;           /* pill shape for active */
  border-radius: 4px;
}
```

---

## 15. Cart Badge

```css
.cartBadge {
  position: absolute;
  top: -2px; right: -2px;
  width: 18px; height: 18px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  font-size: 0.62rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 16. CSS Module Conventions (React)

- One `ComponentName.module.css` per component.
- Use camelCase class names: `.cardBody`, `.flavorBadge`.
- Pass accent color as inline CSS variable: `style={{ '--c': color }}`.
- Use `color-mix(in srgb, var(--c) 15%, transparent)` for tinted backgrounds.
- Use `clamp()` for all fluid display text.
- All transitions: `0.2s–0.4s` range. Use `cubic-bezier(0.4, 0, 0.2, 1)` for drawers/panels.
