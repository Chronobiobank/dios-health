import Image from 'next/image'

import { DEEPDOSE_LANDING_PROOF } from '@/lib/secopeutic/landing-content'
import type { LandingClinician } from '@/lib/secopeutic/landing-clinicians'
import { cn } from '@/lib/utils/cn'

const AVATAR_TONE_CLASS: Record<NonNullable<LandingClinician['tone']>, string> = {
  violet: 'seco-hero-proof__avatar--violet',
  amber: 'seco-hero-proof__avatar--amber',
  teal: 'seco-hero-proof__avatar--teal',
}

function ProofAvatar({ clinician }: { clinician: LandingClinician }) {
  if (clinician.image) {
    return (
      <Image
        src={clinician.image}
        alt={clinician.imageAlt ?? clinician.name}
        width={40}
        height={40}
        unoptimized
        className="seco-hero-proof__avatar"
      />
    )
  }

  const initials = clinician.initials ?? clinician.name.slice(0, 2).toUpperCase()
  const toneClass = clinician.tone ? AVATAR_TONE_CLASS[clinician.tone] : ''

  return (
    <span
      className={cn('seco-hero-proof__avatar seco-hero-proof__avatar--initials', toneClass)}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

export function SecopeuticHeroProof() {
  const { title, scholars } = DEEPDOSE_LANDING_PROOF

  return (
    <div className="seco-landing__hero-proof" aria-label={title}>
      <p className="seco-landing__hero-proof-kicker">{title}</p>
      <ul className="seco-landing__hero-proof-list">
        {scholars.map(({ clinician, cite }) => (
          <li key={clinician.name} className="seco-landing__hero-proof-item">
            <ProofAvatar clinician={clinician} />
            <div className="seco-landing__hero-proof-copy">
              <p className="seco-landing__hero-proof-name">{clinician.name}</p>
              <p className="seco-landing__hero-proof-cite">{cite}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
