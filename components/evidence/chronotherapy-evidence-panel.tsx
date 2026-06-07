'use client'

import {
  CHRONOTHERAPY_EVIDENCE_TABS,
  type ChronotherapyEvidenceCard,
} from '@/lib/evidence/chronotherapy-model-content'
import { cn } from '@/lib/utils'

type ChronotherapyEvidencePanelProps = {
  activeTabId: string
  onTabChange: (tabId: string) => void
}

function EvidenceCard({ card }: { card: ChronotherapyEvidenceCard }) {
  const parts = card.finding.split(card.emphasis)
  const hasEmphasis = parts.length > 1

  return (
    <article className="chronotherapy-evidence__card">
      <div className="chronotherapy-evidence__card-head">
        <p className="chronotherapy-evidence__study">{card.study}</p>
        <span className="chronotherapy-evidence__badge">{card.badge}</span>
      </div>

      <p className="chronotherapy-evidence__finding">
        {hasEmphasis ? (
          <>
            {parts[0]}
            <em className="chronotherapy-evidence__emphasis">{card.emphasis}</em>
            {parts.slice(1).join(card.emphasis)}
          </>
        ) : (
          card.finding
        )}
      </p>

      <p className="chronotherapy-evidence__detail">{card.detail}</p>

      <a
        href={card.doi}
        target="_blank"
        rel="noopener noreferrer"
        className="chronotherapy-evidence__doi"
      >
        {card.doiLabel ?? 'DOI'} ↗
      </a>
    </article>
  )
}

export function ChronotherapyEvidencePanel({
  activeTabId,
  onTabChange,
}: ChronotherapyEvidencePanelProps) {
  const activeTab =
    CHRONOTHERAPY_EVIDENCE_TABS.find((tab) => tab.id === activeTabId) ??
    CHRONOTHERAPY_EVIDENCE_TABS[0]

  return (
    <section className="chronotherapy-evidence" aria-label="Chronotherapy evidence">
      <div className="chronotherapy-evidence__header">
        <p className="chronotherapy-evidence__eyebrow">Trial evidence</p>
        <h2 className="chronotherapy-evidence__title">Published chronotherapy — by clinical cluster</h2>
        <p className="chronotherapy-evidence__lede">
          Same labels as the matrix above. Open a cluster to read the trial, mechanism, and what DIOS
          does that NHS formulary defaults do not.
        </p>
      </div>

      <div
        className="chronotherapy-evidence__tabs"
        role="tablist"
        aria-label="Evidence clusters"
      >
        {CHRONOTHERAPY_EVIDENCE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeTab.id}
            className={cn(
              'chronotherapy-evidence__tab',
              tab.id === activeTab.id && 'chronotherapy-evidence__tab--active'
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="chronotherapy-evidence__cards"
        role="tabpanel"
        aria-label={activeTab.label}
      >
        {activeTab.cards.map((card) => (
          <EvidenceCard key={`${activeTab.id}-${card.study}`} card={card} />
        ))}
      </div>

      <p className="chronotherapy-evidence__cluster-insight">
        <span className="chronotherapy-evidence__insight-label">DIOS</span>
        {activeTab.diosInsight}
      </p>
    </section>
  )
}
