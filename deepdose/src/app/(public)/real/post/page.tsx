import type { Metadata } from 'next'

import { AppTopBarBack } from '@/components/deepdose/AppTopBar'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { RealPostComposer } from '@/components/deepdose/RealPostComposer'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Post · ${DEEPDOSE_NAME}`,
  description: 'Post today’s Real — a photo plus your sleep score.',
  alternates: { canonical: '/real/post' },
}

export default function RealPostPage() {
  return (
    <ProductAppShell
      title="Post"
      leading={<AppTopBarBack href="/real" label="Back to Real" />}
      className="dd-real dd-real-post-page"
    >
      <RealPostComposer />
    </ProductAppShell>
  )
}
