import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { syncOuraForPatient } from '@/lib/wearables/sync-oura'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await syncOuraForPatient(adminClient, user.id)

  if (result.error) {
    return Response.json({ error: result.error, nights: result.nights }, { status: 500 })
  }

  return Response.json({ ok: true, nights: result.nights })
}
