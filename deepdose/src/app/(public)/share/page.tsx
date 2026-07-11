import { redirect } from 'next/navigation'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Share · ${DEEPDOSE_NAME}`,
  description: 'Log a dose — photo plus sleep score.',
  alternates: { canonical: '/share' },
}

/** Legacy share → Log Dose. */
export default function SharePage() {
  redirect('/dose')
}
