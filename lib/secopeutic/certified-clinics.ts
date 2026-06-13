/** Starter UK listings — high-dose D3 pathways; formal Secopeutic opt-in pending. */
export type SecopeuticCertifiedClinic = {
  id: string
  name: string
  city: string
  region: string
  pathway: 'injection' | 'pth-led' | 'sleep-led'
  doseRange: string
  href: string
  cardTitle: string
  cardMeta: string
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
    cardTitle: 'Harpal Clinic high-dose D3.',
    cardMeta: 'London · 100k to 300k IU with on-site testing.',
  },
  {
    id: 'life-right-health-hub',
    name: 'Life Right Health Hub',
    city: 'Basingstoke',
    region: 'England',
    pathway: 'injection',
    doseRange: '300,000 IU',
    href: 'https://liferight.co.uk/vit-d-clinic/',
    cardTitle: 'Life Right Health Hub D3.',
    cardMeta: 'Basingstoke · 300k IU with bone profile labs.',
  },
  {
    id: 'iv-drip-clinic-london',
    name: 'IV Drip Clinic London',
    city: 'London',
    region: 'England',
    pathway: 'injection',
    doseRange: '300,000 IU',
    href: 'https://ivdrip.uk/im-shots/vitamin-d-high-dose-injection',
    cardTitle: 'IV Drip Clinic London D3.',
    cardMeta: 'Marylebone · 300k IU IM with consultation.',
  },
  {
    id: 'oso-clinic',
    name: 'OSO Clinic',
    city: 'London',
    region: 'England',
    pathway: 'injection',
    doseRange: 'High-dose IM',
    href: 'https://osoclinic.com/vitamin-d-high-dose-injections/',
    cardTitle: 'OSO Clinic high-dose D3.',
    cardMeta: 'Central London · medical team deficiency pathway.',
  },
] as const
