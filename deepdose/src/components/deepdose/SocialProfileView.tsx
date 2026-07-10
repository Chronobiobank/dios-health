'use client'

import { useMemo, type ChangeEvent, type CSSProperties } from 'react'
import Link from 'next/link'

import {
  DEEPDOSE_PATIENT_PLAN_PROFILE,
  SOCIAL_PROFILE,
} from '@/lib/deepdose-marketing/landing-content'
import { buildLandingRiskAnalysis } from '@/lib/patient/landing-risk-analysis'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
import { usePatientRealPosts } from '@/lib/patient/use-patient-real-posts'
import {
  IconMatches,
  IconShare,
  ProductIconAction,
} from '@/components/deepdose/ProductIconAction'

type SocialProfileViewProps = {
  medCodes: string[]
  medTimes?: string[]
  wake: string | null
}

function ProfileAvatarGraphic() {
  return (
    <svg
      className="dd-profile__avatar-graphic"
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

export function SocialProfileView({
  medCodes,
  medTimes = [],
  wake,
}: SocialProfileViewProps) {
  const profile = usePatientPlanProfile(wake)
  const { posts, ready: realsReady } = usePatientRealPosts()
  const bodyClock = useMemo(
    () => inferLandingBodyClock(profile.wake, medTimes),
    [profile.wake, medTimes]
  )
  const riskAnalysis = useMemo(
    () => buildLandingRiskAnalysis({ medCodes, medTimes, wake: profile.wake }),
    [medCodes, medTimes, profile.wake]
  )
  const sri = riskAnalysis.sriProxy
  const copy = SOCIAL_PROFILE
  const fields = DEEPDOSE_PATIENT_PLAN_PROFILE

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

  return (
    <div className="dd-profile__stack">
      <div
        className="dd-profile__identity seco-spectrum-tile seco-spectrum-tile--hero"
        style={{ '--cue': '#acd3de' } as CSSProperties}
      >
        <div className="dd-profile__header">
          <label
            className="dd-profile__face"
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
              <img src={profile.avatarUrl} alt="" className="dd-profile__face-img" />
            ) : (
              <ProfileAvatarGraphic />
            )}
            <span className="dd-profile__face-hover" aria-hidden>
              <svg
                className="dd-profile__face-icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
              >
                <path
                  d="M4.5 8.5h2.2l1.1-2h8.4l1.1 2H19.5A1.5 1.5 0 0 1 21 10v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V10a1.5 1.5 0 0 1 1.5-1.5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="14"
                  r="3.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </label>

          <div className="dd-profile__stats" role="group" aria-label="Profile metrics">
            <div className="dd-profile__stat">
              <p className="dd-profile__stat-value tabular-nums">{sri}</p>
              <p className="dd-profile__stat-label">SRI</p>
            </div>
            <div className="dd-profile__stat">
              <p className="dd-profile__stat-value tabular-nums">
                {bodyClock.sleepOnsetLabel}
              </p>
              <p className="dd-profile__stat-label">Off</p>
            </div>
            <div className="dd-profile__stat">
              <p className="dd-profile__stat-value tabular-nums">
                {bodyClock.wakeLabel}
              </p>
              <p className="dd-profile__stat-label">On</p>
            </div>
          </div>
        </div>

        <div className="dd-profile__copy">
          <div className="dd-profile__name-row">
            <input
              type="text"
              className="dd-profile__name-input"
              value={profile.firstName}
              onChange={(e) => profile.setFirstName(e.target.value)}
              placeholder={fields.firstNamePlaceholder}
              aria-label={fields.firstNamePlaceholder}
              autoComplete="given-name"
              size={Math.max(profile.firstName.length, 5)}
            />
            <input
              type="text"
              className="dd-profile__name-input"
              value={profile.familyName}
              onChange={(e) => profile.setFamilyName(e.target.value)}
              placeholder={fields.familyNamePlaceholder}
              aria-label={fields.familyNamePlaceholder}
              autoComplete="family-name"
              size={Math.max(profile.familyName.length, 5)}
            />
          </div>
          <input
            type="text"
            className="dd-profile__location-input"
            value={profile.location}
            onChange={(e) => profile.setLocation(e.target.value)}
            placeholder={fields.locationPlaceholder}
            aria-label={fields.locationPlaceholder}
            autoComplete="address-level2"
          />
          <textarea
            className="dd-profile__journey-input"
            value={profile.journey}
            onChange={(e) => profile.setJourney(e.target.value)}
            placeholder={fields.journeyPlaceholder}
            aria-label={fields.journeyPlaceholder}
            rows={2}
          />
        </div>

        <nav className="dd-icon-actions" aria-label="Profile actions">
          <ProductIconAction href="/real/post" label={copy.share}>
            <IconShare />
          </ProductIconAction>
          <ProductIconAction href="/connect" label={copy.matches}>
            <IconMatches />
          </ProductIconAction>
        </nav>
      </div>

      <section className="dd-profile__reals" aria-label="Your Reals">
        <h2 className="dd-profile__reals-title">Your Reals</h2>
        {realsReady && posts.length === 0 ? (
          <p className="dd-profile__reals-empty">
            <Link href="/real/post">Post today’s Real</Link>
          </p>
        ) : (
          <div className="dd-profile__reals-grid">
            {posts.map((post) => (
              <Link
                key={post.id}
                href="/real"
                className="dd-profile__reals-cell"
                aria-label={`Real ${post.date}`}
              >
                {/* Local data-URL preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.photoUrl} alt="" className="dd-profile__reals-img" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <Link href="/dosage" className="dd-profile__chem-link">
        Chemistry
      </Link>
    </div>
  )
}
