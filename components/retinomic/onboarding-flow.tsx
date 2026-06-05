'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import type { BiometricScanResult } from '@/components/retinomic/camera-biometric-modal'
import { CameraBiometricModal } from '@/components/retinomic/camera-biometric-modal'
import { MedicationChipPicker } from '@/components/retinomic/medication-chip-picker'
import { SilotonNodeLocator } from '@/components/retinomic/siloton-node-locator'
import {
  bridgeToQueryString,
  persistOnboardingBridge,
  type OnboardingGeo,
  type OnboardingBridgePayload,
} from '@/lib/auth/onboarding-bridge'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { ONBOARDING_COPY } from '@/lib/pitch/retinomic-landing-copy'
import { cn } from '@/lib/utils'

const DEFAULT_GEO: OnboardingGeo = { lat: -36.8485, lng: 174.7633 }
const copy = ONBOARDING_COPY

export function OnboardingFlow() {
  const router = useRouter()
  const [cameraOpen, setCameraOpen] = useState(false)
  const [scanResult, setScanResult] = useState<BiometricScanResult | null>(null)
  const [geo, setGeo] = useState<OnboardingGeo>(DEFAULT_GEO)
  const [selectedMedIds, setSelectedMedIds] = useState<Set<string>>(() => new Set())

  const handleScanComplete = useCallback((result: BiometricScanResult) => {
    setScanResult(result)
    setCameraOpen(false)
  }, [])

  const handleContinueToSignup = useCallback(() => {
    const medicationIds = [...selectedMedIds]
    const bridge: OnboardingBridgePayload = {
      irisPigment: scanResult?.irisPigment ?? 'DARK',
      skinITA: scanResult?.skinITA ?? 38,
      onboardingLatLong: geo,
      capturedAt: new Date().toISOString(),
      medicationIds: medicationIds.length > 0 ? medicationIds : undefined,
    }
    persistOnboardingBridge(bridge)
    router.push(`${AUTH_ROUTES.authSignUp}?${bridgeToQueryString(bridge)}`)
  }, [router, scanResult, geo, selectedMedIds])

  const toggleMedication = useCallback((id: string) => {
    setSelectedMedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return (
    <div className="retinomic-onboarding">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-6">
        <header className="max-w-[var(--pitch-tile-copy-max,40rem)]">
          <p className="type-pitch-eyebrow">{copy.eyebrow}</p>
          <h1 className="type-pitch-title mt-3">{copy.headline}</h1>
          <p className="type-pitch-sub mt-3">{copy.subheadline}</p>
        </header>

        <div className="onboarding-hero dios-glass-outer mt-8">
          <div className="onboarding-hero__media dios-glass-inner relative min-h-[11rem] overflow-hidden sm:min-h-[14rem]">
            <Image
              src={copy.image}
              alt={copy.imageAlt}
              fill
              priority
              sizes="(max-width: 32rem) 100vw, 32rem"
              className="object-cover object-center"
            />
            <div className="onboarding-hero__scrim pointer-events-none absolute inset-0" aria-hidden />
          </div>
        </div>

        <ul className="onboarding-pillars mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5">
          {copy.pillars.map((pillar) => {
            const active =
              pillar.id === 'meds' ? selectedMedIds.size > 0 : pillar.active
            return (
            <li
              key={pillar.id}
              className={cn(
                'onboarding-pillar dios-glass-inner px-3 py-2.5',
                active ? 'onboarding-pillar--active' : 'onboarding-pillar--later'
              )}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]">
                {pillar.label}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{pillar.note}</p>
            </li>
            )
          })}
        </ul>

        <section className="dios-glass-outer mt-6 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">{copy.step1.label}</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
            {copy.step1.title}
          </h2>
          <p className="type-body mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.step1.body}</p>
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="dios-btn-on-light calm-auth-btn-primary mt-4"
          >
            {scanResult ? copy.step1.ctaDone : copy.step1.ctaIdle}
          </button>
          {scanResult ? (
            <p className="mt-2 text-center font-mono text-[10px] text-[var(--photic-muted)]">
              {scanResult.irisPigment} iris · ITA {scanResult.skinITA} — {copy.step1.donePrefix}
            </p>
          ) : null}
        </section>

        <section className="dios-glass-outer mt-4 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">{copy.step2.label}</p>
          <p className="type-pitch-eyebrow mt-1 text-[0.625rem]">{copy.step2.eyebrow}</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
            {copy.step2.title}
          </h2>
          <p className="type-body mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.step2.body}</p>
          <div className="mt-4">
            <SilotonNodeLocator />
          </div>
        </section>

        <section className="dios-glass-outer mt-4 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">{copy.step3.label}</p>
          <p className="type-pitch-eyebrow mt-1 text-[0.625rem]">{copy.step3.eyebrow}</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
            {copy.step3.title}
          </h2>
          <p className="type-body mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.step3.body}</p>
          <MedicationChipPicker
            selectedIds={selectedMedIds}
            onToggle={toggleMedication}
            className="mt-4"
          />
          <p className="mt-3 text-xs text-[var(--text-secondary)]">{copy.step3.skipNote}</p>
          {selectedMedIds.size > 0 ? (
            <p className="mt-2 font-mono text-[10px] text-[var(--photic-muted)]">
              {selectedMedIds.size} medication{selectedMedIds.size === 1 ? '' : 's'} — personal dose windows on day one
            </p>
          ) : null}
        </section>

        <button
          type="button"
          onClick={handleContinueToSignup}
          className="dios-btn-on-light calm-auth-btn-primary mt-8"
        >
          {copy.continueCta}
        </button>

        <p className="calm-auth-muted mt-3 text-center">
          {copy.signInHint}{' '}
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
