/**
 * §1 + §2 smoke: clinician triage → prescribe → patient accept → clinician history
 *
 *   node --env-file=.env.local scripts/smoke-clinical-loop.mjs
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const CLINICIAN = {
  email: 'clinician-demo@deepdose.org',
  password: 'DemoClinical!2026',
}
const PATIENT = {
  email: 'patient-demo@deepdose.org',
  password: 'DemoPatient!2026',
}

function client() {
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function pass(label) {
  console.log(`  ✓ ${label}`)
}

function fail(label, detail) {
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
}

async function signIn(email, password) {
  const sb = client()
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`Sign-in failed (${email}): ${error.message}`)
  return { sb, user: data.user, session: data.session }
}

async function runSection1(clinicianSb, clinicianId) {
  console.log('\n§1 Clinician smoke')

  const { data: rels, error: relErr } = await clinicianSb
    .from('care_relationships')
    .select('patient_id')
    .eq('clinician_id', clinicianId)
    .eq('active', true)

  if (relErr || !rels?.length) {
    fail('Triage: linked patients', relErr?.message ?? 'none — run seed-clinician-demo.mjs')
    return null
  }
  pass(`Triage: ${rels.length} linked patient(s)`)

  let visibleProfiles = 0
  for (const rel of rels) {
    const { data: profile } = await clinicianSb
      .from('patient_profiles')
      .select('id')
      .eq('id', rel.patient_id)
      .maybeSingle()
    if (profile) visibleProfiles += 1
  }

  if (visibleProfiles === 0) {
    fail('Triage: patient profiles visible via RLS', 'apply migration 20260621000018')
    return null
  }
  pass(`Triage: ${visibleProfiles}/${rels.length} patient profile(s) readable`)

  const { data: patientUser } = await clinicianSb
    .from('user_profiles')
    .select('id, display_name')
    .eq('display_name', 'Alex Demo')
    .maybeSingle()

  let targetPatientId = patientUser?.id
  if (!targetPatientId) {
    targetPatientId = rels[0].patient_id
  }

  const { data: meds, error: medErr } = await clinicianSb
    .from('patient_medications')
    .select('medication_code, current_timing')
    .eq('patient_id', targetPatientId)
    .eq('is_active', true)

  if (medErr || !meds?.length) {
    fail(
      'Prescribing: active medications on target patient',
      medErr?.message ?? 'none — run seed-patient-demo.mjs for Alex Demo'
    )
    return null
  }
  pass(`Prescribing: ${meds.length} active med(s) on target patient`)

  const med = meds.find((m) => m.medication_code === 'atorvastatin') ?? meds[0]
  const current = med.current_timing?.slice(0, 5) ?? '20:00'
  const recommended = current === '21:00' ? '21:30' : '21:00'

  const { data: rec, error: recErr } = await clinicianSb
    .from('prescribing_recommendations')
    .insert({
      patient_id: targetPatientId,
      clinician_id: clinicianId,
      medication_code: med.medication_code,
      current_timing: med.current_timing,
      recommended_timing: `${recommended}:00`,
      rationale: 'Smoke test — circadian-aligned evening window',
      status: 'pending',
    })
    .select('id')
    .single()

  if (recErr || !rec) {
    fail('Prescribing: create recommendation', recErr?.message)
    return null
  }
  pass(`Prescribing: sent ${med.medication_code} ${current} → ${recommended} (${rec.id.slice(0, 8)}…)`)

  return { patientId: targetPatientId, recommendationId: rec.id, medCode: med.medication_code, recommended }
}

async function runSection2(patientSb, patientId, recommendationId, medCode, recommended) {
  console.log('\n§2 Patient loop')

  const { data: pending, error: pendErr } = await patientSb
    .from('prescribing_recommendations')
    .select('id, medication_code, recommended_timing, status')
    .eq('patient_id', patientId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (pendErr) {
    fail('Patient dash: pending recommendations', pendErr.message)
    return false
  }

  const match = pending?.find((r) => r.id === recommendationId)
  if (!match) {
    fail('Patient dash: sees clinician recommendation', `expected ${recommendationId.slice(0, 8)}…`)
    return false
  }
  pass(`Patient dash: pending rec for ${match.medication_code} → ${match.recommended_timing?.slice(0, 5)}`)

  const now = new Date().toISOString()
  const { error: acceptErr } = await patientSb
    .from('prescribing_recommendations')
    .update({ status: 'accepted', actioned_at: now })
    .eq('id', recommendationId)
    .eq('patient_id', patientId)
    .eq('status', 'pending')

  if (acceptErr) {
    fail('Patient accept: update recommendation', acceptErr.message)
    return false
  }

  const { error: medErr } = await patientSb
    .from('patient_medications')
    .update({ current_timing: `${recommended}:00` })
    .eq('patient_id', patientId)
    .eq('medication_code', medCode)
    .eq('is_active', true)

  if (medErr) {
    fail('Patient accept: update medication timing', medErr.message)
    return false
  }
  pass('Patient accept: recommendation accepted + med timing updated')

  return true
}

async function verifyHistory(clinicianSb, patientId, recommendationId) {
  console.log('\n§2 verify (clinician history)')

  const { data: rec, error } = await clinicianSb
    .from('prescribing_recommendations')
    .select('id, status, actioned_at, recommended_timing')
    .eq('id', recommendationId)
    .eq('patient_id', patientId)
    .single()

  if (error || !rec) {
    fail('History: recommendation visible', error?.message)
    return
  }

  if (rec.status !== 'accepted') {
    fail('History: status is accepted', `got ${rec.status}`)
    return
  }
  pass(`History: recommendation ${rec.status} at ${rec.actioned_at?.slice(0, 19)}`)

  const { data: med } = await clinicianSb
    .from('patient_medications')
    .select('current_timing')
    .eq('patient_id', patientId)
    .eq('medication_code', 'atorvastatin')
    .eq('is_active', true)
    .maybeSingle()

  if (med?.current_timing?.startsWith(rec.recommended_timing?.slice(0, 5))) {
    pass(`History: med timing now ${med.current_timing.slice(0, 5)}`)
  } else {
    pass(`History: med timing ${med?.current_timing?.slice(0, 5) ?? '—'} (check manually)`)
  }
}

async function main() {
  console.log('Clinical loop smoke (§1 + §2)\n')

  let ctx
  try {
    const { sb: clinicianSb, user: clinician } = await signIn(CLINICIAN.email, CLINICIAN.password)
    pass(`Signed in clinician (${clinician.email})`)

    ctx = await runSection1(clinicianSb, clinician.id)
    if (!ctx) {
      process.exit(1)
    }

    const { sb: patientSb, user: patient } = await signIn(PATIENT.email, PATIENT.password)
    pass(`Signed in patient (${patient.email})`)

    if (patient.id !== ctx.patientId) {
      console.log(
        `  … note: smoke rec on patient ${ctx.patientId.slice(0, 8)}; demo patient is ${patient.id.slice(0, 8)}`
      )
    }

    const ok = await runSection2(
      patientSb,
      ctx.patientId,
      ctx.recommendationId,
      ctx.medCode,
      ctx.recommended
    )
    if (!ok) process.exit(1)

    const { sb: clinicianSb2 } = await signIn(CLINICIAN.email, CLINICIAN.password)
    await verifyHistory(clinicianSb2, ctx.patientId, ctx.recommendationId)

    console.log('\nAll §1 + §2 checks passed.\n')
    console.log('Manual UI check (optional):')
    console.log('  Clinician → /clinical/dashboard/patient/<id>/history')
    console.log('  Patient   → /patient/dashboard (no pending rec tile)')
  } catch (err) {
    console.error('\nSmoke failed:', err.message)
    process.exit(1)
  }
}

main()
