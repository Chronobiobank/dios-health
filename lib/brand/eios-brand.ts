/**
 * Brand family — PranaQ · TipTraQ · EIOS · Q
 *
 * EIOS   Executive Intelligence OS (platform)
 * Q      AI chatbot — delivers daily zeitgeber cues
 */

const BILABIAL_CLICK = String.fromCodePoint(0x0298)

export const EIOS_BRAND_NAME = 'EIOS' as const

/** Visual wordmark — O replaced with ʘ (U+0298). Pair with `.dios-wordmark`. */
export const EIOS_LOGO_MARK = `EI${BILABIAL_CLICK}S` as const

/** Single ʘ glyph — footer and compact brand moments */
export const EIOS_LOGO_GLYPH = BILABIAL_CLICK

export const EIOS_CATEGORY = 'Executive Intelligence' as const

export const EIOS_TAGLINE = 'Executive Intelligence OS' as const

export const EIOS_ELEVATOR =
  'EIOS maps biology. Q delivers the cues — EI alongside AI.' as const

export const Q_BRAND_NAME = 'Q' as const

export const Q_TAGLINE = 'Delivers daily cues' as const

export const Q_NARRATIVE =
  'Q delivers your daily cues. Light. Timing. Movement. The signals your biology needs to perform.' as const

export const BRAND_ECOSYSTEM = [
  { name: 'PranaQ', role: 'Device company' },
  { name: 'TipTraQ', role: 'Diagnostic hardware' },
  { name: 'EIOS', role: 'Executive Intelligence OS' },
  { name: 'Q', role: 'Delivers daily cues' },
] as const

export const EIOS_BRAND = {
  name: EIOS_BRAND_NAME,
  logoMark: EIOS_LOGO_MARK,
  logoGlyph: EIOS_LOGO_GLYPH,
  category: EIOS_CATEGORY,
  tagline: EIOS_TAGLINE,
  elevator: EIOS_ELEVATOR,
} as const

export const Q_BRAND = {
  name: Q_BRAND_NAME,
  tagline: Q_TAGLINE,
  narrative: Q_NARRATIVE,
} as const
