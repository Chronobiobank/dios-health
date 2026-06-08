/**
 * Brand family — PranaQ · TipTraQ · EIOS · exIQ · Q
 *
 * EIOS   executive intelligence OS (platform)
 * exIQ   corporate product within EIOS
 * Q      AI — delivers zeitgeber cues
 */

export const EIOS_BRAND_NAME = 'EIOS' as const

export const EIOS_TAGLINE = 'Executive Intelligence OS' as const

export const EXIQ_BRAND_NAME = 'exIQ' as const

export const EXIQ_LOGO_MARK = 'exIQ' as const

/** Compact footer glyph — the Q that runs through the family */
export const EXIQ_LOGO_GLYPH = 'Q' as const

export const EXIQ_CATEGORY = 'Corporate Executive Intelligence' as const

export const EXIQ_TAGLINE = 'Executive Intelligence' as const

export const EXIQ_ELEVATOR =
  'EIOS is the platform. exIQ is the corporate product. Q delivers the cues.' as const

export const Q_BRAND_NAME = 'Q' as const

export const Q_TAGLINE = 'Cue intelligence' as const

export const Q_NARRATIVE =
  'Q delivers your daily cues. Light. Timing. Movement. The signals your biology needs to perform.' as const

export const BRAND_ECOSYSTEM = [
  { name: 'PranaQ', role: 'Device company' },
  { name: 'TipTraQ', role: 'Diagnostic hardware' },
  { name: 'EIOS', role: 'Executive Intelligence OS' },
  { name: 'exIQ', role: 'Corporate product' },
  { name: 'Q', role: 'Delivers the cues' },
] as const

/** @deprecated Use BRAND_ECOSYSTEM */
export const EXIQ_ECOSYSTEM = BRAND_ECOSYSTEM

export const EIOS_BRAND = {
  name: EIOS_BRAND_NAME,
  tagline: EIOS_TAGLINE,
} as const

export const EXIQ_BRAND = {
  name: EXIQ_BRAND_NAME,
  logoMark: EXIQ_LOGO_MARK,
  logoGlyph: EXIQ_LOGO_GLYPH,
  category: EXIQ_CATEGORY,
  tagline: EXIQ_TAGLINE,
  elevator: EXIQ_ELEVATOR,
  platform: EIOS_BRAND_NAME,
} as const

export const Q_BRAND = {
  name: Q_BRAND_NAME,
  tagline: Q_TAGLINE,
  narrative: Q_NARRATIVE,
} as const
