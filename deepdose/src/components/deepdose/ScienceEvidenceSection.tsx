import { EVIDENCE_RESEARCH } from '@/lib/deepdose-marketing/evidence-content'
import { cn } from '@/lib/utils/cn'

type ScienceEvidenceSectionProps = {
  className?: string
}

/** Peer-reviewed sources — formerly the Foundation page research block. */
export function ScienceEvidenceSection({ className }: ScienceEvidenceSectionProps) {
  return (
    <section id="evidence" className={cn('seco-science__research seco-technology__section', className)}>
      <header className="seco-technology__section-head">
        <p className="seco-page__eyebrow">{EVIDENCE_RESEARCH.label}</p>
        <h2 className="seco-technology__h2">{EVIDENCE_RESEARCH.title}</h2>
        <p className="seco-technology__support">{EVIDENCE_RESEARCH.body}</p>
      </header>

      <ul className="seco-science-evidence">
        {EVIDENCE_RESEARCH.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="seco-science-evidence__link"
            >
              <span className="seco-science-evidence__title">{link.label}</span>
              <span className="seco-science-evidence__meta">{link.meta} ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
