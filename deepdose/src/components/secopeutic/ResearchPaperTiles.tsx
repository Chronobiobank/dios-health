import type { ResearchPaperTile } from '@/lib/secopeutic/research-content'

type ResearchPaperTilesProps = {
  papers: ResearchPaperTile[]
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
            <span className="seco-research-tile__tier">{paper.tier}</span>
            <span className="seco-research-tile__year">{paper.year}</span>
            <p className="seco-research-tile__title">{paper.title}</p>
            <p className="seco-research-tile__authors">{paper.authors}</p>
            <p className="seco-research-tile__meta">{paper.meta} ↗</p>
          </a>
        </li>
      ))}
    </ul>
  )
}
