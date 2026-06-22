import Link from 'next/link'

import {
  ChronobiobankTileIcon,
  type ChronobiobankTileIconId,
} from '@/components/deepdose/ChronobiobankTileIcon'
import { MissionFeatureGrid, type MissionFeature } from '@/components/deepdose/MissionFeatureGrid'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import {
  CHRONOBIOBANK_MISSION_FEATURES,
  CHRONOBIOBANK_MISSION_JOIN,
  CHRONOBIOBANK_MISSION_STEPS,
  CHRONOBIOBANK_MISSION_TIMING,
  CHRONOBIOBANK_MISSION_TOGETHER,
  CHRONOBIOBANK_MISSION_YOURS,
} from '@/lib/deepdose-marketing/chronobiobank-content'
import { CHRONOBIOBANK_RESEARCH_HREF } from '@/lib/deepdose-marketing/site-nav-links'

type MissionFeatureId = (typeof CHRONOBIOBANK_MISSION_FEATURES)[number]['id']

const FEATURE_ICONS: Record<MissionFeatureId, ChronobiobankTileIconId> = {
  yours: 'shield',
  together: 'learning',
  timing: 'sleep',
  join: 'audience-patient',
}

const STEP_ICONS: Record<(typeof CHRONOBIOBANK_MISSION_STEPS)[number]['id'], ChronobiobankTileIconId> = {
  phone: 'device',
  learn: 'learning',
  share: 'licensing',
}

const YOURS_ICONS: Record<(typeof CHRONOBIOBANK_MISSION_YOURS.contrasts)[number]['id'], ChronobiobankTileIconId> =
  {
    central: 'warehouse',
    distributed: 'shield',
  }

const JOIN_ICONS: Record<(typeof CHRONOBIOBANK_MISSION_JOIN.audiences)[number]['id'], ChronobiobankTileIconId> = {
  patient: 'audience-patient',
  researcher: 'role-clinician',
  funder: 'audience-researcher',
}

function missionFeatureMeta(id: MissionFeatureId) {
  const feature = CHRONOBIOBANK_MISSION_FEATURES.find((item) => item.id === id)!
  return {
    id: feature.id,
    title: feature.title,
    teaser: feature.teaser,
    badge: feature.badge,
    cue: feature.cue,
    icon: <ChronobiobankTileIcon id={FEATURE_ICONS[id]} />,
  }
}

function buildMissionFeatures(): MissionFeature[] {
  return [
    {
      ...missionFeatureMeta('yours'),
      body: (
        <>
          <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_MISSION_YOURS.intro}</p>
          <SpectrumTileGrid cols={2} className="seco-chronobiobank__contrast">
            {CHRONOBIOBANK_MISSION_YOURS.contrasts.map((item) => (
              <SpectrumTile
                key={item.id}
                cue={item.cue}
                variant={item.id === 'distributed' ? 'hero' : 'muted'}
                label={item.label}
                title={item.title}
                body={item.body}
                titleTag="h3"
                icon={<ChronobiobankTileIcon id={YOURS_ICONS[item.id]} />}
              />
            ))}
          </SpectrumTileGrid>
          <p className="seco-chronobiobank__closing">{CHRONOBIOBANK_MISSION_YOURS.closing}</p>
          <Link href="/consent" className="seco-research-inline-link">
            How consent works ↗
          </Link>
        </>
      ),
    },
    {
      ...missionFeatureMeta('together'),
      body: (
        <>
          <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_MISSION_TOGETHER.intro}</p>
          <SpectrumTileGrid cols={3} className="seco-chronobiobank__plane-stack">
            {CHRONOBIOBANK_MISSION_STEPS.map((step) => (
              <SpectrumTile
                key={step.id}
                cue={step.cue}
                variant={step.id === 'learn' ? 'hero' : 'default'}
                label={step.label}
                title={step.title}
                body={step.body}
                titleTag="h3"
                icon={<ChronobiobankTileIcon id={STEP_ICONS[step.id]} />}
              />
            ))}
          </SpectrumTileGrid>
        </>
      ),
    },
    {
      ...missionFeatureMeta('timing'),
      body: (
        <>
          <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_MISSION_TIMING.intro}</p>
          <SpectrumTileGrid cols={3} className="seco-chronobiobank__timing-points">
            {CHRONOBIOBANK_MISSION_TIMING.points.map((point) => (
              <SpectrumTile
                key={point.title}
                cue={point.cue}
                label="Daily rhythm"
                title={point.title}
                body={point.body}
                titleTag="h3"
                icon={<ChronobiobankTileIcon id="meds" />}
              />
            ))}
          </SpectrumTileGrid>
          <p className="seco-chronobiobank__note">{CHRONOBIOBANK_MISSION_TIMING.footnote}</p>
          <p className="seco-chronobiobank__deep-links">
            <Link href={CHRONOBIOBANK_RESEARCH_HREF} className="seco-research-inline-link">
              Research library ↗
            </Link>
            {' · '}
            <Link href="/science" className="seco-research-inline-link">
              Science &amp; trust ↗
            </Link>
          </p>
        </>
      ),
    },
    {
      ...missionFeatureMeta('join'),
      body: (
        <>
          <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_MISSION_JOIN.intro}</p>
          <SpectrumTileGrid cols={3} className="seco-chronobiobank__audiences">
            {CHRONOBIOBANK_MISSION_JOIN.audiences.map((audience) => (
              <SpectrumTile
                key={audience.id}
                cue={audience.cue}
                variant={audience.id === 'patient' ? 'hero' : 'default'}
                label={audience.label}
                title={audience.title}
                body={audience.body}
                titleTag="h3"
                icon={<ChronobiobankTileIcon id={JOIN_ICONS[audience.id]} />}
                foot={
                  <Link href={audience.cta.href} className="seco-research-inline-link">
                    {audience.cta.label} →
                  </Link>
                }
              />
            ))}
          </SpectrumTileGrid>
        </>
      ),
    },
  ]
}

type ChronobiobankMissionFeaturesProps = {
  className?: string
}

export function ChronobiobankMissionFeatures({ className }: ChronobiobankMissionFeaturesProps) {
  return <MissionFeatureGrid className={className} features={buildMissionFeatures()} />
}
