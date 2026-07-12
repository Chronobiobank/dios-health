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

/** Homepage hero */
export const DEEPDOSE_HOME_HEADLINE = 'Chemistry That Connects' as const

/** Core user promise — phenotype discovery + tribe. */
export const DEEPDOSE_PROMISE =
  'Discover your chemical phenotype. Find your people.' as const

/**
 * Short CVP / loop imperative — used on /how and loop chrome.
 * Homepage hero uses DEEPDOSE_HOME_HEADLINE instead.
 */
export const DEEPDOSE_TAGLINE = 'Make chemistry work.' as const

/** Category + differentiation — primary positioning statement. */
export const DEEPDOSE_POSITIONING =
  'Deepdose is the first social network designed around chemical phenotypes and human connection.' as const

/**
 * Product loop (onboarding / infrastructure order).
 * Screen → Score → Share → Sync.
 */
export const DEEPDOSE_LOOP_CAPTION = 'Screen. Score. Share. Sync.' as const

/**
 * Retention hierarchy (why people return) — opposite of loop order for stickiness.
 * Sync → Share → Score → Screen.
 * Chemistry matches people; community retains them; score is status; screen is plumbing.
 */
export const DEEPDOSE_RETENTION_ORDER = 'Sync. Share. Score. Screen.' as const

/** Core product question — social graph, not health dashboard. */
export const DEEPDOSE_VALUE_PROP =
  'Who is online in my biological window right now?' as const

/**
 * North-star metric — tribe formation, not score views.
 * Prefer meaningful synchronisations / same-window matches over DAU on Score.
 */
export const DEEPDOSE_NORTH_STAR =
  'Meaningful Syncs Created — people who discover someone who matches their chemical phenotype and form a real connection.' as const

/** @deprecated Retired movement name — do not use in new copy. Prefer DEEPDOSE_TAGLINE / loop. */
export const DEEPDOSE_MOVEMENT = 'Make chemistry work' as const

/** Share CTA — stamp a chemical dose. */
export const DEEPDOSE_TOKEN_ECONOMY = 'Share a dose.' as const

/**
 * Copy hierarchy:
 * Positioning = first social network for chemical phenotypes + connection.
 * Thesis = social network powered by body-clock chemistry (not a health app with social bolted on).
 * Chemistry That Connects = homepage hero.
 * Discover your chemical phenotype. Find your people. = core promise.
 * Make chemistry work = short CVP / loop imperative.
 * Screen · Score · Share · Sync = product loop (build order).
 * Sync · Share · Score · Screen = retention order (why they return).
 * Deepdose = company, Chemistry, TipTraQ, Chronobiobank.
 * Melatonin / DLMO = research / tech methodology only.
 */
