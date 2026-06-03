/** TipTraQ product page — PranaQ Layer 1 in DIOS */

export type TipTraqProductTile = {
  id: string
  title: string
  body: string
  detail?: string
}

export const TIPTRAQ_PRODUCT_PAGE = {
  eyebrow: 'TipTraQ',
  title: 'Home sleep monitoring.',
  subtitle:
    'FDA-cleared wearable sleep monitoring for DIOS Layer 1 — clinical-grade body-clock timing from nights at home.',
  image: '/tiptraq-wearable.jpg',
  imageAlt: 'TipTraQ wearable home sleep monitor',
  clearance:
    'TipTraQ is FDA 510(k)-cleared (PranaQ) for obstructive sleep apnoea monitoring in the home.',
  tiles: [
    {
      id: 'product',
      title: 'The product',
      body: 'A soft fingertip wearable worn overnight at home. No lab visit, no wires — patients sleep in their own bed while clinical-grade signals are captured.',
      detail: 'Designed for multi-night use so timing confidence improves night by night.',
    },
    {
      id: 'measures',
      title: 'What it measures',
      body: 'Sleep onset and architecture, REM latency, autonomic balance, breathing (AHI), and overnight SpO₂ — the signals DIOS uses to refine MLux phase time.',
      detail: 'Each night narrows the confidence band on body-clock timing estimates.',
    },
    {
      id: 'dios',
      title: 'Layer 1 in DIOS',
      body: 'TipTraQ is the clinical-grade foundation layer. Blood panels (Layer 2) and smartphone sensors (Layer 3) add metabolic context and everyday capture when precision or risk flags require it.',
      detail: 'Typical progression: ~38% confidence night one to ~94% by night seven.',
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
