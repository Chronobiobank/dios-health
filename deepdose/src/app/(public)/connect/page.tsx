import type { Metadata } from 'next'

import { ConnectHubTiles } from '@/components/deepdose/ConnectHubTiles'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/connect' },
}

/** Sync — hub: find people awake, or start a conversation. */
export default function ConnectPage() {
  return (
    <ProductAppShell title="Sync" className="dd-connect">
      <ConnectHubTiles />
    </ProductAppShell>
  )
}
