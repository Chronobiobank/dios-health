import { CLINICAL_GUIDE_CLINICIANS } from '@/lib/secopeutic/clinical-guide-clinicians'
import { GRANT_MUNRO_PROBLEM_PAPER } from '@/lib/pitch/grant-munro-problem-paper'
import { SECOPUTIC_PILOT_PATH } from '@/lib/secopeutic/site'

export type SecopeuticEvidencePathway = 'all' | 'pth-led' | 'sleep-led' | 'injection' | 'safety'

export type SecopeuticEvidenceClinicianKey = keyof typeof CLINICAL_GUIDE_CLINICIANS

export type SecopeuticEvidenceStudy = {
  id: string
  pathways: readonly Exclude<SecopeuticEvidencePathway, 'all'>[]
  badge: string
  finding: string
  emphasis: string
  cite: string
  doseLine: string
  outcomeLine: string
  href: string
  clinicians: readonly SecopeuticEvidenceClinicianKey[]
}

export const SECOPEUTIC_EVIDENCE_PAGE = {
  eyebrow: 'Evidence library',
  headline: 'Titrated doses. Measured outcomes.',
  support: 'Indexed studies behind PTH-led, sleep-led, and UK injection protocols.',
  pilotCta: { label: 'Claim free pilot', href: SECOPUTIC_PILOT_PATH },
} as const

export const SECOPEUTIC_EVIDENCE_PATHWAYS: readonly {
  id: SecopeuticEvidencePathway
  label: string
}[] = [
  { id: 'all', label: 'All studies' },
  { id: 'pth-led', label: 'PTH-led' },
  { id: 'sleep-led', label: 'Sleep-led' },
  { id: 'injection', label: 'Injection' },
  { id: 'safety', label: 'Safety' },
] as const

export const SECOPEUTIC_EVIDENCE_STUDIES: readonly SecopeuticEvidenceStudy[] = [
  {
    id: 'coimbra-cns-2014',
    pathways: ['pth-led', 'safety'],
    badge: 'CNS Drugs · 2014',
    finding: 'High-dose D3 needs structured PTH surveillance.',
    emphasis: 'PTH',
    cite: 'Coimbra et al. — autoimmune high-dose D3 review',
    doseLine: 'Individual IU titration to PTH floor.',
    outcomeLine: 'Immune modulation when calcium stays controlled.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/24804229/',
    clinicians: ['coimbra'],
  },
  {
    id: 'amon-safety-2022',
    pathways: ['pth-led', 'safety'],
    badge: 'Nutrients · n=319',
    finding: 'Coimbra protocol stayed safe over three years.',
    emphasis: 'three years',
    cite: 'Amon et al. — autoimmune safety cohort',
    doseLine: 'Mean 35,291 IU daily with low-calcium diet.',
    outcomeLine: 'Calcium, eGFR, and urinary calcium in range.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/35458137/',
    clinicians: ['coimbra'],
  },
  {
    id: 'resistance-hypothesis-2021',
    pathways: ['pth-led'],
    badge: 'Front Immunol · 2021',
    finding: 'Acquired D resistance explains titration need.',
    emphasis: 'titration',
    cite: 'Amon et al. — vitamin D resistance hypothesis',
    doseLine: 'Up to 1,000 IU per kg with PTH endpoint.',
    outcomeLine: 'PTH drop at three months in RRMS cohort.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/33897704/',
    clinicians: ['coimbra'],
  },
  {
    id: 'finamor-pilot-2013',
    pathways: ['pth-led'],
    badge: 'Dermatoendocrinol · pilot',
    finding: 'Prolonged high D3 shifted vitiligo course.',
    emphasis: 'vitiligo',
    cite: 'Finamor et al. — vitiligo and psoriasis pilot',
    doseLine: '35,000 IU daily for six months supervised.',
    outcomeLine: 'PASI and repigmentation improved with PTH drop.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/24494059/',
    clinicians: ['coimbra'],
  },
  {
    id: 'gominak-sleep-2012',
    pathways: ['sleep-led'],
    badge: 'Med Hypotheses · n≈1,500',
    finding: 'Sleep recovers inside a narrow D3 band.',
    emphasis: 'narrow',
    cite: 'Gominak — sleep epidemic and vitamin D',
    doseLine: '25-OH-D held between 60 and 80 ng/ml.',
    outcomeLine: 'Neurologic symptoms eased as sleep normalised.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/22583560/',
    clinicians: ['gominak'],
  },
  {
    id: 'gominak-rightsleep-2016',
    pathways: ['sleep-led'],
    badge: 'Neurology · review',
    finding: 'D and B vitamins restore sleep switching.',
    emphasis: 'sleep switching',
    cite: 'Gominak — RightSleep neurologic review',
    doseLine: 'Morning light plus staged B12 repletion.',
    outcomeLine: 'REM latency falls before PTH moves on labs.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/27164492/',
    clinicians: ['gominak', 'munro'],
  },
  {
    id: 'im-bolus-pharmacokinetics',
    pathways: ['injection'],
    badge: 'Crit Care · 300k IU IM',
    finding: 'Single IM bolus lifts 25-OH-D for months.',
    emphasis: 'months',
    cite: 'Marino et al. — intramuscular cholecalciferol RCT',
    doseLine: '300k IU IM used in UK clinic protocols.',
    outcomeLine: 'PTH fell as 25-OH-D normalised by day seven.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/26186566/',
    clinicians: ['munro'],
  },
  {
    id: 'castillo-covid-2020',
    pathways: ['injection', 'safety'],
    badge: 'J Steroid Biochem · RCT',
    finding: 'Calcifediol cut ICU admission in COVID.',
    emphasis: 'ICU',
    cite: 'Castillo et al. — hospitalised COVID cohort',
    doseLine: 'Early calcifediol loading on admission.',
    outcomeLine: 'Fewer ICU transfers versus control arm.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/32871238/',
    clinicians: ['seheult'],
  },
  {
    id: 'munro-precision-timing',
    pathways: ['pth-led', 'sleep-led'],
    badge: 'Position paper · 2026',
    finding: 'Population dosing misses personal biology.',
    emphasis: 'personal biology',
    cite: 'Munro — precision chronotherapy for prescribers',
    doseLine: 'Window timing before IU escalation.',
    outcomeLine: 'Links trial evidence to clinic monitoring.',
    href: GRANT_MUNRO_PROBLEM_PAPER.pdfPath,
    clinicians: ['munro'],
  },
  {
    id: 'uk-biobank-light-2024',
    pathways: ['sleep-led'],
    badge: 'PNAS · n≈89,000',
    finding: 'Light rhythm predicts metabolic risk.',
    emphasis: '89,000',
    cite: 'UK Biobank — wrist melanopic light cohort',
    doseLine: 'Morning melanopic dose gates D response.',
    outcomeLine: 'Cardiovascular and diabetes risk stratified.',
    href: 'https://doi.org/10.1073/pnas.2405924121',
    clinicians: ['munro'],
  },
] as const
