/**
 * Placeholder lifestyle photography (Unsplash).
 * Replace with DeepDose brand assets in production — see docs/DESIGN_SPEC.md §2.9
 */
export const marketingImages = {
  hero: {
    src: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1400&q=80',
    alt: 'Person beginning their morning in warm natural light',
  },
  sleep: {
    src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80',
    alt: 'Peaceful bedroom at dawn — sleep and circadian rhythm',
  },
  wellness: {
    src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80',
    alt: 'Morning wellness and mindful routine',
  },
  medication: {
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
    alt: 'Hands holding medication with care in soft light',
  },
  cta: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=80',
    alt: 'Calm lifestyle moment at sunrise',
  },
  phoneNight: {
    src: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1800&q=85',
    alt: 'Person checking their phone in bed at night — health data stays on the device',
  },
  badSleep: {
    src: 'https://images.unsplash.com/photo-1515895307159-f601dfc48b92?auto=format&fit=crop&w=1800&q=85',
    alt: 'Restless night — disrupted sleep and circadian drift',
  },
  threeNights: {
    src: '/home-test/three-nights.png',
    alt: 'A sleep sensor on a bedside at twilight, with three moon phases over a dawn-to-dusk sky',
  },
  circadianMedicine: {
    src: '/circadian%20medicine.webp',
    alt: 'Circadian medicine — chronobiology research and phase-aware care',
  },
} as const
