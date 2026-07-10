import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Share · ${DEEPDOSE_NAME}`,
  description: 'Post today’s Real — a photo plus your sleep score.',
  alternates: { canonical: '/share' },
}

/** Legacy share marketing → daily Real post. */
export default function SharePage() {
  redirect('/real/post')
}
