import Link from 'next/link'

import { DEEPDOSE_LANDING_CONSENT } from '@/lib/secopeutic/landing-content'

export function SecopeuticConsentStrip() {
  const { title, meta, href } = DEEPDOSE_LANDING_CONSENT

  return (
    <Link href={href} className="seco-landing__consent-strip">
      <span className="seco-landing__consent-strip-title">{title}</span>
      <span className="seco-landing__consent-strip-meta">{meta}</span>
    </Link>
  )
}
