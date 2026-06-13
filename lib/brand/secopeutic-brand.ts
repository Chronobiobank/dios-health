/** Plain brand name — copy, titles, aria-labels. Never use ʘ outside the logo. */
export const SECOPEUTIC_BRAND_NAME = 'Secopeutic' as const

/** Single ʘ glyph (U+0298) — footer and compact brand moments only */
export const SECOPEUTIC_LOGO_GLYPH = String.fromCodePoint(0x0298)

/** Visual wordmark — O replaced with ʘ (U+0298 latin letter bilabial click) */
export const SECOPEUTIC_LOGO_MARK = `SEC${SECOPEUTIC_LOGO_GLYPH}PEUTIC`
