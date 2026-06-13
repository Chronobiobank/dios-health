/** Plain brand name — copy, titles, aria-labels. Never use ʘ outside the logo. */
export const DIOS_BRAND_NAME = 'DIOS' as const

/** Single ʘ glyph (U+0298) — footer and compact brand moments only */
export const DIOS_LOGO_GLYPH = String.fromCodePoint(0x0298)

/** Visual wordmark — O replaced with ʘ (U+0298 latin letter bilabial click) */
export const DIOS_LOGO_MARK = `DI${DIOS_LOGO_GLYPH}S`

export const DIOS_TAGLINE = 'Dose intelligence' as const
