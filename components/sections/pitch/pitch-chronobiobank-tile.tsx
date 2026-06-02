'use client'

import Link from 'next/link'

import { PITCH_CHRONOBIOBANK_STEPS, PITCH_CONTACT_PAGE } from '@/lib/pitch/landing-content'
import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

import { PitchMediaTile } from './pitch-media-tile'
import { PitchCtaRow } from './pitch-primitives'

export function PitchChronobiobankTile() {
  return (
    <PitchMediaTile
      image={PITCH_IMAGES.model}
      imageAlt="Chronobiobank consent and data governance"
      size="feature"
    >
      <ul className="flex flex-col gap-2">
        {PITCH_CHRONOBIOBANK_STEPS.map((step) => (
          <li key={step} className="flex gap-2 text-sm text-white/78 sm:text-[15px]">
            <span className="text-[var(--calm-brand)]/80" aria-hidden>
              —
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
      <PitchCtaRow compact>
        <Link href="/signup" className="pitch-btn-primary">
          Get started
        </Link>
        <Link href={PITCH_CONTACT_PAGE} className="pitch-btn-secondary">
          Research →
        </Link>
      </PitchCtaRow>
    </PitchMediaTile>
  )
}
