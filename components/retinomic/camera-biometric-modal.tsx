'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { IrisPigment } from '@/src/types'
import { estimateIrisFromScan, estimateSkinItaFromScan } from '@/lib/auth/onboarding-bridge'

export type BiometricScanResult = {
  irisPigment: IrisPigment
  skinITA: number
}

const SCAN_LABELS = [
  'Isolating Iris Hue...',
  'Measuring Cutaneous Melanin Density (Skin ITA)...',
  'Mapping Scleral Vascular Tone...',
  'Estimating DLMO Phase Anchor...',
  'Packaging Retinomic Screening Vector...',
] as const

type CameraBiometricModalProps = {
  open: boolean
  onClose: () => void
  onComplete: (result: BiometricScanResult) => void
}

export function CameraBiometricModal({ open, onClose, onComplete }: CameraBiometricModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [labelIndex, setLabelIndex] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setScanning(false)
      setLabelIndex(0)
      setCameraError(null)
      return
    }

    let stream: MediaStream | null = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setCameraError(null)
      } catch {
        setCameraError('Camera unavailable. Simulated viewport active.')
      }
    }

    void startCamera()

    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [open])

  useEffect(() => {
    if (!scanning) return
    const interval = window.setInterval(() => {
      setLabelIndex((i) => (i + 1) % SCAN_LABELS.length)
    }, 900)
    return () => window.clearInterval(interval)
  }, [scanning])

  useEffect(() => {
    if (!scanning) return
    const timer = window.setTimeout(() => {
      setScanning(false)
      onComplete({
        irisPigment: estimateIrisFromScan(),
        skinITA: estimateSkinItaFromScan(),
      })
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [scanning, onComplete])

  const handleActivate = useCallback(() => {
    setScanning(true)
    setLabelIndex(0)
  }, [])

  if (!open) return null

  return (
    <div
      className="retinomic-camera-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="biometric-portal-title"
    >
      <div className="dios-glass-outer retinomic-camera-modal__card">
        <p id="biometric-portal-title" className="calm-auth-eyebrow">
          Biometric screening portal
        </p>
        <p className="dash-sub mt-2 text-sm">
          Iris + cutaneous capture for your dose intelligence baseline.
        </p>

        <div className="retinomic-camera-viewport mt-4">
          {cameraError ? (
            <div className="flex h-full items-center justify-center bg-white/60 px-4 text-center text-xs text-[var(--text-muted)]">
              {cameraError}
            </div>
          ) : (
            <video ref={videoRef} className="retinomic-camera-viewport__feed" muted playsInline />
          )}
          {scanning ? (
            <div className="retinomic-camera-scan-line animate-pulse-slow" aria-hidden />
          ) : null}
        </div>

        <div className="retinomic-scan-labels" aria-live="polite">
          {scanning ? SCAN_LABELS[labelIndex] : 'Align face within reticle. Hold steady.'}
        </div>

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="dios-btn-on-light--secondary flex-1 py-2.5">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleActivate}
            disabled={scanning}
            className="dios-btn-on-light flex-1 py-2.5 disabled:opacity-50"
          >
            {scanning ? 'Scanning…' : 'Activate scan'}
          </button>
        </div>
      </div>
    </div>
  )
}
