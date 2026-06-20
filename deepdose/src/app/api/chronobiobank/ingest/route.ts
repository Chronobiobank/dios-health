import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { ingestPatientToChronobiobank } from '@/lib/chronobiobank/ingest'

// A patient contributes their own consented, pseudonymised data to the
// Chronobiobank. Idempotent — already-contributed recommendations are skipped.
export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await ingestPatientToChronobiobank(adminClient, user.id)
  return Response.json(result)
}
