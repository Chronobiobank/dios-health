/** TipTraQ product page — periodic calibration in DIOS */

import { TIPTRAQ_CALIBRATION, TIPTRAQ_POSITIONING } from '@/lib/product/intelligence-cadence'

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
    'FDA-cleared home sleep monitoring for DIOS — three nights every six months, not a continuous feed.',
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
      body: 'Sleep onset and architecture, REM latency, autonomic balance, breathing (AHI), and overnight SpO₂ — the signals DIOS uses to set personalised dose windows for the next six months.',
      detail: `High-confidence DLMO snapshot after ${TIPTRAQ_CALIBRATION.nightsPerBlock} nights.`,
    },
    {
      id: 'dios',
      title: 'Clock calibration in DIOS',
      body: 'TipTraQ sets the clock. Monthly MLux camera proxy maintains the estimate between blocks. 90-day blood panels confirm biological response. Daily DINA dose confirmations show adherence.',
      detail: 'Everything between TipTraQ blocks runs on the windows the last read established.',
    },
    {
      id: 'clinical',
      title: 'Clinical use',
      body: 'Async home measurement feeds clinician review — suitable for NHS pathways that need documented sleep and autonomic signal before dose-timing decisions.',
      detail: 'Outputs integrate with the circadian digital twin and GP-ready summaries.',
    },
  ] as const satisfies readonly TipTraqProductTile[],
  links: [
    { label: 'DIOS technology stack', href: '/technology' },
    { label: 'Circadian digital twin demo', href: '/circadian-digital-twin' },
  ],
} as const
