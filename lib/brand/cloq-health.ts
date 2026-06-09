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

export const CLOQ_TAGLINE = 'MAKE TIME COUNT' as const

export const CLOQ_LOGO_MARK = 'CLOQ' as const

/** Footer copyright glyph — Unbounded caps */
export const CLOQ_COPYRIGHT_MARK = 'CLOQ' as const

export const CLOQ_HEALTH_BRAND = {
  name: 'CLOQ Health',
  logoMark: CLOQ_LOGO_MARK,
  logoGlyph: 'Q',
  logoClassName: 'cloq-wordmark',
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
