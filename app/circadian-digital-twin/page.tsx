import type { Metadata } from 'next'

import { CircadianModelView } from '@/components/evidence/circadian-model-view'

export const metadata: Metadata = {
  title: 'Two ages. One gap. What DIOS measures — DIOS Health',
  description:
    'Your Chronological Age is how long you have lived. Your Chronosomatic Age is how fast your body is ageing right now. The UK Biobank study of 80,000 people proved your light-dark cycle determines the gap. DIOS measures it.',
}

export default function CircadianModelPage() {
  return <CircadianModelView />
}
