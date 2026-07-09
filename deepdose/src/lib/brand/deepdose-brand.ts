/** Single ʘ glyph (U+0298) — logo and compact brand moments only. Never use in body copy. */
export const DEEPDOSE_LOGO_GLYPH = String.fromCodePoint(0x0298)

/** Visual wordmark — nav logo */
export const DEEPDOSE_WORDMARK = 'Deepdose' as const

/** Sentence case in all user-facing copy */
export const DEEPDOSE_NAME = 'Deepdose' as const

/** Registered company name — footer legal line and formal disclosures only. */
export const DEEPDOSE_LEGAL_ENTITY = 'Deepdose Ltd' as const

export const DEEPDOSE_COMPANY_NUMBER = '17294916' as const

export const DEEPDOSE_FOOTER_LEGAL =
  `${DEEPDOSE_NAME} and Chronobiobank are trademarks of ${DEEPDOSE_LEGAL_ENTITY}, registered in England and Wales (company no. ${DEEPDOSE_COMPANY_NUMBER}).` as const

export const DEEPDOSE_REGISTRATION_LINE = DEEPDOSE_FOOTER_LEGAL

export const DEEPDOSE_TAGLINE = 'Max your medication.' as const

/** Homepage hero headline — distinct from site-wide tagline in metadata */
export const DEEPDOSE_HOME_HEADLINE = 'Max your medication.' as const

/** Dose = each zeitgeber (light, meals, meds/supps, exercise, sleep) — see lib/chronobiology/zeitgebers.ts */

/**
 * Copy hierarchy:
 * Home = goal (max your medication) + context sub + CTA.
 * The Fix = people, problems, non-conformist motivation.
 * Profile = Sleep Regularity Index (SRI) risk + six-dose protocol.
 * Melatonin / DLMO = research / tech methodology only, never consumer doses copy.
 */
