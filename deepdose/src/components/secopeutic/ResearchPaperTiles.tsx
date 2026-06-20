import { DEEPDOSE_RESEARCH_CLUSTERS } from '@/lib/secopeutic/research-content'
import { cn } from '@/lib/utils/cn'

const CLUSTER_HEAD_CLASS: Record<string, string> = {
  Foundational: 'seco-research-cluster__head--foundational',
  'Drug-specific': 'seco-research-cluster__head--drug',
  Population: 'seco-research-cluster__head--population',
}

export function ResearchPaperTiles() {
  return (
    <ul className="seco-research-clusters">
      {DEEPDOSE_RESEARCH_CLUSTERS.map((cluster) => (
        <li key={cluster.id} className="seco-research-cluster">
          <div
            className={cn(
              'seco-research-cluster__head',
              CLUSTER_HEAD_CLASS[cluster.tier] ?? 'seco-research-cluster__head--foundational'
            )}
          >
            <h3 className="seco-research-cluster__title">{cluster.tier}</h3>
            <p className="seco-research-cluster__summary">{cluster.summary}</p>
          </div>

          <ul className="seco-research-cluster__papers">
            {cluster.papers.map((paper) => (
              <li key={paper.id}>
                <a
                  href={paper.href}
                  className="seco-research-cluster__paper"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="seco-research-cluster__paper-title">{paper.title}</span>
                  <span className="seco-research-cluster__paper-meta">
                    {paper.authors} · {paper.year} · {paper.meta} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
