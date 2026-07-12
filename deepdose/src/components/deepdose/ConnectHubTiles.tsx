import Link from 'next/link'
import type { CSSProperties } from 'react'

import { SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { CONNECT_PAGE } from '@/lib/deepdose-marketing/dosage-content'

const HUB_CUES = ['#8b9cf8', '#acd3de', '#98d6c6'] as const

/** Sync hub tiles — how, matches, founder join. */
export function ConnectHubTiles() {
  return (
    <SpectrumTileGrid cols={3} aria-label="Sync actions">
      {CONNECT_PAGE.hub.map((tile, index) => (
        <Link
          key={tile.id}
          href={tile.href}
          className="seco-spectrum-tile seco-spectrum-tile--hero"
          style={{ '--cue': HUB_CUES[index % HUB_CUES.length] } as CSSProperties}
        >
          <p className="seco-spectrum-tile__title">{tile.title}</p>
          <p className="seco-spectrum-tile__body">{tile.body}</p>
        </Link>
      ))}
    </SpectrumTileGrid>
  )
}
