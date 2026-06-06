import {
  DEVICE_INTERRUPTED_ALERT,
  PREMIUM_VERIFICATION_BADGE,
  WEARABLE_SOURCE_LABEL,
  type WearableSourceLabel,
} from '@/lib/clinicians/triage-labels'
import { cn } from '@/lib/utils'

type TriageBadgesProps = {
  isPremiumTier: boolean
  deviceAlertTriggered: boolean
  wearableSource?: WearableSourceLabel
  /** Shell layout (ct-*) vs legacy clinicians-triage layout */
  variant?: 'shell' | 'legacy'
}

export function TriageBadges({
  isPremiumTier,
  deviceAlertTriggered,
  wearableSource = 'oura',
  variant = 'shell',
}: TriageBadgesProps) {
  const premiumClass =
    variant === 'shell' ? 'ct-card__badge-premium' : 'clinicians-triage__badge-premium'
  const wearableClass =
    variant === 'shell' ? 'ct-card__badge-wearable' : 'clinicians-triage__badge-wearable'
  const alertClass =
    variant === 'shell' ? 'ct-card__alert' : 'clinicians-triage__device-alert'

  return (
    <>
      {isPremiumTier ? (
        <p className={premiumClass}>{PREMIUM_VERIFICATION_BADGE}</p>
      ) : (
        <p className={wearableClass}>{WEARABLE_SOURCE_LABEL[wearableSource]}</p>
      )}
      {deviceAlertTriggered ? (
        <p className={cn(alertClass)} role="status">
          {DEVICE_INTERRUPTED_ALERT}
        </p>
      ) : null}
    </>
  )
}
