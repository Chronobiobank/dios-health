import {
  ChronobiobankTileIcon,
  type ChronobiobankTileIconId,
} from '@/components/deepdose/ChronobiobankTileIcon'
import { MarketingFoldTileGrid } from '@/components/deepdose/MarketingFoldTileGrid'
import { SCIENCE_TRUST_FEATURES } from '@/lib/deepdose-marketing/science-trust-content'
import { cn } from '@/lib/utils/cn'

type ScienceTrustFeatureId = (typeof SCIENCE_TRUST_FEATURES)[number]['id']

const FEATURE_ICONS: Record<ScienceTrustFeatureId, ChronobiobankTileIconId> = {
  limits: 'governance',
  measure: 'sleep',
  privacy: 'shield',
  evidence: 'partner-academic',
}

type ScienceTrustFeaturesProps = {
  className?: string
}

/** Four essential trust tiles — static grid, links to detail pages. */
export function ScienceTrustFeatures({ className }: ScienceTrustFeaturesProps) {
  return (
    <MarketingFoldTileGrid
      className={cn('seco-chronobiobank__feature-grid', className)}
      tiles={SCIENCE_TRUST_FEATURES.map((feature) => ({
        id: feature.id,
        badge: feature.badge,
        title: feature.title,
        teaser: feature.teaser,
        cue: feature.cue,
        href: feature.href,
        icon: <ChronobiobankTileIcon id={FEATURE_ICONS[feature.id]} />,
      }))}
    />
  )
}
