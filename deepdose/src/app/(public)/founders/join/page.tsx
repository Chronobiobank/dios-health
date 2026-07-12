import type { Metadata } from 'next'

import { FounderJoinForm } from '@/components/deepdose/FounderJoinForm'
import { FOUNDERS_JOIN_META } from '@/lib/deepdose-marketing/founders-content'

export const metadata: Metadata = {
  title: FOUNDERS_JOIN_META.title,
  description: FOUNDERS_JOIN_META.description,
  alternates: { canonical: '/founders/join' },
}

/** Manjam founders — email, password, two meds → profile. */
export default function FoundersJoinPage() {
  return (
    <article className="seco-page seco-marketing-page seco-auth-page">
      <div className="seco-landing__section-inner seco-auth-page__inner">
        <div className="seco-app-card seco-auth-card p-5 md:p-6">
          <FounderJoinForm />
        </div>
      </div>
    </article>
  )
}
