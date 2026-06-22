import Image from 'next/image'

import type { LandingClinician } from '@/lib/deepdose-marketing/landing-clinicians'
import { cn } from '@/lib/utils/cn'

const AVATAR_TONE_CLASS: Record<NonNullable<LandingClinician['tone']>, string> = {
  violet: 'seco-spectrum-tile__avatar--violet',
  amber: 'seco-spectrum-tile__avatar--amber',
  teal: 'seco-spectrum-tile__avatar--teal',
}

type ResearchScholarAvatarProps = {
  clinician: LandingClinician
}

/** Portrait for scholar spectrum tiles — fits the global icon slot. */
export function ResearchScholarAvatar({ clinician }: ResearchScholarAvatarProps) {
  if (clinician.image) {
    return (
      <Image
        src={clinician.image}
        alt={clinician.imageAlt ?? clinician.name}
        width={44}
        height={44}
        unoptimized
        className="seco-spectrum-tile__avatar-img"
      />
    )
  }

  const initials = clinician.initials ?? clinician.name.slice(0, 2).toUpperCase()
  const toneClass = clinician.tone ? AVATAR_TONE_CLASS[clinician.tone] : ''

  return (
    <span className={cn('seco-spectrum-tile__avatar-initials', toneClass)} aria-hidden="true">
      {initials}
    </span>
  )
}
