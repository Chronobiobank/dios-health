import type { HardwareBaseline, IrisPigment } from '@/src/types'
import { computeSunZenithData } from '@/src/lib/engine/sun-zenith'

export const ONBOARDING_BRIDGE_STORAGE_KEY = 'dios-retinomic-onboarding-bridge'

export type OnboardingGeo = {
  lat: number
  lng: number
}

export type OnboardingBridgePayload = {
  irisPigment: IrisPigment
  skinITA: number
  onboardingLatLong: OnboardingGeo
  capturedAt: string
}

export type OnboardingBridgeParseResult = {
  payload: OnboardingBridgePayload | null
  source: 'url' | 'session' | 'none'
}

function parseIrisPigment(value: string | null): IrisPigment | null {
  if (value === 'LIGHT' || value === 'DARK') return value
  return null
}

function parseNumber(value: string | null): number | null {
  if (value == null || value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function estimateSkinItaFromScan(): number {
  return Math.round((32 + Math.random() * 18) * 10) / 10
}

export function estimateIrisFromScan(): IrisPigment {
  return Math.random() > 0.45 ? 'LIGHT' : 'DARK'
}

export function estimateFitzpatrickFromSkinIta(skinITA: number): number {
  if (skinITA < 28) return 1
  if (skinITA < 34) return 2
  if (skinITA < 40) return 3
  if (skinITA < 48) return 4
  if (skinITA < 55) return 5
  return 6
}

export function buildHardwareBaselineFromBridge(
  bridge: OnboardingBridgePayload
): HardwareBaseline & { onboardingGeo: OnboardingGeo & { solarZenithDegrees: number } } {
  const sun = computeSunZenithData(null, null)
  const solarZenithDegrees = sun.solarZenithDegrees

  return {
    irisPigment: bridge.irisPigment,
    skinITA: bridge.skinITA,
    gclIplThicknessMicrons: { leftEye: null, rightEye: null },
    onboardingGeo: {
      ...bridge.onboardingLatLong,
      solarZenithDegrees,
    },
  }
}

export function parseOnboardingBridgeFromSearchParams(
  params: URLSearchParams
): OnboardingBridgePayload | null {
  const irisPigment = parseIrisPigment(params.get('irisPigment'))
  const skinITA = parseNumber(params.get('skinITA'))
  const lat = parseNumber(params.get('lat'))
  const lng = parseNumber(params.get('lng'))

  if (!irisPigment || skinITA == null || lat == null || lng == null) {
    return null
  }

  return {
    irisPigment,
    skinITA,
    onboardingLatLong: { lat, lng },
    capturedAt: new Date().toISOString(),
  }
}

export function persistOnboardingBridge(payload: OnboardingBridgePayload): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(ONBOARDING_BRIDGE_STORAGE_KEY, JSON.stringify(payload))
}

export function readOnboardingBridgeFromSession(): OnboardingBridgePayload | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(ONBOARDING_BRIDGE_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as OnboardingBridgePayload
    if (
      parsed?.irisPigment &&
      typeof parsed.skinITA === 'number' &&
      parsed.onboardingLatLong?.lat != null &&
      parsed.onboardingLatLong?.lng != null
    ) {
      return parsed
    }
  } catch {
    return null
  }
  return null
}

export function clearOnboardingBridge(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(ONBOARDING_BRIDGE_STORAGE_KEY)
}

export function mergeOnboardingBridge(
  searchParams: URLSearchParams
): OnboardingBridgeParseResult {
  const fromUrl = parseOnboardingBridgeFromSearchParams(searchParams)
  if (fromUrl) {
    persistOnboardingBridge(fromUrl)
    return { payload: fromUrl, source: 'url' }
  }

  const fromSession = readOnboardingBridgeFromSession()
  if (fromSession) {
    return { payload: fromSession, source: 'session' }
  }

  return { payload: null, source: 'none' }
}

export function bridgeToQueryString(bridge: OnboardingBridgePayload): string {
  const q = new URLSearchParams({
    irisPigment: bridge.irisPigment,
    skinITA: String(bridge.skinITA),
    lat: String(bridge.onboardingLatLong.lat),
    lng: String(bridge.onboardingLatLong.lng),
  })
  return q.toString()
}
