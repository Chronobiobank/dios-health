import { SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { TechnologyLayerTile } from '@/components/deepdose/TechnologyLayerTile'
import type { TechnologyHubLayer } from '@/lib/deepdose-marketing/technology-content'
import { marketingTilesClass } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

type TechnologyLayerTilesProps = {
  layers: readonly TechnologyHubLayer[]
  className?: string
}

/** Four-layer technology stack — one hero tile per layer (2×2 grid). */
export function TechnologyLayerTiles({ layers, className }: TechnologyLayerTilesProps) {
  return (
    <SpectrumTileGrid
      as="ol"
      cols={2}
      sm2
      className={marketingTilesClass(cn('seco-technology__layer-tiles', className))}
      aria-label="Technology stack layers"
    >
      {layers.map((layer, index) => (
        <TechnologyLayerTile
          key={layer.id}
          layer={layer}
          className={cn('seco-reveal', `seco-reveal--${Math.min(index + 2, 6)}`)}
        />
      ))}
    </SpectrumTileGrid>
  )
}
