import { createClient } from '@/lib/supabase/client'
import { WEARABLE_TELEMETRY_LOGS_TABLE } from '@/lib/dios/constants/tables'
import { MockTipTraQAdapter } from '@/lib/dios/premium/mock-tiptraq-adapter'
import type { PatientIntegrationRecord, PremiumIngestionResult } from '@/lib/dios/premium/types'

const PATIENT_PROFILES_TABLE = 'patient_profiles'

/**
 * Returns true when the patient row has `is_premium_tier` enabled.
 * Falls back to `retinomic_tier = PREMIUM_VERIFICATION` when the boolean is unset.
 */
export async function verifyPatientPremiumTier(patientId: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from(PATIENT_PROFILES_TABLE)
    .select(
      'id, is_premium_tier, oura_oauth_token, whoop_oauth_token, tiptraq_api_key, apple_health_connected, retinomic_tier'
    )
    .eq('id', patientId)
    .maybeSingle<PatientIntegrationRecord>()

  if (error) {
    throw new Error(`Failed to verify premium tier: ${error.message}`)
  }

  if (!data) {
    return false
  }

  if (data.is_premium_tier) {
    return true
  }

  return data.retinomic_tier === 'PREMIUM_VERIFICATION'
}

/**
 * Verifies premium tier and, when eligible, configures MockTipTraQAdapter to ingest
 * clinical-grade sleep telemetry (SpO2 + RDI) into `wearable_telemetry_logs`.
 */
export async function configurePremiumTipTraqIngestion(
  patientId: string
): Promise<PremiumIngestionResult> {
  const isPremium = await verifyPatientPremiumTier(patientId)

  if (!isPremium) {
    return {
      isPremium: false,
      synced: false,
      telemetryId: null,
      source: null,
    }
  }

  const adapter = new MockTipTraQAdapter()
  const row = adapter.toWearableTelemetryInsert(patientId)
  const supabase = createClient()

  const { data, error } = await supabase
    .from(WEARABLE_TELEMETRY_LOGS_TABLE)
    .insert(row)
    .select('id')
    .single<{ id: string }>()

  if (error) {
    throw new Error(`Failed to ingest TipTraQ telemetry: ${error.message}`)
  }

  return {
    isPremium: true,
    synced: true,
    telemetryId: data.id,
    source: 'tiptraq',
  }
}
