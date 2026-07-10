'use client'

import { useMemo, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

import { buildLandingRiskAnalysis } from '@/lib/patient/landing-risk-analysis'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
import { usePatientRealPosts } from '@/lib/patient/use-patient-real-posts'
import { usePlanDraftContext } from '@/lib/patient/use-plan-draft-context'

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

export function RealPostComposer() {
  const router = useRouter()
  const { planContext, ready: draftReady } = usePlanDraftContext({
    signupHrefFromUrl: '/real',
  })
  const profile = usePatientPlanProfile(planContext.wake)
  const { today, saveToday, ready: postsReady } = usePatientRealPosts()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bodyClock = useMemo(
    () => inferLandingBodyClock(profile.wake, planContext.medTimes ?? []),
    [profile.wake, planContext.medTimes]
  )
  const riskAnalysis = useMemo(
    () =>
      buildLandingRiskAnalysis({
        medCodes: planContext.medCodes,
        medTimes: planContext.medTimes ?? [],
        wake: profile.wake,
      }),
    [planContext.medCodes, planContext.medTimes, profile.wake]
  )

  const preview = photoUrl ?? today?.photoUrl ?? null

  async function handlePick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 800_000) {
      setError('Choose a smaller photo')
      event.target.value = ''
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setPhotoUrl(dataUrl)
      setError(null)
    } catch {
      setError('Could not read photo')
    }
    event.target.value = ''
  }

  function handlePost() {
    if (!preview) {
      setError('Add a photo')
      return
    }
    setBusy(true)
    saveToday({
      photoUrl: preview,
      sri: riskAnalysis.sriProxy,
      sleepOff: bodyClock.sleepOnsetLabel,
      sleepOn: bodyClock.wakeLabel,
      displayName: profile.fullName || 'You',
    })
    router.push('/real')
  }

  if (!draftReady || !postsReady || !profile.ready) return null

  return (
    <div className="dd-real-post">
      <label
        className="dd-real-post__stage"
        htmlFor="dd-real-photo-input"
        aria-label={preview ? 'Change photo' : 'Add photo'}
      >
        <input
          id="dd-real-photo-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="dd-real-post__input"
          onChange={handlePick}
        />
        {preview ? (
          // Local data-URL preview
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="dd-real-post__preview" />
        ) : (
          <span className="dd-real-post__placeholder" aria-hidden>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        )}
        <span className="dd-real-post__hover" aria-hidden>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path
              d="M4.5 8.5h2.2l1.1-2h8.4l1.1 2H19.5A1.5 1.5 0 0 1 21 10v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V10a1.5 1.5 0 0 1 1.5-1.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="14" r="3.25" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </label>

      <div className="dd-real-post__metrics" role="group" aria-label="Today’s sleep">
        <div className="dd-real-post__metric">
          <p className="dd-real-post__metric-value tabular-nums">{riskAnalysis.sriProxy}</p>
          <p className="dd-real-post__metric-label">Sleep score</p>
        </div>
        <div className="dd-real-post__metric">
          <p className="dd-real-post__metric-value tabular-nums">{bodyClock.sleepOnsetLabel}</p>
          <p className="dd-real-post__metric-label">Off</p>
        </div>
        <div className="dd-real-post__metric">
          <p className="dd-real-post__metric-value tabular-nums">{bodyClock.wakeLabel}</p>
          <p className="dd-real-post__metric-label">On</p>
        </div>
      </div>

      {error ? <p className="dd-real-post__error">{error}</p> : null}

      <button
        type="button"
        className="dd-real-post__submit"
        onClick={handlePost}
        disabled={busy || !preview}
      >
        {today ? 'Update Real' : 'Post Real'}
      </button>
    </div>
  )
}
