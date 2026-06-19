import type { ResearchPaperTile } from '@/lib/secopeutic/research-content'
import { cn } from '@/lib/utils/cn'

type ResearchPaperTilesProps = {
  papers: ResearchPaperTile[]
}

/** Tier → day-to-night gradient band, so each card carries a circadian colour cue. */
const TIER_BAND_CLASS: Record<string, string> = {
  Foundational: 'seco-research-tile__band--foundational',
  'Drug-specific': 'seco-research-tile__band--drug',
  Population: 'seco-research-tile__band--population',
}

export function ResearchPaperTiles({ papers }: ResearchPaperTilesProps) {
  return (
    <ul className="seco-research-tiles">
      {papers.map((paper) => (
        <li key={paper.id}>
          <a
            href={paper.href}
            className="seco-research-tile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className={cn(
                'seco-research-tile__band',
                TIER_BAND_CLASS[paper.tier] ?? 'seco-research-tile__band--foundational'
              )}
              aria-hidden="true"
            >
              <span className="seco-research-tile__tier">{paper.tier}</span>
              <span className="seco-research-tile__year">{paper.year}</span>
            </span>
            <span className="seco-research-tile__body">
              <span className="seco-research-tile__title">{paper.title}</span>
              <span className="seco-research-tile__authors">{paper.authors}</span>
              <span className="seco-research-tile__meta">{paper.meta} ↗</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
