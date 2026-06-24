import {
  ChronobiobankTileIcon,
  type ChronobiobankTileIconId,
} from '@/components/deepdose/ChronobiobankTileIcon'
import { MarketingFoldTileGrid } from '@/components/deepdose/MarketingFoldTileGrid'
import { CHRONOBIOBANK_MISSION_FEATURES } from '@/lib/deepdose-marketing/chronobiobank-content'
import { cn } from '@/lib/utils/cn'

type MissionFeatureId = (typeof CHRONOBIOBANK_MISSION_FEATURES)[number]['id']

const FEATURE_ICONS: Record<MissionFeatureId, ChronobiobankTileIconId> = {
  yours: 'shield',
  together: 'learning',
  timing: 'sleep',
  join: 'audience-patient',
}

type ChronobiobankMissionFeaturesProps = {
  className?: string
}

/** Mission story tiles — badge, title, and teaser (no expand / chevrons). */
export function ChronobiobankMissionFeatures({ className }: ChronobiobankMissionFeaturesProps) {
  return (
    <MarketingFoldTileGrid
      className={cn('seco-chronobiobank__feature-grid', className)}
      tiles={CHRONOBIOBANK_MISSION_FEATURES.map((feature) => ({
        id: feature.id,
        badge: feature.badge,
        title: feature.title,
        teaser: feature.teaser,
        cue: feature.cue,
        icon: <ChronobiobankTileIcon id={FEATURE_ICONS[feature.id]} />,
      }))}
    />
  )
}
