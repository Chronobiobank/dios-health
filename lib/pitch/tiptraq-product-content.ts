/** TipTraQ product page — periodic calibration in DIOS */

import { TIPTRAQ_CALIBRATION, TIPTRAQ_POSITIONING } from '@/lib/product/intelligence-cadence'

/** Who can complete a three-night home sleep block — not every DIOS user needs TipTraQ. */
export const TIPTRAQ_ELIGIBILITY = {
  headline: 'Clinical calibration — not the default entry point.',
  summary:
    'TipTraQ is for patients who can reliably complete a three-night fingertip sleep study at home, with a prescriber in the loop. Everyone else starts on smartphone MLux and connected wearables (Oura, Whoop, Apple Health).',
  suited: [
    'Self-managed adults who can wear, charge, and complete three consecutive nights',
    'Motivated patients on supervised protocols (e.g. high-dose D3, immunotherapy monitoring)',
    'Dedicated carer or family member available to manage the device each night',
    'Clinician-ordered block with async review — not mass-deployed to care-dependent cohorts',
  ],
  notSuited: [
    'Cognitive impairment or dementia risk where device adherence cannot be sustained',
    'Care-home residents relying on staff MAR charts without hands-on device support',
    'Wellness-only programmes where Oura/Whoop + MLux already supply sufficient sleep signal',
  ],
  alternative:
    'Corporate and workforce programmes typically enter at L3 — existing wearable OAuth plus monthly MLux. TipTraQ is an optional six-month calibration upgrade when clinical-grade SpO₂ and sleep architecture are required.',
} as const

export type TipTraqProductTile = {
  id: string
  title: string
  body: string
  detail?: string
}

export const TIPTRAQ_PRODUCT_PAGE = {
  eyebrow: 'TipTraQ',
  title: 'Periodic sleep calibration.',
  subtitle:
    'FDA-cleared home sleep monitoring — three nights every six months, not a nightly feed.',
  image: '/tiptraq-wearable.jpg',
  imageAlt: 'TipTraQ wearable home sleep monitor',
  clearance:
    'TipTraQ is FDA 510(k)-cleared (PranaQ) for obstructive sleep apnoea monitoring in the home.',
  tiles: [
    {
      id: 'product',
      title: 'The product',
      body: 'A soft fingertip wearable worn overnight at home. Patients complete a three-night block every six months — like polysomnography as a calibration event, not a daily stream.',
      detail: TIPTRAQ_POSITIONING,
    },
    {
      id: 'measures',
      title: 'What it measures',
      body: 'Sleep onset, REM, breathing, and overnight oxygen — the signals DIOS uses to set your medicine times for the next six months.',
      detail: `High-confidence DLMO snapshot after ${TIPTRAQ_CALIBRATION.nightsPerBlock} nights.`,
    },
    {
      id: 'dios',
      title: 'Clock calibration in DIOS',
      body: 'TipTraQ sets your body clock. Monthly phone light scans bridge the gap. Bloods every 90 days confirm response. Daily DINA logs show if you took medicine on time.',
      detail: 'Everything between TipTraQ blocks runs on the windows the last read established.',
    },
    {
      id: 'clinical',
      title: 'Clinical use',
      body: 'Async home measurement feeds clinician review — suitable for NHS pathways that need documented sleep and autonomic signal before dose-timing decisions.',
      detail: 'Outputs integrate with the circadian digital twin and GP-ready summaries.',
    },
  ] as const satisfies readonly TipTraqProductTile[],
  eligibility: TIPTRAQ_ELIGIBILITY,
  links: [
    { label: 'DIOS technology stack', href: '/technology' },
    { label: 'Circadian digital twin demo', href: '/circadian-digital-twin' },
  ],
} as const
