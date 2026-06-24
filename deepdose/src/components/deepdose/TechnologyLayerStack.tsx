import type { CSSProperties } from 'react'

import { MARKETING_NUM_CLASS } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

export type TechnologyLayer = {
  id: string
  rank: number
  label: string
  cue: string
  title: string
  body: string
}

type TechnologyLayerStackProps = {
  layers: readonly TechnologyLayer[]
  className?: string
}

/** Vertical four-layer stack — numbered gradient bullets, compounding architecture. */
export function TechnologyLayerStack({ layers, className }: TechnologyLayerStackProps) {
  return (
    <article className={cn('seco-technology__layer-stack seco-app-card', className)}>
      <ol className="seco-technology__layer-list">
        {layers.map((layer) => (
          <li
            key={layer.id}
            className="seco-technology__layer"
            style={{ '--cue': layer.cue } as CSSProperties}
          >
            <div className="seco-technology__layer-head">
              <span className={MARKETING_NUM_CLASS} aria-hidden="true">
                {layer.rank}
              </span>
              <div className="seco-technology__layer-heading">
                <span className="seco-technology__layer-label">{layer.label}</span>
                <h3 className="seco-technology__layer-title">{layer.title}</h3>
              </div>
            </div>
            <p className="seco-technology__layer-body">{layer.body}</p>
          </li>
        ))}
      </ol>
    </article>
  )
}
