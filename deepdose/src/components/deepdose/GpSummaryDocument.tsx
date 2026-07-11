'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { LANDING_GP_HANDOFF_COPY } from '@/lib/deepdose-marketing/landing-content'
import { readGpHandoffSnapshot } from '@/lib/patient/gp-handoff-storage'
import { useIsClient } from '@/lib/react/use-is-client'

function formatGeneratedAt(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function GpSummaryDocument() {
  const ready = useIsClient()
  const snapshot = useMemo(
    () => (ready ? readGpHandoffSnapshot() : null),
    [ready]
  )

  if (!ready) return null

  if (!snapshot) {
    return (
      <article className="gp-summary gp-summary--empty">
        <h1 className="gp-summary__title">{LANDING_GP_HANDOFF_COPY.summaryTitle}</h1>
        <p className="gp-summary__lede">{LANDING_GP_HANDOFF_COPY.summaryEmpty}</p>
        <Link href="/profile" className="gp-summary__back">
          ← Back to risk check
        </Link>
      </article>
    )
  }

  return (
    <article className="gp-summary">
      <header className="gp-summary__head">
        <p className="gp-summary__eyebrow">{DEEPDOSE_NAME} · GP handoff</p>
        <h1 className="gp-summary__title">{LANDING_GP_HANDOFF_COPY.summaryTitle}</h1>
        <p className="gp-summary__meta">Generated {formatGeneratedAt(snapshot.generatedAt)}</p>
      </header>

      <section className="gp-summary__section" aria-labelledby="gp-summary-risk">
        <h2 id="gp-summary-risk" className="gp-summary__section-title">
          Sleep disorder risk (proxy)
        </h2>
        <p className="gp-summary__highlight">{snapshot.sleepDisorderHeadline}</p>
        <p className="gp-summary__body">{snapshot.sleepDisorderDetail}</p>
        <dl className="gp-summary__stats">
          <div>
            <dt>Sleep Regularity Index (SRI)</dt>
            <dd className="font-mono tabular-nums">{snapshot.sriProxy}/100</dd>
          </div>
          <div>
            <dt>Medicines listed</dt>
            <dd>{snapshot.medCount}</dd>
          </div>
          <div>
            <dt>Sleep target</dt>
            <dd className="font-mono tabular-nums">
              {snapshot.sleepOnsetLabel} → {snapshot.wakeLabel}
            </dd>
          </div>
        </dl>
      </section>

      {snapshot.medNames.length > 0 ? (
        <section className="gp-summary__section" aria-labelledby="gp-summary-meds">
          <h2 id="gp-summary-meds" className="gp-summary__section-title">
            Medicines in this check
          </h2>
          <ul className="gp-summary__med-list">
            {snapshot.medNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="gp-summary__section" aria-labelledby="gp-summary-points">
        <h2 id="gp-summary-points" className="gp-summary__section-title">
          Points for structured medication review
        </h2>
        <ol className="gp-summary__points">
          {snapshot.gpSummaryBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ol>
      </section>

      {snapshot.suggestTipTraq ? (
        <section className="gp-summary__section gp-summary__tiptraq" aria-labelledby="gp-summary-tiptraq">
          <h2 id="gp-summary-tiptraq" className="gp-summary__section-title">
            Confirm with home sleep test
          </h2>
          <p className="gp-summary__body">{LANDING_GP_HANDOFF_COPY.summaryTipTraqBody}</p>
          <Link href="/testkit" className="gp-summary__link">
            {LANDING_GP_HANDOFF_COPY.tiptraqCta}
          </Link>
        </section>
      ) : null}

      <footer className="gp-summary__footer">
        <p>{LANDING_GP_HANDOFF_COPY.disclaimer}</p>
        <div className="gp-summary__toolbar">
          <button type="button" className="gp-summary__print" onClick={() => window.print()}>
            Print or save PDF
          </button>
          <Link href="/profile" className="gp-summary__back">
            ← Back to risk check
          </Link>
        </div>
      </footer>
    </article>
  )
}
