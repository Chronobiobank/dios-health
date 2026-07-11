'use client'

import { useMemo, type ChangeEvent } from 'react'
import Link from 'next/link'

import {
  DEEPDOSE_PATIENT_PLAN_PROFILE,
  PATIENT_SLEEP_WAKE_DASH,
} from '@/lib/deepdose-marketing/landing-content'
import { buildLandingRiskAnalysis } from '@/lib/patient/landing-risk-analysis'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
import DiseaseRiskContinuum from '@/components/shared/DiseaseRiskContinuum'
import SriHistorySpark from '@/components/shared/SriHistorySpark'
import SriScoreRing from '@/components/shared/SriScoreRing'
import { SleepScoreTipTraqLink } from '@/components/deepdose/SleepScoreTipTraqLink'
import { SleepScoreTipTraqLink } from '@/components/deepdose/SleepScoreTipTraqLink'

type PatientSleepWakeDashboardProps = {
  medCodes: string[]
  medTimes?: string[]
  wake: string | null
  signupHref: string
}

function ProfileAvatarGraphic() {
  return (
    <svg
      className="sw-dash__avatar-graphic"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="32" cy="32" r="32" fill="rgb(255 255 255 / 0.06)" />
      <circle cx="32" cy="24" r="11" fill="rgb(255 255 255 / 0.28)" />
      <path
        d="M12 56c2.8-12.5 12-19 20-19s17.2 6.5 20 19"
        fill="rgb(255 255 255 / 0.22)"
      />
      <path
        d="M12 56c2.8-12.5 12-19 20-19s17.2 6.5 20 19"
        stroke="rgb(255 255 255 / 0.12)"
        strokeWidth="1"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="sw-dash__anchor-glyph" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        d="M15.5 3.5a7.5 7.5 0 1 0 5 12.8A8.5 8.5 0 1 1 15.5 3.5z"
        fill="currentColor"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="sw-dash__anchor-glyph" viewBox="0 0 24 24" aria-hidden focusable="false">
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

export function PatientSleepWakeDashboard({
  medCodes,
  medTimes = [],
  wake,
  signupHref,
}: PatientSleepWakeDashboardProps) {
  const profile = usePatientPlanProfile(wake)
  const bodyClock = useMemo(
    () => inferLandingBodyClock(profile.wake, medTimes),
    [profile.wake, medTimes]
  )
  const riskAnalysis = useMemo(
    () => buildLandingRiskAnalysis({ medCodes, medTimes, wake: profile.wake }),
    [medCodes, medTimes, profile.wake]
  )
  const regularityScore = riskAnalysis.sriProxy
  const copy = PATIENT_SLEEP_WAKE_DASH
  const profileCopy = DEEPDOSE_PATIENT_PLAN_PROFILE

  async function handleAvatarPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    // Keep under localStorage-friendly size (~400KB)
    if (file.size > 400_000) {
      event.target.value = ''
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      profile.setAvatarUrl(dataUrl)
    } catch {
      /* ignore unreadable files */
    }
    event.target.value = ''
  }

  return (
    <div className="sw-dash">
      <div className="sw-dash__tiles">
        <article className="dios-glass-outer sw-dash__tile sw-dash__tile--summary" aria-labelledby="sw-tile-diagnostic">
          <div className="sw-dash__profile-top">
            <div className="sw-dash__profile-id">
              <div className="sw-dash__name-fields">
                <input
                  type="text"
                  className="sw-dash__name-input"
                  value={profile.firstName}
                  onChange={(e) => profile.setFirstName(e.target.value)}
                  placeholder={profileCopy.firstNamePlaceholder}
                  aria-label={profileCopy.firstNamePlaceholder}
                  autoComplete="given-name"
                />
                <input
                  type="text"
                  className="sw-dash__name-input"
                  value={profile.familyName}
                  onChange={(e) => profile.setFamilyName(e.target.value)}
                  placeholder={profileCopy.familyNamePlaceholder}
                  aria-label={profileCopy.familyNamePlaceholder}
                  autoComplete="family-name"
                />
              </div>
              <input
                type="text"
                className="sw-dash__location-input"
                value={profile.location}
                onChange={(e) => profile.setLocation(e.target.value)}
                placeholder={profileCopy.locationPlaceholder}
                aria-label={profileCopy.locationPlaceholder}
                autoComplete="address-level2"
              />
            </div>

            <label className="dios-glass-inner sw-dash__avatar" htmlFor="sw-dash-avatar-input">
              <input
                id="sw-dash-avatar-input"
                type="file"
                accept="image/*"
                className="sw-dash__avatar-input"
                onChange={handleAvatarPick}
              />
              {profile.avatarUrl ? (
                // Local data-URL preview from the user's device
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" className="sw-dash__avatar-img" />
              ) : (
                <ProfileAvatarGraphic />
              )}
              <span
                className={
                  profile.avatarUrl
                    ? 'sw-dash__avatar-edit'
                    : 'sw-dash__avatar-edit sw-dash__avatar-edit--empty'
                }
              >
                {profile.avatarUrl ? (
                  profileCopy.avatarEditLabel
                ) : (
                  <>
                    <span>Add</span>
                    <span>photo</span>
                  </>
                )}
              </span>
            </label>
          </div>

        </article>

        <div className="sw-dash__anchors" role="group" aria-label="Lights off and lights on times">
          <article className="dios-glass-outer sw-dash__tile sw-dash__tile--anchor sw-dash__anchor sw-dash__anchor--sleep">
            <span className="sw-dash__anchor-icon" aria-hidden>
              <MoonIcon />
            </span>
            <div className="sw-dash__anchor-copy">
              <p className="sw-dash__anchor-time tabular-nums">{bodyClock.sleepOnsetLabel}</p>
              <p className="sw-dash__anchor-label">{copy.sleepLabel}</p>
            </div>
          </article>
          <article className="dios-glass-outer sw-dash__tile sw-dash__tile--anchor sw-dash__anchor sw-dash__anchor--wake">
            <span className="sw-dash__anchor-icon" aria-hidden>
              <SunIcon />
            </span>
            <div className="sw-dash__anchor-copy">
              <p className="sw-dash__anchor-time tabular-nums">{bodyClock.wakeLabel}</p>
              <p className="sw-dash__anchor-label">{copy.wakeLabel}</p>
            </div>
          </article>
        </div>

        <article
          className="dios-glass-outer sw-dash__tile sw-dash__tile--diagnostic"
          aria-labelledby="sw-tile-diagnostic"
        >
          <p id="sw-tile-diagnostic" className="seco-page__eyebrow sw-dash__tile-eyebrow">
            {copy.diagnosticEyebrow}
          </p>
          <p className="sw-dash__diagnostic-body">
            {copy.subtitleBefore}
            <span className="sw-dash__diagnostic-highlight">{copy.subtitleHighlight}</span>
            {copy.subtitleAfter}
          </p>
        </article>

        <article className="dios-glass-outer sw-dash__tile sw-dash__tile--score" aria-labelledby="sw-tile-score">
          <p id="sw-tile-score" className="seco-page__eyebrow sw-dash__tile-eyebrow">
            {copy.scoreTile}
          </p>
          <SriScoreRing score={regularityScore} />
          <SleepScoreTipTraqLink className="sw-dash__tiptraq" />
          <Link href={signupHref} className="sw-dash__text-link sw-dash__text-link--score">
            {copy.cta}
          </Link>
        </article>

        <article className="dios-glass-outer sw-dash__tile sw-dash__tile--history" aria-labelledby="sw-tile-history">
          <p id="sw-tile-history" className="seco-page__eyebrow sw-dash__tile-eyebrow">
            {copy.historyTile}
          </p>
          <SriHistorySpark score={regularityScore} />
        </article>

        <article className="dios-glass-outer sw-dash__tile sw-dash__tile--risk" aria-labelledby="sw-tile-risk">
          <p id="sw-tile-risk" className="seco-page__eyebrow sw-dash__tile-eyebrow">
            {copy.riskTile}
          </p>
          <DiseaseRiskContinuum score={regularityScore} showScore={false} />
          <p className="sw-dash__tile-note">{copy.riskHint}</p>
        </article>

        <div className="sw-dash__tile-cta">
          <Link href="/dosage" className="seco-landing__btn seco-landing__btn--primary sw-dash__cta-btn">
            {copy.dosageCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
