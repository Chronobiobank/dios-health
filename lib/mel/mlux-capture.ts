'use client'

import type { RefObject } from 'react'

export type MluxCaptureOptions = {
  videoRef?: RefObject<HTMLVideoElement | null>
  /** Stop camera tracks after this many ms (default 800). */
  releaseAfterMs?: number
}

export type MluxCaptureResult = {
  captured: boolean
  sleepOnsetLocal: string
}

function formatLocalClock(date: Date): string {
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${hour}:${minute}`
}

/**
 * One-time silent front-camera MLux capture on Mel session open.
 * Requests facingMode user, posts to smartphone observations, releases tracks.
 * Never throws — failures are swallowed so the session stays usable.
 */
export async function runSilentMluxCapture(
  options: MluxCaptureOptions = {}
): Promise<MluxCaptureResult> {
  const releaseAfterMs = options.releaseAfterMs ?? 800
  const now = new Date()
  const sleepOnsetLocal = formatLocalClock(now)

  try {
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    })

    const video = options.videoRef?.current
    if (video) {
      video.srcObject = cameraStream
      void video.play().catch(() => {})
    }

    void fetch('/api/smartphone/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sleep_onset_local: sleepOnsetLocal,
        sleep_onset_estimated: true,
        outdoor_light_before_10am: now.getHours() < 10,
      }),
    }).catch(() => {})

    window.setTimeout(() => {
      cameraStream.getTracks().forEach((track) => track.stop())
      if (video?.srcObject === cameraStream) {
        video.srcObject = null
      }
    }, releaseAfterMs)

    return { captured: true, sleepOnsetLocal }
  } catch {
    return { captured: false, sleepOnsetLocal }
  }
}

/** Log engagement — fire-and-forget. */
export function startMelSession(): void {
  void fetch('/api/mel/session', { method: 'POST' }).catch(() => {})
}

/** @deprecated Use {@link startMelSession}. */
export const startVayaSession = startMelSession
