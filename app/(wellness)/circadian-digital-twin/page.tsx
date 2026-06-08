import type { Metadata } from 'next'

import { CircadianModelView } from '@/components/evidence/circadian-model-view'

import '@/app/styles/chronotherapy-model.css'

export const metadata: Metadata = {
  title: 'Circadian model — chronomedicine timing matrix — DIOS Health',
  description:
    'Seven clinical clusters on a 24-hour biological clock. Scan the timing matrix, then read published chronotherapy evidence — Hygia, Lévi, UK Biobank, TIME — and what DIOS does that NHS defaults do not.',
}

export default function CircadianModelPage() {
  return <CircadianModelView />
}
