import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { generateInviteCode } from '@/lib/care/invite-codes'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  if (!profile || !['clinician', 'enterprise'].includes(profile.tier)) {
    return Response.json({ error: 'Clinician access required' }, { status: 403 })
  }

  let code = generateInviteCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await adminClient.from('clinician_invite_codes').insert({
      clinician_id: user.id,
      code,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    })
    if (!error) {
      return Response.json({ ok: true, code })
    }
    code = generateInviteCode()
  }

  return Response.json({ error: 'Could not generate invite code' }, { status: 500 })
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: invites, error } = await supabase
    .from('clinician_invite_codes')
    .select('code, use_count, max_uses, expires_at, created_at')
    .eq('clinician_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ invites: invites ?? [] })
}
