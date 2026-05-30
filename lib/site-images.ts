/**
 * Marketing image map — replace assets one-by-one in this order:
 * 1 hero.poster · 2 featured.platform · 3 featured.evidence
 * 4–7 streams (wearable/lab/retina/mobile) · 8–10 buyers
 */
export const SITE_IMAGES = {
  hero: {
    poster: '/hero.jpg',
    video: '/dosing.mp4',
  },
  featured: {
    platform: '/featured-platform.jpg',
    evidence: '/featured-evidence.jpg',
  },
  streams: {
    wearable: '/tiptraq-wearable.jpg',
    lab: '/city-labs-panel.jpg',
    retina: '/siloton-giraffe-oct.jpg',
    mobile: '/smartphone-passive.jpg',
  },
  buyers: {
    clinicians: '/buyer-clinicians.jpg',
    research: '/buyer-research.jpg',
    workforce: '/buyer-workforce.jpg',
  },
} as const
