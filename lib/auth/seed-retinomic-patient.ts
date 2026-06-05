import type { SupabaseClient } from '@supabase/supabase-js'

import { estimateFitzpatrickFromSkinIta } from '@/lib/auth/onboarding-bridge'
import { seedSmartphoneBaselineFeed } from '@/lib/auth/seed-smartphone-baseline-feed'
import { computeSunZenithData } from '@/src/lib/engine/sun-zenith'
import type { HardwareBaseline, IrisPigment } from '@/src/types'

export type SeedRetinomicPatientInput = {
  userId: string
  email: string
  firstName: string
  familyName?: string | null
  irisPigment: IrisPigment
  skinITA: number
  lat: number
  lng: number
}

function cityFromCoordinates(lat: number, lng: number): { city: string; country: string } {
  if (lat < -40 && lng > 165 && lng < 180) return { city: 'Wellington', country: 'New Zealand' }
  if (lat < -35 && lat > -38 && lng > 174 && lng < 176) return { city: 'Auckland', country: 'New Zealand' }
  if (lat > 50 && lat < 53 && lng > -2 && lng < 2) return { city: 'London', country: 'United Kingdom' }
  if (lat > 40 && lat < 42 && lng > -74 && lng < -71) return { city: 'New York', country: 'United States' }
  return { city: 'Your location', country: 'Unknown' }
}

export async function seedRetinomicPatientRecord(
  supabase: SupabaseClient,
  input: SeedRetinomicPatientInput
): Promise<{ error: string | null }> {
  const fullName = [input.firstName.trim(), input.familyName?.trim()]
    .filter(Boolean)
    .join(' ')

  const { city, country } = cityFromCoordinates(input.lat, input.lng)
  const sun = computeSunZenithData(city, country)
  const fitzpatrick = estimateFitzpatrickFromSkinIta(input.skinITA)

  const hardwareBaseline: HardwareBaseline & {
    onboardingGeo: { lat: number; lng: number; solarZenithDegrees: number }
  } = {
    irisPigment: input.irisPigment,
    skinITA: input.skinITA,
    gclIplThicknessMicrons: { leftEye: null, rightEye: null },
    onboardingGeo: {
      lat: input.lat,
      lng: input.lng,
      solarZenithDegrees: sun.solarZenithDegrees,
    },
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: input.userId,
    role: 'patient',
    full_name: fullName || input.email.split('@')[0],
    terms_accepted_at: new Date().toISOString(),
  })

  if (profileError) {
    return { error: profileError.message }
  }

  const { error: patientError } = await supabase.from('patient_profiles').upsert({
    id: input.userId,
    first_name: input.firstName.trim(),
    family_name: input.familyName?.trim() || null,
    fitzpatrick_type: fitzpatrick,
    location_city: city,
    location_country: country,
    chronotype_q1: '07:30',
    chronotype_q2: 'Morning',
    chronotype_q3: '22:30',
    retinomic_tier: 'FREE_SCREENING',
    hardware_baseline: hardwareBaseline,
    biochemical_fuel: { vitaminD3: null, vitaminB5: null },
    siloton_integration: { linked: false, accessToken: null },
    onboarding_complete: true,
    data_share_policy: true,
  })

  if (patientError) {
    return { error: patientError.message }
  }

  const { error: consentError } = await supabase.from('chronobiobank_consent').upsert({
    patient_id: input.userId,
    clinical_consent: true,
    research_consent: false,
  })

  if (consentError) {
    return { error: consentError.message }
  }

  const { error: feedError } = await seedSmartphoneBaselineFeed(supabase, {
    userId: input.userId,
    irisPigment: input.irisPigment,
    skinITA: input.skinITA,
    fitzpatrickType: fitzpatrick,
    sleepOnsetLocal: '22:30',
    solarZenithDeg: sun.solarZenithDegrees,
  })

  if (feedError) {
    return { error: feedError }
  }

  return { error: null }
}
