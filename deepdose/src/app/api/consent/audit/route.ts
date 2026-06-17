import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { framework_id?: string; action?: string; purpose_codes?: string[] }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { framework_id, action, purpose_codes } = body
  if (!framework_id || !action) {
    return Response.json({ error: 'framework_id and action are required' }, { status: 400 })
  }

  if (!['granted', 'withdrawn', 'viewed', 'exported'].includes(action)) {
    return Response.json({ error: 'Invalid action' }, { status: 400 })
  }

  const { error: auditError } = await adminClient.from('consent_audit_log').insert({
    patient_id: user.id,
    purpose_code: purpose_codes?.[0] ?? null,
    action,
    actor_id: user.id,
    metadata: { framework_id, purpose_codes: purpose_codes ?? [], source: 'audit_api' },
  })

  if (auditError) {
    return Response.json({ error: auditError.message }, { status: 500 })
  }

  return Response.json({ ok: true })
}
