# DeepDose Design Specification

> **Aligned with [dios.health](https://dios.health)** — clinical aubergine/cream palette, Inter UI, Maven.com education patterns for marketing hero bands.  
> Token source: `src/styles/dios-tokens.css` · Primitives: `src/styles/dios-components.css`

---

## 1. Design lineage

| Layer | Reference | Role in DeepDose |
|-------|-----------|------------------|
| **DIOS platform** | `dios-health/app/globals-base.css` | Aubergine surfaces, cream canvas, gold accent, Inter clinical type |
| **Maven education** | `dios-health/app/styles/secopeutic-demo.css` | Dark navy hero, spectrum gradient display, course-card grids, mono data labels |
| **Clinical UI** | `dios-health/app/styles/calm-ui.css` | 8px card radius, restrained motion, data-forward dashboards |

DeepDose is **not** a consumer wellness brand (no Function Health lifestyle editorial, no pill CTAs, no stock-photo hero splits). It reads as **clinical chronotherapy software** within the DIOS family.

---

## 2. Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **UI / headings** | Inter (`--font-ui`) | 400–600 | App shell, onboarding, dashboard, forms, nav |
| **Display** | Merriweather (`--font-display`) | 300–400 | Marketing hero lines only — one accent line may use spectrum gradient |
| **Data / labels** | JetBrains Mono (`--font-data`) | 400 | Eyebrows, badges, table headers, step indices |

### Rules

- **Patient app + onboarding:** Inter semibold headings only — no serif in product flows.
- **Marketing:** Merriweather for hero display; body remains Inter.
- **Eyebrows:** Mono, uppercase, `0.12em` tracking, gold (`--gold`).
- **Line height:** 1.25 headings · 1.65 body.

### CSS classes

| Class | Purpose |
|-------|---------|
| `.dios-eyebrow` | Mono gold label |
| `.dios-heading` | App section title (Inter) |
| `.dios-heading-display` | Marketing section title (Merriweather) |
| `.dios-spectrum-text` | Maven gradient on one headline line |

---

## 3. Colour

### Aubergine + cream (DIOS)

| Token | Hex | Role |
|-------|-----|------|
| `--aubergine-very-dark` | `#1A0D17` | Primary button hover, deep ink |
| `--aubergine-dark` | `#3B1F35` | Primary CTA surface |
| `--aubergine-mid` | `#5C3050` | Secondary emphasis, links in app |
| `--aubergine-light` | `#E8D5E2` | Borders, dividers |
| `--cream` | `#FAFAF7` | Page canvas |
| `--gold` | `#C9973A` | Eyebrows, accent highlights |
| `--lilac-bright` | `#D891EF` | Focus ring |

### Maven marketing bands

| Token | Value | Role |
|-------|-------|------|
| `--maven-navy` | `#0B1220` | Dark hero / footer bands |
| `--maven-spectrum-hero` | peach→lavender→blue gradient | One hero accent line |
| `--maven-canvas` | `#F7F8FA` | Alternate light section |

### Clinical status

| Token | Role |
|-------|------|
| `--status-green` / `--status-green-bg` | In-window, aligned |
| `--status-amber` / `--status-amber-bg` | Outside window, attention |
| `--teal` / `--teal-light` | Circadian charts, phase data |

### DeepDose semantic aliases (Tailwind)

`canvas` · `surface` · `ink` · `accent` (gold) · `accent-surface` (aubergine-dark) · `border` · `success` · `warning` · `phase`

---

## 4. Layout

```
Marketing max-width:  76rem  (--page-max-marketing)
App max-width:        48rem  (--page-max-app)
Page padding:         clamp(1rem, 4vw, 2rem)
Copy measure:         52ch
Section gap:          1.5–2.5rem (clinical — not 80–128px consumer gaps)
```

---

## 5. Components

| Component | Spec |
|-----------|------|
| **Button primary** | Aubergine-dark bg, white text, `rounded-md` (8px), **not** pill |
| **Button secondary** | 1px ink border, transparent bg |
| **Card** | White surface, aubergine-light border, `rounded-md` |
| **Input** | `.dios-input` — 44px min height, lilac focus ring |
| **Badge** | Mono uppercase, `rounded-md`, tinted bg |
| **Callout** | `.dios-callout--{info,success,warning,error}` |
| **Step rail** | `.dios-step-rail` — square indices, mono numerals |

### Maven marketing patterns (public pages only)

- Dark navy hero with pinstripe texture (`.dios-hero-navy`)
- Horizontal topic marquee (medication / chronotherapy terms)
- Numbered step cards on cream — no full-bleed lifestyle photography
- Comparison table — clinical feature matrix, not lifestyle trust quotes

---

## 6. Motion

| Pattern | Spec |
|---------|------|
| Transitions | 150ms color/background only |
| Section fade | 8px translateY, 400ms — subtle |
| Marquee | 45s linear, pause on hover |
| Reduced motion | Disable marquee + transforms |

---

## 7. Application map

| Surface | Container | Typography |
|---------|-----------|------------|
| Public landing | 76rem | Merriweather hero + Inter body |
| Login | Narrow card on cream | Inter only |
| Onboarding | 48rem | Inter + mono eyebrows |
| Dashboard | 48rem | Inter + mono data labels |

---

## 8. Do / Don't

**Do**
- Match dios.health token names where possible
- Use gold eyebrows + aubergine CTAs
- Keep dashboards data-dense and legible
- Use Maven navy + spectrum only on marketing hero bands

**Don't**
- Pill buttons, rounded-3xl lifestyle cards, Unsplash hero splits
- Teal-as-primary accent (reserved for circadian data viz)
- Newsreader / Source Sans / Function Health warm cream palette
- Consumer trust patterns (celebrity quotes, lifestyle CTA banners)

---

## 9. File map

| File | Contents |
|------|----------|
| `src/styles/dios-tokens.css` | All CSS custom properties |
| `src/styles/dios-components.css` | Primitive classes |
| `src/app/globals.css` | Tailwind `@theme` bridge |
| `src/components/ui/*` | React wrappers using primitives |

When dios.health tokens change, update `dios-tokens.css` from `app/globals-base.css` and `app/styles/secopeutic-demo.css`.
