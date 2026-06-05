'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import type { BiometricScanResult } from '@/components/retinomic/camera-biometric-modal'
import { CameraBiometricModal } from '@/components/retinomic/camera-biometric-modal'
import { SilotonNodeLocator } from '@/components/retinomic/siloton-node-locator'
import {
  bridgeToQueryString,
  persistOnboardingBridge,
  type OnboardingGeo,
  type OnboardingBridgePayload,
} from '@/lib/auth/onboarding-bridge'
import { AUTH_ROUTES } from '@/lib/auth/routes'

const DEFAULT_GEO: OnboardingGeo = { lat: -36.8485, lng: 174.7633 }

export function OnboardingFlow() {
  const router = useRouter()
  const [cameraOpen, setCameraOpen] = useState(false)
  const [scanResult, setScanResult] = useState<BiometricScanResult | null>(null)
  const [geo, setGeo] = useState<OnboardingGeo>(DEFAULT_GEO)

  const handleScanComplete = useCallback((result: BiometricScanResult) => {
    setScanResult(result)
    setCameraOpen(false)
  }, [])

  const handleContinueToSignup = useCallback(() => {
    const bridge: OnboardingBridgePayload = {
      irisPigment: scanResult?.irisPigment ?? 'DARK',
      skinITA: scanResult?.skinITA ?? 38,
      onboardingLatLong: geo,
      capturedAt: new Date().toISOString(),
    }
    persistOnboardingBridge(bridge)
    router.push(`${AUTH_ROUTES.authSignUp}?${bridgeToQueryString(bridge)}`)
  }, [router, scanResult, geo])

  return (
    <div className="retinomic-onboarding">
      <div className="mx-auto max-w-md px-4">
        <p className="calm-auth-eyebrow">Free baseline scan</p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-[var(--text-primary)]">
          Camera check + scan node
        </h1>
        <p className="dash-sub mt-2 text-sm">
          Face scan first. Then pick your nearest Siloton node.
        </p>

        <section className="dios-glass-outer mt-8 p-4">
          <p className="text-sm font-medium text-[var(--text-primary)]">Step 1 · Face scan</p>
          <p className="dash-sub mt-1 text-xs">Iris and skin tone for your light dose.</p>
          <button type="button" onClick={() => setCameraOpen(true)} className="dios-btn-on-light calm-auth-btn-primary mt-4">
            {scanResult ? 'Rescan biometrics' : 'Open camera screening'}
          </button>
          {scanResult ? (
            <p className="mt-2 text-center font-mono text-[10px] text-[var(--photic-muted)]">
              {scanResult.irisPigment} iris · ITA {scanResult.skinITA} — ready to secure identity
            </p>
          ) : null}
        </section>

        <section className="mt-6">
          <SilotonNodeLocator onGeoResolved={setGeo} />
        </section>

        <button type="button" onClick={handleContinueToSignup} className="dios-btn-on-light--secondary calm-auth-btn-secondary mt-8">
          Continue to account →
        </button>

        <p className="calm-auth-muted mt-3 text-center">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.authSignIn)}
            className="calm-auth-link"
          >
            Sign in
          </button>
        </p>
      </div>

      <CameraBiometricModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onComplete={handleScanComplete}
      />
    </div>
  )
}
