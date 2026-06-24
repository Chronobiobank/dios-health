import type { Metadata } from 'next'

import { PartnersPage } from '@/components/deepdose/marketing/PartnersPage'
import { PARTNERS_PAGE_META } from '@/lib/deepdose-marketing/partners-content'

export const metadata: Metadata = {
  title: PARTNERS_PAGE_META.title,
  description: PARTNERS_PAGE_META.description,
}

export default function PartnersRoute() {
  return <PartnersPage />
}
