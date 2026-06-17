import type { SupabaseClient } from '@supabase/supabase-js'

export interface ConsentFramework {
  id: string
  version: string
  title: string
  description: string | null
}

export interface ConsentPurpose {
  id: string
  framework_id: string
  code: string
  title: string
  description: string | null
  is_required: boolean
}

export interface PatientConsent {
  purpose_code: string
  granted: boolean
  granted_at: string | null
  withdrawn_at: string | null
}

export interface ConsentGrantInput {
  purpose_code: string
  granted: boolean
}

export async function getCurrentFramework(
  supabase: SupabaseClient
): Promise<{ framework: ConsentFramework | null; error: string | null }> {
  const { data, error } = await supabase
    .from('consent_frameworks')
    .select('id, version, title, description')
    .eq('is_current', true)
    .single()

  if (error) {
    return { framework: null, error: error.message }
  }

  return { framework: data, error: null }
}

export async function getConsentPurposes(
  supabase: SupabaseClient,
  frameworkId: string
): Promise<{ purposes: ConsentPurpose[]; error: string | null }> {
  const { data, error } = await supabase
    .from('consent_purposes')
    .select('id, framework_id, code, title, description, is_required')
    .eq('framework_id', frameworkId)
    .order('is_required', { ascending: false })

  if (error) {
    return { purposes: [], error: error.message }
  }

  return { purposes: data ?? [], error: null }
}

export async function getPatientConsents(
  supabase: SupabaseClient,
  patientId: string
): Promise<{ consents: PatientConsent[]; error: string | null }> {
  const { data, error } = await supabase
    .from('patient_consents')
    .select('purpose_code, granted, granted_at, withdrawn_at')
    .eq('patient_id', patientId)

  if (error) {
    return { consents: [], error: error.message }
  }

  return { consents: data ?? [], error: null }
}

export function buildConsentState(
  purposes: ConsentPurpose[],
  existing: PatientConsent[]
): Record<string, boolean> {
  const state: Record<string, boolean> = {}

  for (const purpose of purposes) {
    const record = existing.find((c) => c.purpose_code === purpose.code)
    if (record && record.granted && !record.withdrawn_at) {
      state[purpose.code] = true
    } else if (purpose.is_required) {
      state[purpose.code] = false
    } else {
      state[purpose.code] = false
    }
  }

  return state
}

export function validateRequiredConsents(
  purposes: ConsentPurpose[],
  grants: Record<string, boolean>
): { valid: boolean; missing: string[] } {
  const missing = purposes
    .filter((p) => p.is_required && !grants[p.code])
    .map((p) => p.code)

  return { valid: missing.length === 0, missing }
}

export function hasCompletedRequiredConsents(
  purposes: ConsentPurpose[],
  existing: PatientConsent[]
): boolean {
  const state = buildConsentState(purposes, existing)
  return validateRequiredConsents(purposes, state).valid
}
