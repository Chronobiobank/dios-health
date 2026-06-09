/**
 * CLOQ Health Limited — company home (cloq.health).
 * No parent product brand; ecosystem is metric + device + partner + cues.
 */

export const CLOQ_HEALTH_LEGAL_NAME = 'Cloq Health Limited' as const

export const CLOQ_HEALTH_SITE_URL = 'https://cloq.health' as const

/** Metric brand domain — can alias to cloq.health in DNS */
export const BODYCLOQ_METRIC_URL = 'https://bodycloq.com' as const

export const BRAND_ECOSYSTEM = [
  { name: 'BodycloQ', role: 'Circadian score' },
  { name: 'TipTraQ', role: 'Sleep calibration device' },
  { name: 'Q', role: 'Daily cues' },
  { name: 'PranaQ', role: 'Device partner' },
] as const

/** Social-first category — aspirational, not academic */
export const CLOQ_CATEGORY = 'Circadian Nootropics' as const

export const CLOQ_DESCRIPTOR = 'CLOQ Health — Circadian Nootropics' as const

export const CLOQ_TAGLINE = 'MAKE TIME COUNT' as const

/** Single ʘ glyph (U+0298) — compact brand moments */
export const CLOQ_LOGO_GLYPH = String.fromCodePoint(0x0298)

/** Visual wordmark — O replaced with ʘ (U+0298 latin letter bilabial click) */
export const CLOQ_LOGO_MARK = `CL${CLOQ_LOGO_GLYPH}Q`

/** Footer copyright — same mark as nav */
export const CLOQ_COPYRIGHT_MARK = CLOQ_LOGO_MARK

export const CLOQ_HEALTH_BRAND = {
  name: 'CLOQ Health',
  logoMark: CLOQ_LOGO_MARK,
  logoGlyph: CLOQ_LOGO_GLYPH,
  logoClassName: 'cloq-wordmark',
  category: CLOQ_CATEGORY,
  descriptor: CLOQ_DESCRIPTOR,
  tagline: CLOQ_TAGLINE,
  legalName: CLOQ_HEALTH_LEGAL_NAME,
  copyrightMark: CLOQ_COPYRIGHT_MARK,
  siteUrl: CLOQ_HEALTH_SITE_URL,
} as const

export const CLOQ_HEALTH = {
  legalName: CLOQ_HEALTH_LEGAL_NAME,
  siteUrl: CLOQ_HEALTH_SITE_URL,
  ecosystem: BRAND_ECOSYSTEM,
  brand: CLOQ_HEALTH_BRAND,
} as const
