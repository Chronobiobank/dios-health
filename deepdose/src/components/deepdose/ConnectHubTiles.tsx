import Link from 'next/link'
import type { CSSProperties } from 'react'

import { CONNECT_PAGE } from '@/lib/deepdose-marketing/dosage-content'

const HUB_CUES = ['#acd3de', '#c9b6f2'] as const

/** Sync hub — short head + how / join tiles. */
export function ConnectHubTiles() {
  return (
    <div className="dd-connect__hub">
      <header className="dd-connect__hub-head">
        <h1 className="seco-page__title dd-connect__hub-title">
          <span className="seco-landing__hero-spectrum">{CONNECT_PAGE.title}</span>
        </h1>
      </header>

      <ul className="dd-connect__hub-grid" aria-label="Sync actions">
        {CONNECT_PAGE.hub.map((tile, index) => (
          <li key={tile.id}>
            <Link
              href={tile.href}
              className="seco-spectrum-tile seco-spectrum-tile--hero dd-connect__hub-tile"
              style={{ '--cue': HUB_CUES[index % HUB_CUES.length] } as CSSProperties}
            >
              <p className="seco-spectrum-tile__title">{tile.title}</p>
              <p className="seco-spectrum-tile__body">
                {tile.body[0]}
                <br />
                {tile.body[1]}
              </p>
              <span className="dd-connect__hub-tile-cta">{tile.cta} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
