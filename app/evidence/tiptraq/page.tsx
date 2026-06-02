import type { Metadata } from 'next'

import { TipTraqScience } from '@/components/sections/TipTraqScience'

export const metadata: Metadata = {
  title: 'The science | DIOS',
  description:
    'How DIOS derives MLux phase time from Mel, blood panel, and TipTraQ data — peer-reviewed foundations for medication and supplement timing.',
}

export default function EvidenceTipTraqPage() {
  return (
    <main>
      <TipTraqScience />
    </main>
  )
}
