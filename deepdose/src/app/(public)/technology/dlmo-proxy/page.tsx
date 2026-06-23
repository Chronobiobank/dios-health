import type { Metadata } from 'next'

import { DlmoProxyTechnologyPage } from '@/components/deepdose/marketing/DlmoProxyTechnologyPage'
import { DLMO_PROXY_PAGE_META } from '@/lib/deepdose-marketing/technology-content'

export const metadata: Metadata = {
  title: DLMO_PROXY_PAGE_META.title,
  description: DLMO_PROXY_PAGE_META.description,
}

export default function DlmoProxyTechnologyRoute() {
  return <DlmoProxyTechnologyPage />
}
