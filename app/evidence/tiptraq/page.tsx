import type { Metadata } from 'next'

import { Footer } from '@/components/sections/Footer'
import { TipTraqScience } from '@/components/sections/TipTraqScience'

export const metadata: Metadata = {
  title: 'The science | DIOS',
  description:
    'How DIOS derives proxy DLMO from smartphone, blood, and TipTraQ data — peer-reviewed foundations for medication and supplement timing.',
}

export default function EvidenceTipTraqPage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <main>
        <TipTraqScience />
      </main>
      <Footer />
    </div>
  )
}
