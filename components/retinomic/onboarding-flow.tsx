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
      <div className="mx-auto max-w-md px-4 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7eb8ff]">
          Retinomic Protocol · onboarding
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-[#fafaf7]">
          Passive sensing + node screening
        </h1>
        <p className="mt-2 text-sm text-[rgb(250_250_247/0.6)]">
          Free tier: smartphone photometry and Siloton OCT baseline. Premium unlocks quarterly
          labs and TipTraQ verification.
        </p>

        <section className="mt-8 rounded-xl border border-[rgb(255_255_255/0.1)] bg-[#0f0f0f] p-4">
          <p className="text-sm font-medium text-[#fafaf7]">Step 1 · Biometric portal</p>
          <p className="mt-1 text-xs text-[rgb(250_250_247/0.55)]">
            Iris hue + skin ITA capture for chronotype anchoring.
          </p>
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="mt-4 w-full rounded-full bg-[#7eb8ff] py-3 text-sm font-medium text-[#0a0a0a]"
          >
            {scanResult ? 'Rescan biometrics' : 'Open camera screening'}
          </button>
          {scanResult ? (
            <p className="mt-2 text-center font-mono text-[10px] text-[#7eb8ff]">
              {scanResult.irisPigment} iris · ITA {scanResult.skinITA} — ready to secure identity
            </p>
          ) : null}
        </section>

        <section className="mt-6">
          <SilotonNodeLocator onGeoResolved={setGeo} />
        </section>

        <button
          type="button"
          onClick={handleContinueToSignup}
          className="mt-8 w-full rounded-full border border-[rgb(255_255_255/0.2)] py-3 text-sm font-medium text-[#fafaf7]"
        >
          Secure baseline identity →
        </button>

        <p className="mt-3 text-center text-xs text-[rgb(250_250_247/0.45)]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.authSignIn)}
            className="text-[#7eb8ff] underline-offset-2 hover:underline"
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
