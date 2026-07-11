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

export const DEEPDOSE_TAGLINE = 'Max your chemistry.' as const

/** Consumer movement — stack sport under the CTA */
export const DEEPDOSE_MOVEMENT = 'Medmaxxing' as const

/** Token economy — Flow is the hit (verb + in/out state). Not Sync, not likes. */
export const DEEPDOSE_TOKEN_ECONOMY = 'Get in Flow.' as const

/** Homepage hero — compelling CTA (stack + meeting people) */
export const DEEPDOSE_HOME_HEADLINE = 'Max your chemistry.' as const

/** Dose = each stamped cluster on the stack — see lib/patient/dose-uploads.ts */

/**
 * Copy hierarchy:
 * Max your chemistry = splash CTA (med stack + meeting others).
 * Medmaxxing = the movement / how the stack sport works.
 * Get in Flow = the token economy (action + state the tribe recognizes).
 * Consumer tribe = Dosers (Grid / Log / Bank / Me).
 * Deepdose = company, Chemistry, TipTraQ, Chronobiobank.
 * Melatonin / DLMO = research / tech methodology only.
 */
