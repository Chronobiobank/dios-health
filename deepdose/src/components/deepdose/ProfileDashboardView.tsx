'use client'

import { useMemo, type ChangeEvent, type CSSProperties } from 'react'
import Link from 'next/link'

import SriScoreRing from '@/components/shared/SriScoreRing'
import SriMonthLineChart from '@/components/shared/SriMonthLineChart'
import { PhenotypeIcon } from '@/components/deepdose/PhenotypeIcon'
import {
  DEEPDOSE_PATIENT_PLAN_PROFILE,
} from '@/lib/deepdose-marketing/landing-content'
import { HOMEKIT_RISK_TILE } from '@/lib/deepdose-marketing/homekit-risk-content'
import { DOSE_ARCHIVE } from '@/lib/deepdose-marketing/dose-share-content'
import { buildDemoSelfDoses } from '@/lib/deepdose-marketing/grid-feed-mocks'
import { phenotypeFromWakeLabel, tribeLocalHash } from '@/lib/brand/chemical-phenotypes'
import { SLEEP_SCORE } from '@/lib/brand/sleep-score'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { PATIENT_LANDING_DEMO } from '@/lib/patient/patient-landing-defaults'
import { usePatientDoses } from '@/lib/patient/use-patient-doses'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
import { usePlanDraftContext } from '@/lib/patient/use-plan-draft-context'

function ProfileAvatarGraphic() {
  return (
    <svg
      className="dd-profile__avatar-graphic"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="32" cy="32" r="32" fill="rgb(15 23 42 / 0.06)" />
      <circle cx="32" cy="24" r="11" fill="rgb(15 23 42 / 0.18)" />
      <path
        d="M12 56c2.8-12.5 12-19 20-19s17.2 6.5 20 19"
        fill="rgb(15 23 42 / 0.14)"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        d="M15.5 3.5a7.5 7.5 0 1 0 5 12.8A8.5 8.5 0 1 1 15.5 3.5z"
        fill="currentColor"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Could not read image'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image'))
    reader.readAsDataURL(file)
  })
}

/** Unified Profile — identity hero + SRI + tiled sections. */
export function ProfileDashboardView({
  urlPlanContext,
  signupHrefFromUrl = '/profile',
}: {
  urlPlanContext?: Parameters<typeof usePlanDraftContext>[0]['urlPlanContext']
  signupHrefFromUrl?: string
} = {}) {
  const { planContext, ready: draftReady } = usePlanDraftContext({
    urlPlanContext,
    signupHrefFromUrl,
  })
  const profile = usePatientPlanProfile(planContext.wake)
  const { bankOptIn, setBankOptIn, todaySelf, doses, ready } = usePatientDoses()
  const fields = DEEPDOSE_PATIENT_PLAN_PROFILE

  const bodyClock = useMemo(
    () => inferLandingBodyClock(profile.wake, planContext.medTimes ?? []),
    [profile.wake, planContext.medTimes]
  )
  /** Phone-screen seed until real nights land — mid band so Homekit risk tile shows. */
  const sriScore = PATIENT_LANDING_DEMO.sri

  const thanks = bankOptIn ? 12 + todaySelf.length * 3 : 0
  const displayName =
    [profile.firstName, profile.familyName].filter(Boolean).join(' ').trim() || 'You'
  const doseGrid = useMemo(() => {
    const own = doses.filter((d) => d.isSelf !== false)
    if (own.length > 0) return { items: own.slice(0, 9), isSample: false as const }
    return {
      items: buildDemoSelfDoses(displayName, sriScore),
      isSample: true as const,
    }
  }, [doses, displayName, sriScore])
  const myPhenotype = useMemo(
    () => phenotypeFromWakeLabel(bodyClock.wakeLabel),
    [bodyClock.wakeLabel]
  )
  const tribeHash = useMemo(
    () => tribeLocalHash(profile.location, myPhenotype),
    [profile.location, myPhenotype]
  )

  async function handleAvatarPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 400_000) {
      event.target.value = ''
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      profile.setAvatarUrl(dataUrl)
    } catch {
      /* ignore */
    }
    event.target.value = ''
  }

  if (!draftReady || !ready || !profile.ready) return null

  return (
    <div className="dd-profile-dash">
      {/* Identity — who you are */}
      <section
        className="dd-profile-dash__hero seco-spectrum-tile seco-spectrum-tile--hero"
        style={{ '--cue': '#acd3de' } as CSSProperties}
        aria-label="Identity"
      >
        <div className="dd-profile-dash__hero-top">
          <label
            className="dd-profile-dash__face"
            htmlFor="dd-profile-avatar-input"
            aria-label={
              profile.avatarUrl ? fields.avatarEditLabel : fields.avatarEmptyLabel
            }
          >
            <input
              id="dd-profile-avatar-input"
              type="file"
              accept="image/*"
              className="dd-profile__face-input"
              onChange={handleAvatarPick}
            />
            {profile.avatarUrl ? (
              // Local data-URL preview
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" className="dd-profile-dash__face-img" />
            ) : (
              <ProfileAvatarGraphic />
            )}
          </label>

          <div className="dd-profile-dash__identity">
            <p className="dd-profile-dash__name">{displayName}</p>
            <div className="dd-profile-dash__name-edit">
              <input
                type="text"
                className="dd-profile-dash__input"
                value={profile.firstName}
                onChange={(e) => profile.setFirstName(e.target.value)}
                placeholder={fields.firstNamePlaceholder}
                aria-label={fields.firstNamePlaceholder}
                autoComplete="given-name"
              />
              <input
                type="text"
                className="dd-profile-dash__input"
                value={profile.familyName}
                onChange={(e) => profile.setFamilyName(e.target.value)}
                placeholder={fields.familyNamePlaceholder}
                aria-label={fields.familyNamePlaceholder}
                autoComplete="family-name"
              />
            </div>
            <input
              type="text"
              className="dd-profile-dash__input dd-profile-dash__input--muted"
              value={profile.location}
              onChange={(e) => profile.setLocation(e.target.value)}
              placeholder={fields.locationPlaceholder}
              aria-label={fields.locationPlaceholder}
              autoComplete="address-level2"
            />
          </div>
        </div>
      </section>

      {/* Doses first — presence grid leads; score drills down below */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': '#f2b8a2' } as CSSProperties}
        aria-label={DOSE_ARCHIVE.title}
      >
        <div className="dd-profile-dash__tile-head">
          <h2 className="dd-profile-dash__h">{DOSE_ARCHIVE.title}</h2>
          <Link href={DOSE_ARCHIVE.ctaHref} className="dd-profile-dash__cta">
            {DOSE_ARCHIVE.cta}
          </Link>
        </div>
        <div className="dd-profile-dash__dose-grid" role="list">
          {doseGrid.items.map((dose) => (
            <Link
              key={dose.id}
              href={doseGrid.isSample ? DOSE_ARCHIVE.ctaHref : DOSE_ARCHIVE.feedHref}
              className="dd-profile-dash__dose-cell"
              role="listitem"
              aria-label={
                doseGrid.isSample
                  ? DOSE_ARCHIVE.emptyCta
                  : `Dose from ${dose.date}`
              }
            >
              {/* Local data-URL or seeded Unsplash preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dose.mediaUrl} alt="" />
              {dose.isPremium ? (
                <span className="dd-profile-dash__dose-premium">Adult</span>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {/* My tribe — phenotype identity under doses */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': myPhenotype.cue } as CSSProperties}
        aria-label="My tribe"
      >
        <div className="dd-profile-dash__tile-head">
          <h2 className="dd-profile-dash__h">My tribe</h2>
          <Link href={`/grid?clock=${myPhenotype.id}`} className="dd-profile-dash__cta">
            Tribe feed
          </Link>
        </div>
        <div className="dd-profile-dash__pheno">
          <PhenotypeIcon id={myPhenotype.id} size="lg" />
          <div className="dd-profile-dash__pheno-copy">
            <p className="dd-profile-dash__pheno-name">{tribeHash}</p>
            <p className="dd-profile-dash__pheno-peak">Peak · {myPhenotype.peak}</p>
            <p className="dd-profile-dash__pheno-body">{myPhenotype.expression}</p>
          </div>
        </div>
      </section>

      {/* Score — phenotype dial, risk, sleep / wake */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile seco-spectrum-tile--hero"
        style={{ '--cue': '#acd3de' } as CSSProperties}
        aria-label="Phenotype score"
      >
        <div className="dd-profile-dash__score">
          <SriScoreRing score={sriScore} />
          {sriScore < 75 ? (
            <Link
              href={HOMEKIT_RISK_TILE.href}
              className="seco-spectrum-tile seco-spectrum-tile--hero dd-profile-dash__alert"
              style={{ '--cue': '#f2b8a2' } as CSSProperties}
            >
              <p className="seco-spectrum-tile__title">{HOMEKIT_RISK_TILE.title}</p>
              <p className="seco-spectrum-tile__body">{HOMEKIT_RISK_TILE.body}</p>
              <span className="dd-profile-dash__alert-pill">{HOMEKIT_RISK_TILE.cta}</span>
            </Link>
          ) : null}
        </div>

        <div className="dd-profile-dash__window" aria-label="Sleep and wake">
          <article
            className="seco-spectrum-tile seco-spectrum-tile--compact"
            style={{ '--cue': '#8b9cf8' } as CSSProperties}
          >
            <p className="seco-spectrum-tile__title tabular-nums">
              {bodyClock.sleepOnsetLabel}
            </p>
            <div className="dd-profile-dash__window-label">
              <span className="dd-profile-dash__window-icon" aria-hidden>
                <MoonIcon />
              </span>
              <p className="seco-spectrum-tile__body">Sleep</p>
            </div>
          </article>
          <article
            className="seco-spectrum-tile seco-spectrum-tile--compact"
            style={{ '--cue': '#98d6c6' } as CSSProperties}
          >
            <p className="seco-spectrum-tile__title tabular-nums">
              {bodyClock.wakeLabel}
            </p>
            <div className="dd-profile-dash__window-label">
              <span className="dd-profile-dash__window-icon" aria-hidden>
                <SunIcon />
              </span>
              <p className="seco-spectrum-tile__body">Wake</p>
            </div>
          </article>
        </div>
      </section>

      {/* Today — last month SRI */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': '#c9b6f2' } as CSSProperties}
        aria-label="Last month Sleep Regularity Index"
      >
        <div className="dd-profile-dash__tile-head">
          <h2 className="dd-profile-dash__h">Today</h2>
          <span className="dd-profile-dash__meta tabular-nums">{sriScore}</span>
        </div>
        <SriMonthLineChart score={sriScore} />
      </section>

      {/* Tools */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': '#98d6c6' } as CSSProperties}
        aria-label="Your tools"
      >
        <h2 className="dd-profile-dash__h">Tools</h2>
        <div className="dd-profile-dash__tools">
          <Link href="/homekit" className="dd-profile-dash__tool">
            <span className="dd-profile-dash__tool-title">Homekit</span>
            <span className="dd-profile-dash__tool-meta">{SLEEP_SCORE.tiptraqHint}</span>
          </Link>
          <Link href="/dosage" className="dd-profile-dash__tool">
            <span className="dd-profile-dash__tool-title">Chemistry</span>
            <span className="dd-profile-dash__tool-meta">Timing for what you take</span>
          </Link>
          <Link href="/connect" className="dd-profile-dash__tool">
            <span className="dd-profile-dash__tool-title">Sync</span>
            <span className="dd-profile-dash__tool-meta">People on your phenotype</span>
          </Link>
          <Link href="/account" className="dd-profile-dash__tool">
            <span className="dd-profile-dash__tool-title">Account</span>
            <span className="dd-profile-dash__tool-meta">Settings and sign out</span>
          </Link>
        </div>
      </section>

      {/* Research */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': '#8b9cf8' } as CSSProperties}
      >
        <div className="dd-profile-dash__research">
          <div>
            <h2 className="dd-profile-dash__h">Help research</h2>
            <p className="dd-profile-dash__research-copy">
              Share anonymous sleep data. Turn off anytime.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={bankOptIn}
            className={
              bankOptIn
                ? 'dd-profile-dash__toggle dd-profile-dash__toggle--on'
                : 'dd-profile-dash__toggle'
            }
            onClick={() => setBankOptIn(!bankOptIn)}
          >
            {bankOptIn ? 'On' : 'Off'}
          </button>
        </div>
        {bankOptIn ? (
          <p className="dd-profile-dash__shared tabular-nums">Shared · {thanks}</p>
        ) : null}
      </section>
    </div>
  )
}

/** @deprecated Use ProfileDashboardView */
export function BankDashboardView() {
  return <ProfileDashboardView />
}
