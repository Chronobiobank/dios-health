/** Single ʘ glyph (U+0298) — logo and compact brand moments only. Never use in body copy. */
export const DEEPDOSE_LOGO_GLYPH = String.fromCodePoint(0x0298)

/** Visual wordmark — O replaced with ʘ (U+0298), same convention as DIʘS */
export const DEEPDOSE_WORDMARK = `DEEPD${DEEPDOSE_LOGO_GLYPH}SE` as const

/** Sentence case in all user-facing copy */
export const DEEPDOSE_NAME = 'Deepdose' as const

export const DEEPDOSE_LEGAL_NAME = 'Deepdose Limited' as const

export const DEEPDOSE_FOOTER_LEGAL =
  'Chronobiobank is a trademark and trading name of Deepdose Limited, a UK-based social enterprise dedicated to precision chronotherapy and privacy-preserving circadian health research.' as const

export const DEEPDOSE_TAGLINE = 'Dose smarter, heal faster.' as const

/** Dose = each zeitgeber (light, meals, meds/supps, exercise, sleep) — see lib/chronobiology/zeitgebers.ts */

/**
 * Copy hierarchy: DeepDose = precision dosing (splash, landings, pricing hero).
 * Melatonin phase / DLMO = metric layer — chrono test, onboarding, dashboards, /research only.
 */
