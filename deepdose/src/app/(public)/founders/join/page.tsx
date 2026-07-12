import type { Metadata } from 'next'

import { FounderJoinForm } from '@/components/deepdose/FounderJoinForm'
import { FOUNDERS_JOIN_META } from '@/lib/deepdose-marketing/founders-content'

export const metadata: Metadata = {
  title: FOUNDERS_JOIN_META.title,
  description: FOUNDERS_JOIN_META.description,
  alternates: { canonical: '/founders/join' },
}

/** Manjam founders — med baseline + email/password → profile. */
export default function FoundersJoinPage() {
  return (
    <article className="seco-page seco-mission seco-marketing-page seco-how-page dd-join">
      <div className="seco-landing__section-inner seco-how-page__inner">
        <FounderJoinForm />
      </div>
    </article>
  )
}
