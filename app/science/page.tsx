import Link from 'next/link'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/sections/marketing-shell'
import { HOME_PROOF } from '@/lib/pitch/home-landing-content'

export const metadata: Metadata = {
  title: 'The science is published — DIOS',
  description: 'Peer-reviewed evidence for timed medication and biological clock alignment.',
}

function ProofFinding({ text, emphasis }: { text: string; emphasis: string }) {
  const parts = text.split(emphasis)
  if (parts.length < 2) return <>{text}</>
  return (
    <>
      {parts[0]}
      <strong>{emphasis}</strong>
      {parts.slice(1).join(emphasis)}
    </>
  )
}

export default function SciencePage() {
  return (
    <MarketingShell showFooter={false}>
      <div className="dios-nav-tone-canvas dios-page-top-bleed min-h-svh px-6 pb-16 pt-[calc(var(--dios-site-nav-height,48px)+3rem)]">
        <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-4xl leading-tight">
          The science
          <br />
          is published.
        </h1>
        <p className="mt-4 text-sm text-black/60">
          Chronomedicine evidence library — indexed for clinician and patient sharing.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {HOME_PROOF.cards.map((card) => (
            <article
              key={card.ref}
              className="rounded border border-black/10 border-l-[3px] border-l-dios-aubergine-mid bg-[#f8f6f1] p-4"
            >
              <p className="font-mono text-[10px] tracking-wide text-black/30">{card.ref}</p>
              <p className="mt-1 text-sm font-light leading-relaxed text-[#383b40]">
                <ProofFinding text={card.finding} emphasis={card.emphasis} />
              </p>
              <a
                className="mt-2 inline-block font-mono text-[10px] text-dios-ink opacity-70"
                href={card.doi}
                target="_blank"
                rel="noopener noreferrer"
              >
                DOI ↗
              </a>
            </article>
          ))}
        </div>
        <p className="mt-8 font-mono text-xs">
          <Link href="/evidence" className="text-dios-ink">
            Extended clinical validation framework ↗
          </Link>
        </p>
        </div>
      </div>
    </MarketingShell>
  )
}
