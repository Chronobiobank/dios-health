import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

/** Legacy /pitch slugs retired after Option 1 (med-timing home narrative). */
export const PITCH_SLUG_REDIRECTS: Readonly<Record<string, string>> = {
  hook: MARKETING_ROUTES.home,
  consequence: MARKETING_ROUTES.howItWorks,
  'photonic-age': MARKETING_ROUTES.howItWorks,
  'how-it-works': MARKETING_ROUTES.howItWorks,
  chronobiobank: MARKETING_ROUTES.chronobiobank,
}

export function getPitchSlugRedirect(slug: string): string | undefined {
  return PITCH_SLUG_REDIRECTS[slug]
}
