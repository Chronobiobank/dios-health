import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { PARTNERS_PAGE_META } from '@/lib/deepdose-marketing/partners-content'

export const metadata: Metadata = {
  title: PARTNERS_PAGE_META.title,
  description: PARTNERS_PAGE_META.description,
  robots: { index: false, follow: true },
}

/** Unpublished — partnerships not live yet */
export default function PartnersRoute() {
  redirect('/mission')
}
