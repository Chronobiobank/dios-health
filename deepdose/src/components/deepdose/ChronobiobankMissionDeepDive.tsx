import { HashOpenDisclosure } from '@/components/deepdose/HashOpenDisclosure'
import { ResearchSections } from '@/components/deepdose/marketing/ResearchSections'
import { ScienceTrustSections } from '@/components/deepdose/marketing/ScienceTrustSections'
import { CHRONOBIOBANK_DEEP_DIVE } from '@/lib/deepdose-marketing/chronobiobank-content'
import {
  CHRONOBIOBANK_RESEARCH_ANCHOR,
  CHRONOBIOBANK_SCIENCE_ANCHOR,
} from '@/lib/deepdose-marketing/site-nav-links'

/** Collapsed research detail — for curious readers; hash links from nav open these. */
export function ChronobiobankMissionDeepDive() {
  const { research, science } = CHRONOBIOBANK_DEEP_DIVE

  return (
    <div className="seco-chronobiobank__deep-dive seco-reveal seco-reveal--5">
      <HashOpenDisclosure
        anchor={CHRONOBIOBANK_RESEARCH_ANCHOR}
        title={research.title}
        teaser={research.teaser}
        badge={research.badge}
      >
        <ResearchSections />
      </HashOpenDisclosure>

      <HashOpenDisclosure
        anchor={CHRONOBIOBANK_SCIENCE_ANCHOR}
        title={science.title}
        teaser={science.teaser}
        badge={science.badge}
      >
        <ScienceTrustSections />
      </HashOpenDisclosure>
    </div>
  )
}
