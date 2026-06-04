import Link from 'next/link'

import {
  EVIDENCE_DIOS_BRIDGE,
  EVIDENCE_HERO,
  RECENT_CLINICAL_EVIDENCE,
  SPECTRUM_SECTION,
  UK_BIOBANK_FINDINGS,
  UK_BIOBANK_STATS,
} from '@/lib/evidence/circadian-model-content'

import { BODY, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from '../layout'

export function EvidenceHero() {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">{EVIDENCE_HERO.eyebrow}</p>
      <h1 className="type-section mt-4 text-[#0D0D0D]">{EVIDENCE_HERO.title}</h1>
      <p className={`${BODY} mt-4 text-[#0D0D0D]/75`}>{EVIDENCE_HERO.lead}</p>
    </header>
  )
}

export function UkBiobankStatsRow() {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {UK_BIOBANK_STATS.map((stat) => (
        <li
          key={stat.label}
          className="rounded-lg border border-black/10 bg-white px-5 py-4 text-center"
        >
          <p className="text-2xl font-semibold tracking-tight text-[#0D0D0D]">{stat.value}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-black/45">{stat.label}</p>
        </li>
      ))}
    </ul>
  )
}

export function UkBiobankFindingsSection() {
  return (
    <section className={`${SECTION} scroll-mt-24 border-t border-black/[0.06]`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">UK Biobank</p>
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl text-[#0D0D0D]`}>
          Three landmark findings from wrist-worn light
        </h2>
        <UkBiobankStatsRow />
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {UK_BIOBANK_FINDINGS.map((finding) => (
            <article
              key={finding.id}
              className="flex h-full flex-col rounded-lg border border-black/10 bg-white p-6"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-[#9a7b3c]">
                {finding.journal}
              </p>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-[#0D0D0D]">{finding.title}</h3>
              <p className={`${BODY} mt-3 flex-1 text-sm text-[#0D0D0D]/70`}>{finding.body}</p>
              <a
                href={finding.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 text-sm font-medium text-[#0D0D0D] underline underline-offset-4 hover:opacity-80"
              >
                {finding.hrefLabel} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EvidenceDiosBridgeSection() {
  const bridge = EVIDENCE_DIOS_BRIDGE

  return (
    <section className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">{bridge.eyebrow}</p>
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl text-[#0D0D0D]`}>{bridge.title}</h2>
        <p className={`${BODY} mt-4 max-w-3xl text-[#0D0D0D]/75`}>{bridge.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {bridge.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="btn-primary type-button inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-white transition-colors hover:bg-black/80"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EvidenceSpectrumIntro() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">{SPECTRUM_SECTION.eyebrow}</p>
      <h2 className="type-section mt-4 max-w-3xl text-[#0D0D0D]">{SPECTRUM_SECTION.title}</h2>
      <p className="type-body mt-4 max-w-2xl text-[#0D0D0D]/65">{SPECTRUM_SECTION.lead}</p>
    </>
  )
}

export function RecentClinicalEvidenceSection() {
  const section = RECENT_CLINICAL_EVIDENCE

  return (
    <section className={`${SECTION} border-t border-black/[0.06]`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">{section.eyebrow}</p>
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl text-[#0D0D0D]`}>{section.title}</h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {section.items.map((item) => (
            <li key={item.href} className="rounded-lg border border-black/10 bg-white p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-black/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-black/50">
                  {item.year}
                </span>
                <span className="text-sm font-medium text-[#0D0D0D]">{item.source}</span>
              </div>
              <p className={`${BODY} mt-3 text-sm text-[#0D0D0D]/70`}>{item.detail}</p>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-[#0D0D0D] underline underline-offset-4 hover:opacity-80"
              >
                View study →
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** @deprecated Use EvidenceHero — kept for any stale imports */
export const CircadianModelHero = EvidenceHero
