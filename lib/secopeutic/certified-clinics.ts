/** UK directory listings — medical oversight confirmed; Secopeutic opt-in pending. */
export type SecopeuticClinicPathway = 'injection' | 'pth-led' | 'sleep-led'

export type SecopeuticCertifiedClinic = {
  id: string
  name: string
  city: string
  pathway: SecopeuticClinicPathway
  href: string
  cardTitle: string
  cardMeta: string
}

export const SECOPEUTIC_UK_STARTER_CLINICS: readonly SecopeuticCertifiedClinic[] = [
  {
    id: 'harpal-clinic',
    name: 'Harpal Clinic',
    city: 'London',
    pathway: 'injection',
    href: 'https://www.harpalclinic.co.uk/iv-drips/vitamin-d-injection/',
    cardTitle: 'Harpal Clinic · London',
    cardMeta: '100k to 300k IU · CQC-regulated.',
  },
  {
    id: 'life-right-health-hub',
    name: 'Life Right Health Hub',
    city: 'Basingstoke',
    pathway: 'injection',
    href: 'https://liferight.co.uk/vit-d-clinic/',
    cardTitle: 'Life Right Health Hub · Basingstoke',
    cardMeta: '300k IU · bone profile before dosing.',
  },
  {
    id: 'iv-drip-clinic-london',
    name: 'IV Drip Clinic London',
    city: 'London',
    pathway: 'injection',
    href: 'https://ivdrip.uk/im-shots/vitamin-d-high-dose-injection',
    cardTitle: 'IV Drip Clinic London · Marylebone',
    cardMeta: '300k IU IM · consultation included.',
  },
  {
    id: 'oso-clinic',
    name: 'OSO Clinic',
    city: 'London',
    pathway: 'injection',
    href: 'https://osoclinic.com/vitamin-d-high-dose-injections/',
    cardTitle: 'OSO Clinic · Central London',
    cardMeta: 'High-dose IM · medical team led.',
  },
] as const

/** Practices with active Secopeutic monitoring opt-in — empty until verified. */
export const SECOPEUTIC_VERIFIED_CLINICS: readonly SecopeuticCertifiedClinic[] = [] as const
