export type LandingHeroInlineLink = {
  label: string
  href: string
}

export type LandingHeroContent = {
  eyebrow: string
  headlineWhite: string
  headlineAccent: string
  /** Plain lede — use when no inline link. */
  support?: string
  /** Lede with inline link: before · link · after */
  supportBeforeLink?: string
  supportLink?: LandingHeroInlineLink
  supportAfterLink?: string
  /** Personalised result line — omit when folded into support. */
  context?: string
  cta?: { label: string; href: string }
}
