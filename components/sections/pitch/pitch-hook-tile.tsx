'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import type { PitchCitation } from '@/lib/pitch/landing-content'
import { PITCH_HERO } from '@/lib/pitch/landing-images'

import { PitchMediaTile } from './pitch-media-tile'
import {
  PitchCtaRow,
  PitchInlineCitations,
  PitchTileEyebrow,
  PitchTileSub,
  PitchTileTitle,
} from './pitch-primitives'

type PitchHookTileProps = {
  eyebrow: string
  title: string
  subtitle: string
  citations: PitchCitation[]
  children: ReactNode
}

export function PitchHookTile({
  eyebrow,
  title,
  subtitle,
  citations,
  children,
}: PitchHookTileProps) {
  return (
    <PitchMediaTile
      image={PITCH_HERO.poster}
      imageAlt="Unused NHS prescription medicines"
      videoSrc={PITCH_HERO.video}
      size="hero"
      priority
    >
      <PitchTileEyebrow light>{eyebrow}</PitchTileEyebrow>
      <PitchTileTitle as="h1" light className="mt-2 max-w-xl">
        {title}
      </PitchTileTitle>
      <PitchTileSub light className="mt-2 max-w-md">
        {subtitle}
      </PitchTileSub>
      <PitchInlineCitations citations={citations} light />
      <PitchCtaRow compact>{children}</PitchCtaRow>
    </PitchMediaTile>
  )
}

export function PitchHookTileLinks() {
  return (
    <>
      <Link href="/signup/patient" className="pitch-btn-primary">
        Patients — free
      </Link>
      <Link href="/signup/clinician" className="pitch-btn-secondary">
        Clinicians — demo
      </Link>
    </>
  )
}
