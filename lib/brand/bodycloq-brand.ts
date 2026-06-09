/**
 * BodycloQ — the circadian score metric (not the company name).
 *
 * Company: CLOQ Health Limited · cloq.health
 * Ecosystem: BodycloQ score · TipTraQ · Q · PranaQ
 */

import {
  BODYCLOQ_METRIC_URL,
  CLOQ_CATEGORY,
  CLOQ_HEALTH,
  CLOQ_HEALTH_LEGAL_NAME,
  CLOQ_HEALTH_SITE_URL,
} from '@/lib/brand/cloq-health'

export { BODYCLOQ_METRIC_URL, CLOQ_HEALTH, CLOQ_HEALTH_LEGAL_NAME, CLOQ_HEALTH_SITE_URL, BRAND_ECOSYSTEM } from '@/lib/brand/cloq-health'

/** @deprecated Use CLOQ_HEALTH_LEGAL_NAME */
export const BODYCLOQ_LEGAL_NAME = CLOQ_HEALTH_LEGAL_NAME

/** @deprecated Use CLOQ_HEALTH_SITE_URL */
export const BODYCLOQ_SITE_URL = CLOQ_HEALTH_SITE_URL

export const BODYCLOQ_METRIC_NAME = 'BodycloQ' as const

/** Display wordmark — rendered via BodycloQWordmark (Unbounded Light, all caps). */
export const BODYCLOQ_LOGO_MARK = 'BODYCLOQ' as const

export const BODYCLOQ_LOGO_GLYPH = 'Q' as const

export const BODYCLOQ_CATEGORY = CLOQ_CATEGORY

/** Footer / brand tag — Unbounded Light, all caps */
export const BODYCLOQ_TAGLINE = 'MAKE TIME COUNT' as const

export const BODYCLOQ_ELEVATOR =
  'Wearables in. BodycloQ scores your prime time. Q delivers the cues.' as const

export const Q_BRAND_NAME = 'Q' as const

export const Q_TAGLINE = 'Delivers daily cues' as const

export const Q_NARRATIVE =
  'Q delivers your daily cues. Light. Timing. Movement. The signals your biology needs to perform.' as const

export const BODYCLOQ_BRAND = {
  name: BODYCLOQ_METRIC_NAME,
  logoMark: BODYCLOQ_LOGO_MARK,
  logoGlyph: BODYCLOQ_LOGO_GLYPH,
  category: BODYCLOQ_CATEGORY,
  tagline: BODYCLOQ_TAGLINE,
  legalName: CLOQ_HEALTH.legalName,
  elevator: BODYCLOQ_ELEVATOR,
  siteUrl: CLOQ_HEALTH.siteUrl,
  metricUrl: BODYCLOQ_METRIC_URL,
  logoClassName: 'bodycloq-wordmark' as const,
} as const

export const Q_BRAND = {
  name: Q_BRAND_NAME,
  tagline: Q_TAGLINE,
  narrative: Q_NARRATIVE,
} as const
