import { HashLink } from '@/components/sections/HashLink'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EVIDENCE_TIERS, EQUITY_GAP } from '@/lib/evidence-citations'

import { BODY } from './layout'
import { ResearchersSection } from './Researchers'

type EvidenceCardsProps = {
  showCta?: boolean
}

export function EvidenceCards({ showCta = false }: EvidenceCardsProps) {
  return (
    <>
      {EVIDENCE_TIERS.map((tier) => (
        <div key={tier.id} className="mt-12">
          <h3 className="font-mono text-xs uppercase tracking-widest text-black/50">{tier.title}</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {tier.citations.map((citation) => (
              <Card
                key={citation.id}
                className="gap-0 border border-black/10 bg-white py-0 shadow-none ring-0"
              >
                <CardHeader className="gap-3 px-6 pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-black/10 text-black/70">
                      {citation.year}
                    </Badge>
                    {citation.doi ? (
                      <span className="font-mono text-xs text-black/40">DOI: {citation.doi}</span>
                    ) : null}
                  </div>
                  <CardTitle className="font-sans text-base font-semibold leading-snug text-black">
                    {citation.source}
                  </CardTitle>
                  <p className="type-body text-sm text-black/60">{citation.authors}</p>
                  {citation.institution ? (
                    <p className="type-label text-black/50">{citation.institution}</p>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  <p className="type-body text-sm text-black/70">{citation.detail}</p>
                  {citation.note ? (
                    <p className="type-body text-sm italic text-black/50">{citation.note}</p>
                  ) : null}
                  <p className="border-l-2 border-[#C9973A] pl-4 text-sm leading-relaxed text-black">
                    <span className="font-medium">Confirms for DIOS: </span>
                    {citation.confirms}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div id="sovereignty" className="mt-16 scroll-mt-24">
        <h3 className="type-section">{EQUITY_GAP.title}</h3>
        <p className="type-label mt-2 text-black/50">{EQUITY_GAP.disclaimer}</p>
        <div className="mt-6 border-l-4 border-teal-500 bg-teal-50/50 px-6 py-8">
          {EQUITY_GAP.body.split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={`${BODY} text-black/80`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <ResearchersSection variant={showCta ? 'full' : 'condensed'} />

      {showCta ? (
        <div className="mt-12 text-center">
          <HashLink
            href="/#demo"
            className="btn-primary type-button inline-flex items-center justify-center rounded-full bg-black py-3 text-white transition-colors hover:bg-black/80"
          >
            See how DIOS implements chronodosing in your practice →
          </HashLink>
        </div>
      ) : null}
    </>
  )
}
