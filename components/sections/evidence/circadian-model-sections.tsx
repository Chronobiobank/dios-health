import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CIRCADIAN_MODEL_HERO,
  DRUGS_DONT_WORK_SECTION,
  GLOBAL_INEFFECTIVE_TIMING_MEDS,
  PERSONALISATION_PAYOFF,
  UK_INEFFECTIVE_TIMING_MEDS,
  type IneffectiveMedRow,
} from '@/lib/evidence/circadian-model-content'

import { BODY, CARD, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from '../layout'

function MedTable({
  title,
  rows,
  locale,
}: {
  title: string
  locale: 'uk' | 'global'
  rows: readonly IneffectiveMedRow[]
}) {
  return (
    <div className="mt-10">
      <h3 className="font-mono text-xs uppercase tracking-widest text-black/50">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {rows.map((row) => (
          <Card key={row.name} className={`${CARD} gap-0 py-0`}>
            <CardHeader className="gap-2 px-5 pt-5 pb-0 sm:px-6 sm:pt-6">
              <CardTitle className="font-sans text-base font-semibold leading-snug text-black">
                {row.name}
              </CardTitle>
              {locale === 'uk' && row.ukRank ? (
                <p className="text-xs text-black/45">{row.ukRank}</p>
              ) : null}
              {locale === 'global' && row.globalNote ? (
                <p className="text-xs text-black/45">{row.globalNote}</p>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-black/40">
                  Why default timing fails
                </p>
                <p className={`${BODY} mt-1 text-sm text-black/70`}>{row.whyTimingFails}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#9a7b3c]">
                  Chronotherapy signal
                </p>
                <p className={`${BODY} mt-1 text-sm text-black/80`}>{row.chronotherapySignal}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CircadianModelHero() {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">
        {CIRCADIAN_MODEL_HERO.eyebrow}
      </p>
      <h1 className="type-section mt-4">{CIRCADIAN_MODEL_HERO.title}</h1>
      <p className={`${BODY} mt-4 text-black/70`}>{CIRCADIAN_MODEL_HERO.lead}</p>
    </header>
  )
}

export function DrugsDontWorkSection() {
  const s = DRUGS_DONT_WORK_SECTION

  return (
    <section id={s.id} className={`${SECTION} scroll-mt-24`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">{s.eyebrow}</p>
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>{s.title}</h2>
        <p className={`${BODY} mt-4 max-w-3xl text-black/70`}>{s.intro}</p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-black/10 bg-white p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-black/45">
              {s.report.title}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-black">{s.report.subtitle}</h3>
            <p className={`${BODY} mt-3 text-sm text-black/70`}>{s.report.body}</p>
            <a
              href={s.report.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-black underline underline-offset-4 hover:text-black/70"
            >
              {s.report.hrefLabel} →
            </a>
          </article>

          <article className="rounded-lg border border-teal-600/20 bg-teal-50/40 p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-teal-900/60">
              NHS medicines waste
            </p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-teal-950">
              {s.waste.ukHeadline}
            </p>
            <p className={`${BODY} mt-3 text-sm text-teal-950/80`}>{s.waste.ukLine}</p>
            <a
              href={s.waste.ukHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-teal-900 underline underline-offset-4"
            >
              {s.waste.ukHrefLabel} →
            </a>
            <p className={`${BODY} mt-6 border-t border-teal-900/10 pt-6 text-sm text-teal-950/75`}>
              {s.waste.globalLine}
            </p>
          </article>
        </div>

        <MedTable title="United Kingdom — high-volume medicines where timing drives outcomes" locale="uk" rows={UK_INEFFECTIVE_TIMING_MEDS} />
        <MedTable title="Global — same pattern across health systems" locale="global" rows={GLOBAL_INEFFECTIVE_TIMING_MEDS} />
      </div>
    </section>
  )
}

export function PersonalisationPayoffSection() {
  const p = PERSONALISATION_PAYOFF

  return (
    <section className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">{p.eyebrow}</p>
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>{p.title}</h2>
        <ul className="mt-8 max-w-3xl space-y-4">
          {p.bullets.map((bullet) => (
            <li key={bullet} className={`${BODY} flex gap-3 text-black/80`}>
              <span className="text-[#C9973A]" aria-hidden>
                —
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 max-w-3xl rounded-lg border border-[#C9973A]/25 bg-[#FDF6E8]/60 px-6 py-8 sm:px-8">
          <h3 className="text-lg font-semibold text-black">{p.savings.title}</h3>
          <p className={`${BODY} mt-3 text-black/75`}>{p.savings.body}</p>
        </div>

        <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          {p.citations.map((c) => (
            <li key={c.href}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/60 underline underline-offset-4 hover:text-black"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10">
          <Link
            href="#spectrum"
            className="btn-primary type-button inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-black/80"
          >
            Explore the seven-node circadian model →
          </Link>
        </p>
      </div>
    </section>
  )
}
