import { parseDbTimeToMinutes, parseTimeToMinutes } from '@/lib/dashboard/time-utils'
import type { PhoticDayPhase } from '@/lib/retinomic/types'
import type { SmartphoneFeedSnapshot } from '@/lib/retinomic/live-mlux-feed'

export type LightCheckInConfig = {
  fitzpatrickType: number | null
  defaultSleepOnset: string
}

export type LightCheckInPrompt = {
  question: string
  yesLabel: string
  noLabel: string
}

export type LightCheckInResult =
  | { ok: true; snapshot: SmartphoneFeedSnapshot }
  | { ok: false; error: string }

/** Profile sleep values may be HH:MM or 10:30pm — API expects HH:MM */
export function normalizeSleepOnsetForApi(value: string | null | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) return '22:30'

  const twentyFour = parseDbTimeToMinutes(trimmed)
  if (twentyFour != null) {
    const hours = Math.floor(twentyFour / 60)
    const minutes = twentyFour % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const twelve = parseTimeToMinutes(trimmed)
  if (twelve != null) {
    const hours = Math.floor(twelve / 60)
    const minutes = twelve % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  return '22:30'
}

export function lightCheckInPrompt(phase: PhoticDayPhase): LightCheckInPrompt {
  switch (phase) {
    case 'morning':
      return {
        question: 'Outdoor melanopic light before 10am?',
        yesLabel: 'Yes — got outside',
        noLabel: 'Not yet',
      }
    case 'midday':
      return {
        question: 'Bright outdoor light so far today?',
        yesLabel: 'Yes — good dose',
        noLabel: 'Not much yet',
      }
    case 'evening':
      return {
        question: 'Enough daylight exposure today?',
        yesLabel: 'Yes — on track',
        noLabel: 'Too little',
      }
  }
}

export function vdrDoseFromOutdoorLight(outdoorLight: boolean): number {
  return outdoorLight ? 65 : 15
}

export async function submitLightCheckIn(input: {
  outdoorLight: boolean
  sleepOnsetLocal: string
  fitzpatrickType: number | null
}): Promise<LightCheckInResult> {
  try {
    const response = await fetch('/api/smartphone/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sleep_onset_local: normalizeSleepOnsetForApi(input.sleepOnsetLocal),
        outdoor_light_before_10am: input.outdoorLight,
        sleep_onset_estimated: true,
        fitzpatrick_type: input.fitzpatrickType,
      }),
    })

    const payload = (await response.json()) as {
      error?: string
      result?: { confidence_score?: number }
    }

    if (!response.ok) {
      return { ok: false, error: payload.error ?? 'Could not save your light reading.' }
    }

    const vdrDoseToday = vdrDoseFromOutdoorLight(input.outdoorLight)
    return {
      ok: true,
      snapshot: {
        observedAt: new Date().toISOString(),
        vdrDoseToday,
        outdoorLightBefore10am: input.outdoorLight,
        confidenceScore: payload.result?.confidence_score ?? null,
      },
    }
  } catch {
    return { ok: false, error: 'Could not save your light reading. Please try again.' }
  }
}
