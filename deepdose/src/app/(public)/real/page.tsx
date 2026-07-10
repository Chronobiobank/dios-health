import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { RealFeedView } from '@/components/deepdose/RealFeedView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Real · ${DEEPDOSE_NAME}`,
  description: 'Today’s Reals — sleepmaxxing scores and real life, shared once a day.',
  alternates: { canonical: '/real' },
}

export default function RealFeedPage() {
  return (
    <ProductAppShell
      title="Real"
      trailing={
        <Link href="/real/post" className="app-top-bar__text-btn">
          Post
        </Link>
      }
      className="dd-real"
    >
      <RealFeedView />
    </ProductAppShell>
  )
}
