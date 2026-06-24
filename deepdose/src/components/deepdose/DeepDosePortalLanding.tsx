import Link from 'next/link'

import { ClinicianPortalTileIcon } from '@/components/deepdose/ClinicianPortalTileIcon'
import { LandingHeroIntro } from '@/components/deepdose/LandingHeroIntro'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'
import { MARKETING_CTA_CLASS, MARKETING_TILES_CLASS } from '@/lib/design/marketing-system'
import { spectrumCue } from '@/lib/design/spectrum-cues'

const CLINICIAN_TILE_ICONS = ['triage', 'tiptraq', 'timing', 'invite'] as const

export type PortalLandingStep = {
  title: string
  meta: string
  cue?: string
  label?: string
}

export type PortalLandingContent = {
  hero: LandingHeroContent
  steps: readonly PortalLandingStep[]
  cta: { label: string; href: string }
  note?: string
  accessNote?: string
  tileIcons?: readonly (typeof CLINICIAN_TILE_ICONS)[number][]
}

export function DeepDosePortalLanding({
  hero,
  steps,
  note,
  cta,
  accessNote,
  tileIcons = CLINICIAN_TILE_ICONS,
}: PortalLandingContent) {
  return (
    <div className="seco-landing seco-landing--maven">
      <section className="seco-landing__hero">
        <LandingHeroIntro hero={hero} />

        <div className="seco-landing__section-inner seco-reveal seco-reveal--3">
          <div className="seco-marketing-panel--tiles">
            <SpectrumTileGrid cols={2} className={MARKETING_TILES_CLASS}>
              {steps.map((step, index) => (
                <SpectrumTile
                  key={step.title}
                  as="article"
                  cue={step.cue ?? spectrumCue(index)}
                  label={step.label}
                  title={step.title}
                  body={step.meta}
                  rank={index + 1}
                  titleVariant="display"
                  icon={
                    tileIcons[index] ? (
                      <ClinicianPortalTileIcon id={tileIcons[index]} />
                    ) : undefined
                  }
                />
              ))}
            </SpectrumTileGrid>
          </div>

          {note ? <p className="seco-marketing-note">{note}</p> : null}

          <div className={MARKETING_CTA_CLASS}>
            {accessNote ? <p className="seco-marketing-cta__note">{accessNote}</p> : null}
            <Link href={cta.href} className="seco-landing__btn seco-landing__btn--primary">
              {cta.label} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
