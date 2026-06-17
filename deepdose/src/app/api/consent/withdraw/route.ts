import { createClient } from '@/lib/supabase/server'
import { savePatientConsent } from '@/lib/consent/save-consent'
import { adminClient } from '@/lib/supabase/admin'

function clientMeta(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? null
  const userAgent = request.headers.get('user-agent')
  return { ip, userAgent }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { framework_id?: string; purpose_code?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { framework_id, purpose_code } = body
  if (!framework_id || !purpose_code) {
    return Response.json({ error: 'framework_id and purpose_code are required' }, { status: 400 })
  }

  const { data: purpose, error: purposeError } = await supabase
    .from('consent_purposes')
    .select('is_required')
    .eq('code', purpose_code)
    .single()

  if (purposeError) {
    return Response.json({ error: purposeError.message }, { status: 400 })
  }

  if (purpose.is_required) {
    return Response.json({ error: 'Required consents cannot be withdrawn' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const { ip, userAgent } = clientMeta(request)

  const { error: saveError } = await savePatientConsent(supabase, {
    patient_id: user.id,
    purpose_code,
    framework_id,
    granted: false,
    granted_at: null,
    withdrawn_at: now,
    ip_address: ip,
    user_agent: userAgent,
  })

  if (saveError) {
    return Response.json({ error: saveError }, { status: 500 })
  }

  const { error: auditError } = await adminClient.from('consent_audit_log').insert({
    patient_id: user.id,
    purpose_code,
    action: 'withdrawn',
    actor_id: user.id,
    metadata: { framework_id, source: 'patient_settings' },
  })

  if (auditError) {
    return Response.json({ error: auditError.message }, { status: 500 })
  }

  return Response.json({ ok: true, purpose_code })
}
