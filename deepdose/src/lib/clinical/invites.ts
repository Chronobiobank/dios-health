import type { SupabaseClient } from '@supabase/supabase-js'

export type ClinicianInviteCode = {
  code: string
  use_count: number
  max_uses: number
  expires_at: string | null
  created_at: string
}

export function isInviteCodeActive(invite: ClinicianInviteCode): boolean {
  if (invite.use_count >= invite.max_uses) return false
  if (invite.expires_at && new Date(invite.expires_at).getTime() <= Date.now()) return false
  return true
}

export function inviteCodeMeta(invite: ClinicianInviteCode): string {
  const parts = [`${invite.use_count}/${invite.max_uses} uses`]
  if (!isInviteCodeActive(invite)) {
    parts.unshift('Expired')
  } else {
    parts.unshift('Active')
  }
  if (invite.expires_at) {
    parts.push(
      `until ${new Date(invite.expires_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`
    )
  }
  return parts.join(' · ')
}

export async function fetchClinicianInviteCodes(
  supabase: SupabaseClient,
  clinicianId: string,
  limit = 10
): Promise<ClinicianInviteCode[]> {
  const { data, error } = await supabase
    .from('clinician_invite_codes')
    .select('code, use_count, max_uses, expires_at, created_at')
    .eq('clinician_id', clinicianId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data ?? []) as ClinicianInviteCode[]
}
