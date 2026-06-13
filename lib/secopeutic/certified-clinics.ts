/** UK directory listings — medical oversight confirmed; Secopeutic opt-in pending. */
export type SecopeuticClinicPathway = 'injection' | 'pth-led' | 'sleep-led'

export type SecopeuticCertifiedClinic = {
  id: string
  name: string
  city: string
  region: string
  pathway: SecopeuticClinicPathway
  doseRange: string
  href: string
  cardTitle: string
  cardMeta: string
  summary: string
  supervision: string
}

export const SECOPEUTIC_UK_STARTER_CLINICS: readonly SecopeuticCertifiedClinic[] = [
  {
    id: 'harpal-clinic',
    name: 'Harpal Clinic',
    city: 'London',
    region: 'England',
    pathway: 'injection',
    doseRange: '100,000–300,000 IU',
    href: 'https://www.harpalclinic.co.uk/iv-drips/vitamin-d-injection/',
    cardTitle: 'Harpal Clinic · London',
    cardMeta: 'CQC-regulated · GMC doctors · on-site D testing.',
    summary: 'Private London clinic with 100k to 300k IU intramuscular D3 and finger-prick vitamin D testing.',
    supervision: 'CQC-regulated · GMC-registered doctors · clinical consultation included.',
  },
  {
    id: 'life-right-health-hub',
    name: 'Life Right Health Hub',
    city: 'Basingstoke',
    region: 'England',
    pathway: 'injection',
    doseRange: '300,000 IU',
    href: 'https://liferight.co.uk/vit-d-clinic/',
    cardTitle: 'Life Right Health Hub · Basingstoke',
    cardMeta: 'Bone profile and vitamin D before dosing.',
    summary: 'Integrative health hub offering 300k IU IM D3 with bone profile labs before each course.',
    supervision: 'Specialist review · vitamin D and bone profile monitoring.',
  },
  {
    id: 'iv-drip-clinic-london',
    name: 'IV Drip Clinic London',
    city: 'London',
    region: 'England',
    pathway: 'injection',
    doseRange: '300,000 IU',
    href: 'https://ivdrip.uk/im-shots/vitamin-d-high-dose-injection',
    cardTitle: 'IV Drip Clinic London · Marylebone',
    cardMeta: '300k IU IM with consultation.',
    summary: 'Marylebone clinic delivering 300k IU vitamin D3 by intramuscular injection.',
    supervision: 'Clinical consultation before treatment.',
  },
  {
    id: 'oso-clinic',
    name: 'OSO Clinic',
    city: 'London',
    region: 'England',
    pathway: 'injection',
    doseRange: 'High-dose IM',
    href: 'https://osoclinic.com/vitamin-d-high-dose-injections/',
    cardTitle: 'OSO Clinic · Central London',
    cardMeta: 'Medical team led deficiency pathway.',
    summary: 'Central London medical clinic for high-dose vitamin D intramuscular injections.',
    supervision: 'Medical team led · rapid deficiency correction.',
  },
] as const

/** Practices with active Secopeutic monitoring opt-in — empty until verified. */
export const SECOPEUTIC_VERIFIED_CLINICS: readonly SecopeuticCertifiedClinic[] = [] as const
