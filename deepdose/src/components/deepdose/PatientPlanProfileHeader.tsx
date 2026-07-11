'use client'

import { type ChangeEvent } from 'react'
import { DEEPDOSE_PATIENT_PLAN_PROFILE } from '@/lib/deepdose-marketing/landing-content'

type PatientPlanProfileHeaderProps = {
  firstName: string
  onFirstNameChange: (value: string) => void
  familyName: string
  onFamilyNameChange: (value: string) => void
  avatarUrl: string | null
  onAvatarChange: (value: string | null) => void
  wake: string | null
  onWakeChange: (value: string) => void
  medCount: number
  variant?: 'landing' | 'app'
}

export function PatientPlanProfileHeader({
  firstName,
  onFirstNameChange,
  familyName,
  onFamilyNameChange,
  avatarUrl,
  onAvatarChange,
  wake,
  onWakeChange,
  medCount,
  variant = 'landing',
}: PatientPlanProfileHeaderProps) {
  const rootClass = variant === 'landing' ? 'seco-plan-profile' : 'patient-dash-profile'

  function handleAvatarPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    onAvatarChange(URL.createObjectURL(file))
    event.target.value = ''
  }

  return (
    <header className={rootClass}>
      <label className={`${rootClass}__avatar`} htmlFor={`${rootClass}-avatar-input`}>
        <input
          id={`${rootClass}-avatar-input`}
          type="file"
          accept="image/*"
          className={`${rootClass}__avatar-input`}
          onChange={handleAvatarPick}
        />
        {avatarUrl ? (
          // Local data-URL preview
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className={`${rootClass}__avatar-img`} />
        ) : (
          <span className={`${rootClass}__avatar-label`}>Upload pic</span>
        )}
      </label>

      <div className={`${rootClass}__copy`}>
        <div className={`${rootClass}__name-fields`}>
          <label className={`${rootClass}__name-field`}>
            <input
              type="text"
              className={`${rootClass}__name-input`}
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder={DEEPDOSE_PATIENT_PLAN_PROFILE.firstNamePlaceholder}
              aria-label="First name"
              autoComplete="given-name"
            />
          </label>
          <label className={`${rootClass}__name-field`}>
            <input
              type="text"
              className={`${rootClass}__name-input`}
              value={familyName}
              onChange={(e) => onFamilyNameChange(e.target.value)}
              placeholder={DEEPDOSE_PATIENT_PLAN_PROFILE.familyNamePlaceholder}
              aria-label="Family name"
              autoComplete="family-name"
            />
          </label>
        </div>

        <div className={`${rootClass}__detail`}>
          <label className={`${rootClass}__detail-item ${rootClass}__detail-item--wake`}>
            <span className={`${rootClass}__detail-label`}>Wake</span>
            <input
              type="time"
              className={`${rootClass}__wake-input`}
              value={wake ?? ''}
              onChange={(e) => onWakeChange(e.target.value)}
              aria-label="Wake time"
            />
          </label>
          {medCount > 0 ? (
            <span className={`${rootClass}__detail-item`}>
              {medCount} medicine{medCount === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>

        <p className={`${rootClass}__baseline`}>{DEEPDOSE_PATIENT_PLAN_PROFILE.baseline}</p>
      </div>
    </header>
  )
}
