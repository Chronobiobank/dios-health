import Link from 'next/link'
import { Fragment } from 'react'

import {
  getHomepageResearchers,
  HOMEPAGE_RESEARCHER_RELEVANCE,
} from '@/lib/researchers'

import { BODY, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <em key={i} className="italic">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}

function RelevanceLines({ lines }: { lines: readonly [string, string] }) {
  return (
    <div style={{ minHeight: `${2 * 1.375}rem` }}>
      {lines.map((line, i) => (
        <span key={i} className="block text-sm leading-[1.375rem] text-[var(--researcher-relevance)]">
          <RichText text={line} />
        </span>
      ))}
    </div>
  )
}

export function ResearchersHome() {
  return (
    <section id="researchers" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="The researchers" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-xl`}>
          The science exists.
          <br />
          The tool didn&apos;t.
        </h2>
        <p className={`${BODY} mt-4 max-w-xl`}>
          Dose timing is Oxford-validated and trial-evidenced.
          <br />
          DIOS puts it in your consultation room.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {getHomepageResearchers().map((researcher) => (
            <article
              key={researcher.id}
              className="researcher-card rounded-lg border-[0.5px] border-[var(--researcher-card-border)] bg-[var(--researcher-card-bg)] p-5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--researcher-avatar-bg)] font-mono text-xs font-medium text-[var(--researcher-avatar-text)]"
                aria-hidden
              >
                {researcher.initials}
              </div>
              <h3 className="mt-3 font-sans text-sm font-semibold text-black">{researcher.name}</h3>
              <p className="mt-1 font-mono text-[11px] text-black/45">{researcher.institution}</p>
              <div className="mt-3">
                <RelevanceLines lines={HOMEPAGE_RESEARCHER_RELEVANCE[researcher.id]} />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link href="/evidence#researchers" className="type-button text-black underline-offset-4 hover:underline">
            View all researchers →
          </Link>
        </p>
      </div>
    </section>
  )
}
