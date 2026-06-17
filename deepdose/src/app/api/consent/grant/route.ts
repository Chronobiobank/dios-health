import { createClient } from '@/lib/supabase/server'
import type { ConsentGrantInput } from '@/lib/consent/dynamic-consent'
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

  let body: { framework_id?: string; grants?: ConsentGrantInput[] }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { framework_id, grants } = body
  if (!framework_id || !grants?.length) {
    return Response.json({ error: 'framework_id and grants are required' }, { status: 400 })
  }

  const { ip, userAgent } = clientMeta(request)
  const now = new Date().toISOString()
  const results: { purpose_code: string; granted: boolean }[] = []

  for (const grant of grants) {
    const row = {
      patient_id: user.id,
      purpose_code: grant.purpose_code,
      framework_id,
      granted: grant.granted,
      granted_at: grant.granted ? now : null,
      withdrawn_at: grant.granted ? null : now,
      ip_address: ip,
      user_agent: userAgent,
    }

    const { error: saveError } = await savePatientConsent(supabase, row)

    if (saveError) {
      return Response.json({ error: saveError, purpose_code: grant.purpose_code }, { status: 500 })
    }

    const { error: auditError } = await adminClient.from('consent_audit_log').insert({
      patient_id: user.id,
      purpose_code: grant.purpose_code,
      action: grant.granted ? 'granted' : 'withdrawn',
      actor_id: user.id,
      metadata: { framework_id, source: 'onboarding' },
    })

    if (auditError) {
      return Response.json({ error: auditError.message, purpose_code: grant.purpose_code }, { status: 500 })
    }

    results.push({ purpose_code: grant.purpose_code, granted: grant.granted })
  }

  return Response.json({ ok: true, results })
}
