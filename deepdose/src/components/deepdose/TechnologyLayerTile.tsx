import type { CSSProperties } from 'react'

import { TechnologyLayerIcon } from '@/components/deepdose/TechnologyLayerIcon'
import type { TechnologyHubLayer } from '@/lib/deepdose-marketing/technology-content'
import { cn } from '@/lib/utils/cn'

type TechnologyLayerTileProps = {
  layer: TechnologyHubLayer
  className?: string
}

/** Hero-grade stack layer — icon, teaser, and scannable highlights. */
export function TechnologyLayerTile({ layer, className }: TechnologyLayerTileProps) {
  return (
    <li
      className={cn(
        'seco-spectrum-tile seco-spectrum-tile--hero seco-spectrum-tile--rank seco-technology__layer-tile',
        className,
      )}
      style={{ '--cue': layer.cue } as CSSProperties}
    >
      <div className="seco-spectrum-tile__content">
        <div className="seco-technology__layer-tile__head">
          <span className="seco-technology__layer-tile__icon" aria-hidden>
            <TechnologyLayerIcon id={layer.icon} />
          </span>
          <span className="seco-technology__layer-tile__cue">{layer.label}</span>
        </div>
        <h3 className="seco-technology__layer-tile__title">{layer.title}</h3>
        <p className="seco-technology__layer-tile__teaser">{layer.teaser}</p>
        <ul className="seco-technology__layer-tile__highlights">
          {layer.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <span className="seco-spectrum-tile__rank" aria-hidden="true">
        {String(layer.rank).padStart(2, '0')}
      </span>
    </li>
  )
}
