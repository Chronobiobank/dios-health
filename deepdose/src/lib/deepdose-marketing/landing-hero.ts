export type LandingHeroContent = {
  eyebrow: string
  headlineWhite: string
  headlineAccent: string
  support: string
  /** Risk profile or personalised context shown below the mission lede. */
  context?: string
  cta?: { label: string; href: string }
}
