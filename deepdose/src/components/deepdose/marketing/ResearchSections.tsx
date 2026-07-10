import Link from 'next/link'

import { ResearchPaperTiles } from '@/components/deepdose/ResearchPaperTiles'
import { ResearchScholarAvatar } from '@/components/deepdose/ResearchScholarAvatar'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import {
  DEEPDOSE_RESEARCH_INTRO,
  DEEPDOSE_RESEARCH_SCHOLARS,
} from '@/lib/deepdose-marketing/research-content'
import { marketingCtaClass, marketingTilesClass } from '@/lib/design/marketing-system'
import { scholarToneCue, spectrumCue } from '@/lib/design/spectrum-cues'

export function ResearchSections({ showClose = true }: { showClose?: boolean }) {
  const { lede, cost, human, consent } = DEEPDOSE_RESEARCH_INTRO

  return (
    <div className="seco-research seco-research--embedded">
      <p className="seco-chronobiobank__prose">{lede}</p>

      <SpectrumTileGrid cols={2} className={marketingTilesClass('seco-research__costs')}>
        <SpectrumTile
          cue="#f2b8a2"
          label="The human cost"
          title="21–34% ↑"
          lead="higher risk of death with bright nights"
          body={
            <>
              Your melatonin onset (DLMO) is the nightly signal that switches on cellular repair —
              for brain and body. When it drifts out of sync, repair is blunted, and the damage
              compounds into disease and fewer healthy years. The UK Biobank&rsquo;s 88,905-person
              study found disrupted light&ndash;dark cycles predict higher mortality.
            </>
          }
          foot={
            <a
              href={human.href}
              className="seco-research-inline-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {human.label} ↗
            </a>
          }
        />
        <SpectrumTile
          cue="#8b9cf8"
          label="The cost to the NHS"
          title="£100s of millions"
          lead="avoidable medicines harm each year"
          body={
            <>
              Much of it because a medicine&rsquo;s timing never matched the person&rsquo;s body
              clock — the same drug, given at the wrong phase, working against the patient instead
              of with them.
            </>
          }
          foot={
            <a
              href={cost.href}
              className="seco-research-inline-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {cost.label} ↗
            </a>
          }
        />
      </SpectrumTileGrid>

      <div className="seco-research-scholars" aria-label="Key researchers">
        <h3 className="seco-research__h2">Built on Halberg</h3>
        <p className="seco-research__section-sub">
          Franz Halberg founded chronobiology decades ago. Today&rsquo;s researchers keep proving
          him right.
        </p>
        <SpectrumTileGrid as="ul" cols={2} className={marketingTilesClass('seco-research-scholars-list')}>
          {DEEPDOSE_RESEARCH_SCHOLARS.map(({ clinician, cite, href, sourceLabel }, index) => (
            <SpectrumTile
              key={clinician.name}
              as="li"
              cue={scholarToneCue(clinician.tone) ?? spectrumCue(index)}
              label="Chronobiology"
              title={clinician.name}
              titleTag="h3"
              body={cite}
              icon={<ResearchScholarAvatar clinician={clinician} />}
              foot={
                <a
                  href={href}
                  className="seco-research-inline-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sourceLabel} ↗
                </a>
              }
            />
          ))}
        </SpectrumTileGrid>
      </div>

      <div className="seco-research-papers">
        <h3 className="seco-research__h2">Key papers</h3>
        <p className="seco-research__section-sub">
          Three evidence clusters — foundational science, drug timing, and population scale.
        </p>
        <ResearchPaperTiles />
      </div>

      {showClose ? (
        <div className={marketingCtaClass('seco-research__close')}>
          <p className="seco-research__close-sub seco-marketing-cta__note">{consent}</p>
          <Link href="/" className="seco-landing__btn seco-landing__btn--primary">
            Start free →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
