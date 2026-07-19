import type { Metadata } from 'next'

import { FloatingSleepLabPage } from '@/components/deepdose/FloatingSleepLabPage'
import { SLEEPLAB_META } from '@/lib/deepdose-marketing/sleeplab-content'

export const metadata: Metadata = {
  title: SLEEPLAB_META.title,
  description: SLEEPLAB_META.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: SLEEPLAB_META.title,
    description: SLEEPLAB_META.description,
  },
}

/** Home — Floating Sleep Lab (media chamber). */
export default function HomePage() {
  return <FloatingSleepLabPage />
}
