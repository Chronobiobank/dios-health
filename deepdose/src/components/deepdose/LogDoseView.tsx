'use client'

import { useMemo, useRef, useState, useEffect, type ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { SleepScoreTipTraqLink } from '@/components/deepdose/SleepScoreTipTraqLink'
import { phenotypeFromWakeLabel } from '@/lib/brand/chemical-phenotypes'
import { DOSE_SHARE } from '@/lib/deepdose-marketing/dose-share-content'
import { computeScheduleSri } from '@/lib/circadian/sri-engine'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import {
  DOSE_TAG_META,
  DOSE_TAGS,
  todayDoseDate,
  type DoseTag,
} from '@/lib/patient/dose-uploads'
import { usePatientDoses } from '@/lib/patient/use-patient-doses'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
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

function parseDoseTag(value: string | null): DoseTag | null {
  if (!value) return null
  return (DOSE_TAGS as readonly string[]).includes(value) ? (value as DoseTag) : null
}

export function LogDoseView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { planContext, ready: draftReady } = usePlanDraftContext({
    signupHrefFromUrl: '/grid',
  })
  const profile = usePatientPlanProfile(planContext.wake)
  const { saveDose, hasTagToday, ready: dosesReady } = usePatientDoses()
  const [pendingTag, setPendingTag] = useState<DoseTag | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [handledQueryTag, setHandledQueryTag] = useState<DoseTag | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const bodyClock = useMemo(
    () => inferLandingBodyClock(profile.wake, planContext.medTimes ?? []),
    [profile.wake, planContext.medTimes]
  )
  const sri = useMemo(
    () => computeScheduleSri(bodyClock.sleepOnsetLabel, bodyClock.wakeLabel).score,
    [bodyClock.sleepOnsetLabel, bodyClock.wakeLabel]
  )
  const myPhenotype = useMemo(
    () => phenotypeFromWakeLabel(bodyClock.wakeLabel),
    [bodyClock.wakeLabel]
  )

  const queryTag = parseDoseTag(searchParams.get('tag'))
  if (queryTag && dosesReady && profile.ready && handledQueryTag !== queryTag) {
    setHandledQueryTag(queryTag)
    setPendingTag(queryTag)
    setError(null)
  }

  // Deep-link ?tag= → open camera once tag is pending
  useEffect(() => {
    if (!handledQueryTag || pendingTag !== handledQueryTag) return
    const id = requestAnimationFrame(() => inputRef.current?.click())
    return () => cancelAnimationFrame(id)
  }, [handledQueryTag, pendingTag])

  function openCamera(tag: DoseTag) {
    setPendingTag(tag)
    setError(null)
    requestAnimationFrame(() => inputRef.current?.click())
  }

  async function handlePick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    const tag = pendingTag
    event.target.value = ''
    if (!file || !tag) return
    if (file.size > 900_000) {
      setError('Choose a smaller photo')
      return
    }
    try {
      const mediaUrl = await readFileAsDataUrl(file)
      saveDose({
        tag,
        mediaUrl,
        date: todayDoseDate(),
        timestamp: new Date().toISOString(),
        displayName: profile.fullName || 'You',
        sri,
        isPremium: false,
        unlockPrice: 0,
        exifLuxValue: null,
        deviceHeartRate: null,
      })
      router.push(`/grid?clock=${tag}`)
    } catch {
      setError('Could not read photo')
    }
  }

  if (!draftReady || !dosesReady || !profile.ready) return null

  const orderedTags = [
    myPhenotype.id,
    ...DOSE_TAGS.filter((tag) => tag !== myPhenotype.id),
  ]

  return (
    <div className="dd-log">
      <div className="dd-log__intro">
        <p className="dd-log__hint">{DOSE_SHARE.hint}</p>
        <p className="dd-log__support">{DOSE_SHARE.support}</p>
      </div>

      <div className="dd-log__buttons">
        {orderedTags.map((tag) => {
          const meta = DOSE_TAG_META[tag]
          const done = hasTagToday(tag)
          const isMine = tag === myPhenotype.id
          return (
            <div key={tag} className="dd-log__btn-wrap">
              <button
                type="button"
                className={isMine ? 'dd-log__btn dd-log__btn--primary' : 'dd-log__btn'}
                onClick={() => openCamera(tag)}
              >
                <span className="dd-log__btn-main">
                  <span className="dd-log__btn-hash">{meta.hash}</span>
                  <span className="dd-log__btn-sub">
                    {isMine ? DOSE_SHARE.yourTribe : DOSE_SHARE.otherTribe}
                  </span>
                </span>
                {done ? (
                  <span className="dd-log__btn-done">{DOSE_SHARE.posted}</span>
                ) : null}
              </button>
            </div>
          )
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="dd-log__file"
        onChange={handlePick}
        aria-hidden
        tabIndex={-1}
      />

      {error ? <p className="dd-log__error">{error}</p> : null}

      <p className="dd-log__stamp tabular-nums">
        Score {sri} · Off {bodyClock.sleepOnsetLabel} · On {bodyClock.wakeLabel}
      </p>
      <SleepScoreTipTraqLink compact className="dd-log__tiptraq" />

      <aside className="dd-log__premium" aria-label={DOSE_SHARE.premium.label}>
        <div className="dd-log__premium-copy">
          <p className="dd-log__premium-label">{DOSE_SHARE.premium.label}</p>
          <p className="dd-log__premium-body">{DOSE_SHARE.premium.body}</p>
        </div>
        <Link href={DOSE_SHARE.premium.href} className="dd-log__premium-cta">
          {DOSE_SHARE.premium.cta}
        </Link>
      </aside>
    </div>
  )
}
