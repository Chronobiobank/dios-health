import type { SupabaseClient } from '@supabase/supabase-js'
import { normalizeInviteCode } from '@/lib/care/invite-codes'

export type LinkPatientErrorCode =
  | 'consent_required'
  | 'invalid_code'
  | 'not_found'
  | 'expired'
  | 'limit_reached'
  | 'already_linked'
  | 'unknown'

export type LinkPatientResult =
  | { ok: true; clinicianName: string }
  | { ok: false; error: string; code: LinkPatientErrorCode }

export async function linkPatientToClinician(
  admin: SupabaseClient,
  patientId: string,
  rawCode: string
): Promise<LinkPatientResult> {
  const code = normalizeInviteCode(rawCode)
  if (code.length < 6) {
    return { ok: false, error: 'Invalid invite code.', code: 'invalid_code' }
  }

  const { data: consent } = await admin
    .from('patient_consents')
    .select('granted, withdrawn_at')
    .eq('patient_id', patientId)
    .eq('purpose_code', 'clinical_care')
    .eq('granted', true)
    .is('withdrawn_at', null)
    .maybeSingle()

  if (!consent) {
    return {
      ok: false,
      error: 'Enable clinical care sharing in your consent settings before linking a clinician.',
      code: 'consent_required',
    }
  }

  const { data: invite, error: inviteError } = await admin
    .from('clinician_invite_codes')
    .select('id, clinician_id, expires_at, max_uses, use_count')
    .eq('code', code)
    .maybeSingle()

  if (inviteError || !invite) {
    return { ok: false, error: 'Invite code not found.', code: 'not_found' }
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { ok: false, error: 'This invite code has expired.', code: 'expired' }
  }

  if (invite.use_count >= invite.max_uses) {
    return { ok: false, error: 'This invite code has reached its use limit.', code: 'limit_reached' }
  }

  const { data: existing } = await admin
    .from('care_relationships')
    .select('id')
    .eq('patient_id', patientId)
    .eq('clinician_id', invite.clinician_id)
    .eq('active', true)
    .maybeSingle()

  if (existing) {
    return { ok: false, error: 'You are already linked to this clinician.', code: 'already_linked' }
  }

  const { error: linkError } = await admin.from('care_relationships').insert({
    patient_id: patientId,
    clinician_id: invite.clinician_id,
    relationship: 'gp',
    active: true,
  })

  if (linkError) {
    return { ok: false, error: linkError.message, code: 'unknown' }
  }

  await admin
    .from('clinician_invite_codes')
    .update({ use_count: invite.use_count + 1 })
    .eq('id', invite.id)

  const { data: clinician } = await admin
    .from('user_profiles')
    .select('display_name')
    .eq('id', invite.clinician_id)
    .single()

  return {
    ok: true,
    clinicianName: clinician?.display_name ?? 'Your clinician',
  }
}
