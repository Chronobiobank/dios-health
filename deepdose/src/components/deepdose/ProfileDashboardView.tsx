'use client'

import { useMemo, type ChangeEvent, type CSSProperties } from 'react'
import Link from 'next/link'

import SriScoreRing from '@/components/shared/SriScoreRing'
import { SleepScoreTipTraqLink } from '@/components/deepdose/SleepScoreTipTraqLink'
import {
  DEEPDOSE_PATIENT_PLAN_PROFILE,
} from '@/lib/deepdose-marketing/landing-content'
import { SLEEP_SCORE } from '@/lib/brand/sleep-score'
import { computeScheduleSri } from '@/lib/circadian/sri-engine'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { DOSE_TAG_META, DOSE_TAGS } from '@/lib/patient/dose-uploads'
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
  const { pillars, bankOptIn, setBankOptIn, todaySelf, doses, ready } = usePatientDoses()
  const fields = DEEPDOSE_PATIENT_PLAN_PROFILE

  const bodyClock = useMemo(
    () => inferLandingBodyClock(profile.wake, planContext.medTimes ?? []),
    [profile.wake, planContext.medTimes]
  )
  const sriResult = useMemo(
    () => computeScheduleSri(bodyClock.sleepOnsetLabel, bodyClock.wakeLabel),
    [bodyClock.sleepOnsetLabel, bodyClock.wakeLabel]
  )

  const selfDoses = doses.filter((d) => d.isSelf !== false)
  const thanks = bankOptIn ? 12 + todaySelf.length * 3 : 0
  const displayName =
    [profile.firstName, profile.familyName].filter(Boolean).join(' ').trim() || 'You'

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
      {/* Hero — who you are + score */}
      <section
        className="dd-profile-dash__hero seco-spectrum-tile seco-spectrum-tile--hero"
        style={{ '--cue': '#acd3de' } as CSSProperties}
        aria-label="Identity and score"
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

        <div className="dd-profile-dash__score">
          <SriScoreRing score={sriResult.score} />
          <div className="dd-profile-dash__score-copy">
            <p className="dd-profile-dash__score-label">{SLEEP_SCORE.label}</p>
            <p className="dd-profile-dash__score-hint">{SLEEP_SCORE.hint}</p>
            <div className="dd-profile-dash__clock" aria-label="Sleep window">
              <span>
                <strong className="tabular-nums">{bodyClock.sleepOnsetLabel}</strong>
                <span> Off</span>
              </span>
              <span aria-hidden>·</span>
              <span>
                <strong className="tabular-nums">{bodyClock.wakeLabel}</strong>
                <span> On</span>
              </span>
            </div>
            <SleepScoreTipTraqLink className="dd-profile-dash__homekit" />
          </div>
        </div>
      </section>

      {/* Today — phenotype posts */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': '#c9b6f2' } as CSSProperties}
        aria-label="Today’s phenotype posts"
      >
        <div className="dd-profile-dash__tile-head">
          <h2 className="dd-profile-dash__h">Today</h2>
          <Link href="/dose" className="dd-profile-dash__cta">
            Post dose
          </Link>
        </div>
        <div className="dd-profile-dash__slots">
          {DOSE_TAGS.map((tag) => {
            const meta = DOSE_TAG_META[tag]
            const done = pillars?.[tag]
            return (
              <div
                key={tag}
                className={
                  done
                    ? 'dd-profile-dash__slot dd-profile-dash__slot--on'
                    : 'dd-profile-dash__slot'
                }
              >
                <span className="dd-profile-dash__slot-hash">{meta.hash}</span>
                <span className="dd-profile-dash__slot-state">{done ? 'Done' : 'Open'}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Doses archive */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': '#f2b8a2' } as CSSProperties}
        aria-label="Dose archive"
      >
        <div className="dd-profile-dash__tile-head">
          <h2 className="dd-profile-dash__h">Doses</h2>
          <Link href="/grid" className="dd-profile-dash__cta">
            Feed
          </Link>
        </div>
        {selfDoses.length === 0 ? (
          <p className="dd-profile-dash__empty">
            <Link href="/dose">Log today’s dose</Link>
          </p>
        ) : (
          <div className="dd-profile-dash__dose-grid">
            {selfDoses.slice(0, 9).map((dose) => (
              <Link
                key={dose.id}
                href="/grid"
                className="dd-profile-dash__dose-cell"
                aria-label={`Dose ${dose.date}`}
              >
                {/* Local data-URL preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dose.mediaUrl} alt="" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Tools */}
      <section
        className="dd-profile-dash__tile seco-spectrum-tile"
        style={{ '--cue': '#98d6c6' } as CSSProperties}
        aria-label="Your tools"
      >
        <h2 className="dd-profile-dash__h">Tools</h2>
        <div className="dd-profile-dash__tools">
          <Link href="/testkit" className="dd-profile-dash__tool">
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
