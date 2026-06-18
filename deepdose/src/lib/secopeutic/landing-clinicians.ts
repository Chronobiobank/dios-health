/** Clinician / researcher profiles for landing evidence cards — initials or public/ image paths. */

export type LandingClinician = {
  name: string
  image?: string
  imageAlt?: string
  initials?: string
  tone?: 'violet' | 'amber' | 'teal'
}

export const LANDING_CLINICIANS = {
  munro: {
    name: 'Grant Munro',
    image: '/authors/grant-munro.jpeg',
    imageAlt: 'Grant Munro',
    initials: 'GM',
    tone: 'violet',
  },
  roenneberg: {
    name: 'Prof. Till Roenneberg',
    image: '/authors/till-roenneberg.webp',
    imageAlt: 'Prof. Till Roenneberg',
    initials: 'TR',
    tone: 'teal',
  },
  foster: {
    name: 'Prof. Russell Foster',
    image: '/authors/russell-foster.webp',
    imageAlt: 'Prof. Russell Foster',
    initials: 'RF',
    tone: 'violet',
  },
  hermida: {
    name: 'Prof. Ramon Hermida',
    image: '/authors/ramon-hermida.webp',
    imageAlt: 'Prof. Ramon Hermida',
    initials: 'RH',
    tone: 'amber',
  },
  levi: {
    name: 'Prof. Francis Lévi',
    image: '/authors/francis-levi.jpg',
    imageAlt: 'Prof. Francis Lévi',
    initials: 'FL',
    tone: 'teal',
  },
  pigazzani: {
    name: 'Prof. Filippo Pigazzani',
    image: '/authors/filippo-pigazzani.jpg',
    imageAlt: 'Prof. Filippo Pigazzani',
    initials: 'FP',
    tone: 'amber',
  },
} as const satisfies Record<string, LandingClinician>
