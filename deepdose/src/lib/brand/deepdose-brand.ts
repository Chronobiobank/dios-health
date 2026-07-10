/** Single ʘ glyph (U+0298) — logo and compact brand moments only. Never use in body copy. */
export const DEEPDOSE_LOGO_GLYPH = String.fromCodePoint(0x0298)

/** Visual wordmark — O replaced with ʘ (U+0298), same convention as DIʘS */
export const DEEPDOSE_WORDMARK = `DEEPD${DEEPDOSE_LOGO_GLYPH}SE` as const

/** Sentence case in all user-facing copy */
export const DEEPDOSE_NAME = 'Deepdose' as const

/** Registered company name — footer legal line and formal disclosures only. */
export const DEEPDOSE_LEGAL_ENTITY = 'Deepdose Ltd' as const

export const DEEPDOSE_COMPANY_NUMBER = '17294916' as const

export const DEEPDOSE_FOOTER_LEGAL =
  `${DEEPDOSE_NAME} and Chronobiobank are trademarks of ${DEEPDOSE_LEGAL_ENTITY}, registered in England and Wales (company no. ${DEEPDOSE_COMPANY_NUMBER}).` as const

export const DEEPDOSE_REGISTRATION_LINE = DEEPDOSE_FOOTER_LEGAL

export const DEEPDOSE_TAGLINE = 'Sleepmaxx. Share real life.' as const

/** Homepage hero headline — distinct from site-wide tagline in metadata */
export const DEEPDOSE_HOME_HEADLINE = 'Sleepmaxx. Share real life.' as const

/** Dose = each zeitgeber (light, meals, meds/supps, exercise, sleep) — see lib/chronobiology/zeitgebers.ts */

/**
 * Copy hierarchy:
 * Home = sleepmaxxing + share real life + face network.
 * Mission = daily Real + friends on your clock.
 * Profile = identity + Your Reals; Chemistry is secondary.
 * Melatonin / DLMO = research / tech methodology only.
 */
