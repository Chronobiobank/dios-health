'use client'

import { useCallback, useState } from 'react'

import {
  lightCheckInPrompt,
  submitLightCheckIn,
  type LightCheckInConfig,
} from '@/lib/retinomic/light-check-in'
import type { SmartphoneFeedSnapshot } from '@/lib/retinomic/live-mlux-feed'
import type { PhoticDayPhase } from '@/lib/retinomic/types'
import { cn } from '@/lib/utils'

type LightCheckInProps = {
  phase: PhoticDayPhase
  config: LightCheckInConfig
  onLogged: (snapshot: SmartphoneFeedSnapshot) => void
}

export function LightCheckIn({ phase, config, onLogged }: LightCheckInProps) {
  const prompt = lightCheckInPrompt(phase)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAnswer = useCallback(
    async (outdoorLight: boolean) => {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const result = await submitLightCheckIn({
        outdoorLight,
        sleepOnsetLocal: config.defaultSleepOnset,
        fitzpatrickType: config.fitzpatrickType,
      })

      setLoading(false)

      if (!result.ok) {
        setError(result.error)
        return
      }

      onLogged(result.snapshot)
      setSuccess('Light dose updated from your check-in.')
    },
    [config.defaultSleepOnset, config.fitzpatrickType, onLogged]
  )

  return (
    <div className="retinomic-light-check-in mt-3">
      <p className="type-body text-sm text-[var(--text-secondary)]">{prompt.question}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleAnswer(true)}
          className={cn('dios-btn-on-light text-sm', loading && 'opacity-60')}
        >
          {loading ? 'Saving…' : prompt.yesLabel}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleAnswer(false)}
          className={cn('dios-btn-on-light--secondary text-sm', loading && 'opacity-60')}
        >
          {prompt.noLabel}
        </button>
      </div>
      {success ? (
        <p className="calm-auth-muted mt-2 text-[11px]" role="status">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-[11px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
