/**
 * §3 TipTraQ smoke: order kit → Sean James demo nights → queue + readings
 *
 * Uses James Reid (panel demo) with a clean TipTraQ slate via service role.
 *
 *   node --env-file=.env.local scripts/smoke-clinical-tiptraq.mjs
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !anonKey || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, or SERVICE_ROLE_KEY.')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const CLINICIAN = {
  email: 'clinician-demo@deepdose.org',
  password: 'DemoClinical!2026',
}
const TARGET_PATIENT_EMAIL = 'demo.panel.review@deepdose.org'
const TARGET_PATIENT_NAME = 'James Reid'

const TIPTRAQ_BASELINE_NIGHTS = 3
const TIPTRAQ_REVIEW_INTERVAL_DAYS = 90
const ACTIVE_STATUSES = ['kit_ordered', 'baseline_in_progress', 'review_due']

const SEAN_JAMES_NIGHTS = [
  {
    report_date: '2026-05-26',
    night_index: 1,
    day_type: 'weekday',
    sleep_onset: '00:36',
    sleep_offset: '08:12',
    sleep_latency_minutes: 18,
    tst_minutes: 392,
    waso_minutes: 95,
    sleep_efficiency_pct: 86,
    rem_duration_minutes: 78,
    rem_pct_tst: 19.9,
    first_rem_onset: '02:57',
    ahi: 5.2,
    sns_pct: 72,
    pns_pct: 28,
    mean_pr: 62,
    min_pr: 48,
    min_spo2: 89,
    hypoxic_burden: 12.4,
    signal_quality_pct: 84,
  },
  {
    report_date: '2026-05-27',
    night_index: 2,
    day_type: 'weekday',
    sleep_onset: '00:42',
    sleep_offset: '08:12',
    sleep_latency_minutes: 18,
    tst_minutes: 392,
    waso_minutes: 95,
    sleep_efficiency_pct: 86,
    rem_duration_minutes: 78,
    rem_pct_tst: 19.9,
    first_rem_onset: '02:57',
    ahi: 5.6,
    sns_pct: 72,
    pns_pct: 28,
    mean_pr: 62,
    min_pr: 48,
    min_spo2: 89,
    hypoxic_burden: 12.4,
    signal_quality_pct: 84,
  },
  {
    report_date: '2026-05-28',
    night_index: 3,
    day_type: 'weekday',
    sleep_onset: '00:31',
    sleep_offset: '08:12',
    sleep_latency_minutes: 18,
    tst_minutes: 392,
    waso_minutes: 95,
    sleep_efficiency_pct: 86,
    rem_duration_minutes: 78,
    rem_pct_tst: 19.9,
    first_rem_onset: '02:57',
    ahi: 5.1,
    sns_pct: 72,
    pns_pct: 28,
    mean_pr: 62,
    min_pr: 48,
    min_spo2: 89,
    hypoxic_burden: 12.4,
    signal_quality_pct: 84,
  },
]

function pass(label) {
  console.log(`  ✓ ${label}`)
}

function fail(label, detail) {
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
}

function anonClient() {
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function signIn(email, password) {
  const sb = anonClient()
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`Sign-in failed (${email}): ${error.message}`)
  return { sb, user: data.user }
}

async function findUserByEmail(email) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const match = data.users.find((u) => u.email === email)
    if (match) return match
    if (data.users.length < 200) break
  }
  return null
}

function clockToMinutes(clock) {
  const [h, m] = clock.split(':').map(Number)
  return h * 60 + m
}

function minutesToClock(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function proxyDlmoFromOnset(sleepOnset) {
  return minutesToClock(clockToMinutes(sleepOnset) - 150)
}

function remLatencyMinutes(onset, firstRem) {
  if (!firstRem) return 0
  let onsetM = clockToMinutes(onset)
  let remM = clockToMinutes(firstRem)
  if (remM < onsetM) remM += 1440
  return remM - onsetM
}

function ahiSeverity(ahi) {
  if (ahi < 5) return 'Normal'
  if (ahi < 15) return 'Mild OSA'
  if (ahi < 30) return 'Moderate OSA'
  return 'Severe OSA'
}

function remLatencyStatus(mins) {
  if (mins <= 90) return 'green'
  if (mins <= 120) return 'amber'
  return 'red'
}

function spo2Status(minSpo2) {
  if (minSpo2 == null) return 'amber'
  if (minSpo2 >= 90) return 'green'
  if (minSpo2 >= 85) return 'amber'
  return 'red'
}

function enrichTipTraqNight(input) {
  const remLat = remLatencyMinutes(input.sleep_onset, input.first_rem_onset)
  return {
    ahi_severity: ahiSeverity(input.ahi),
    proxy_dlmo_time: proxyDlmoFromOnset(input.sleep_onset),
    confidence_score: 38,
    confidence_label: 'Single night',
    chronotype_signal:
      remLatencyStatus(remLat) === 'green' ? 'Intermediate-late' : 'Delayed / fragmented REM',
    apnea_confound_flag: input.ahi >= 15,
    high_sympathetic_flag: (input.sns_pct ?? 0) >= 70,
    rem_delay_flag: remLatencyStatus(remLat) === 'red',
    spo2_status: spo2Status(input.min_spo2),
  }
}

function assessmentStatusFromNights(nightsRecorded, currentStatus) {
  if (currentStatus === 'kit_ordered' && nightsRecorded > 0) return 'baseline_in_progress'
  if (nightsRecorded >= TIPTRAQ_BASELINE_NIGHTS) return 'baseline_complete'
  return currentStatus
}

function nextQuarterlyReviewFrom(iso) {
  const d = new Date(iso)
  d.setDate(d.getDate() + TIPTRAQ_REVIEW_INTERVAL_DAYS)
  return d.toISOString()
}

async function resetTipTraqForPatient(patientId) {
  await admin.from('tiptraq_nights').delete().eq('patient_id', patientId)
  await admin.from('tiptraq_assessments').delete().eq('patient_id', patientId)
  await admin
    .from('patient_profiles')
    .update({ is_premium_tier: false })
    .eq('id', patientId)
}

async function fetchActiveQueue(clinicianSb, clinicianId) {
  const { data } = await clinicianSb
    .from('tiptraq_assessments')
    .select('*')
    .eq('clinician_id', clinicianId)
    .in('status', ACTIVE_STATUSES)
    .order('updated_at', { ascending: false })
  return data ?? []
}

async function orderKit(clinicianSb, clinicianId, patientId) {
  const { data: existing } = await clinicianSb
    .from('tiptraq_assessments')
    .select('id, status')
    .eq('patient_id', patientId)
    .eq('clinician_id', clinicianId)
    .in('status', ['kit_ordered', 'baseline_in_progress', 'baseline_complete', 'review_due'])
    .maybeSingle()

  if (existing && existing.status !== 'review_due') {
    return { ok: false, error: 'An active TipTraQ assessment already exists for this patient.' }
  }

  if (existing?.status === 'review_due') {
    const { error } = await clinicianSb
      .from('tiptraq_assessments')
      .update({
        status: 'kit_ordered',
        nights_recorded: 0,
        kit_ordered_at: new Date().toISOString(),
        baseline_completed_at: null,
        next_review_at: null,
        metabolic_alert_triggered: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
    if (error) return { ok: false, error: error.message }
    return { ok: true, id: existing.id }
  }

  const { data, error } = await clinicianSb
    .from('tiptraq_assessments')
    .insert({
      patient_id: patientId,
      clinician_id: clinicianId,
      status: 'kit_ordered',
      nights_required: TIPTRAQ_BASELINE_NIGHTS,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

async function syncAssessmentFromNights(clinicianSb, assessmentId, patientId, nightsCount) {
  const { data: assessment } = await clinicianSb
    .from('tiptraq_assessments')
    .select('*')
    .eq('id', assessmentId)
    .single()

  if (!assessment) return

  const nights = Math.min(assessment.nights_required, nightsCount)
  let status = assessmentStatusFromNights(nights, assessment.status)

  const updates = {
    nights_recorded: nights,
    status,
    updated_at: new Date().toISOString(),
  }

  if (nights >= assessment.nights_required && !assessment.baseline_completed_at) {
    const completedAt = new Date().toISOString()
    updates.baseline_completed_at = completedAt
    updates.next_review_at = nextQuarterlyReviewFrom(completedAt)
    updates.status = 'baseline_complete'
  }

  await clinicianSb.from('tiptraq_assessments').update(updates).eq('id', assessmentId)

  if (nights >= assessment.nights_required) {
    await clinicianSb
      .from('patient_profiles')
      .update({ is_premium_tier: true })
      .eq('id', patientId)
  }
}

async function insertNight(clinicianSb, clinicianId, patientId, assessmentId, input) {
  const enriched = enrichTipTraqNight(input)
  const { data, error } = await clinicianSb
    .from('tiptraq_nights')
    .insert({
      patient_id: patientId,
      clinician_id: clinicianId,
      assessment_id: assessmentId,
      report_date: input.report_date,
      night_index: input.night_index ?? null,
      day_type: input.day_type ?? null,
      sleep_onset: input.sleep_onset,
      sleep_offset: input.sleep_offset,
      sleep_latency_minutes: input.sleep_latency_minutes,
      tst_minutes: input.tst_minutes,
      waso_minutes: input.waso_minutes,
      sleep_efficiency_pct: input.sleep_efficiency_pct,
      rem_duration_minutes: input.rem_duration_minutes,
      rem_pct_tst: input.rem_pct_tst,
      first_rem_onset: input.first_rem_onset ?? null,
      ahi: input.ahi,
      ahi_severity: enriched.ahi_severity,
      min_spo2: input.min_spo2 ?? null,
      mean_pr: input.mean_pr ?? null,
      min_pr: input.min_pr ?? null,
      sns_pct: input.sns_pct ?? null,
      pns_pct: input.pns_pct ?? null,
      hypoxic_burden: input.hypoxic_burden ?? null,
      signal_quality_pct: input.signal_quality_pct ?? null,
      proxy_dlmo_time: enriched.proxy_dlmo_time,
      confidence_score: enriched.confidence_score,
      confidence_label: enriched.confidence_label,
      chronotype_signal: enriched.chronotype_signal,
      apnea_confound_flag: enriched.apnea_confound_flag,
      high_sympathetic_flag: enriched.high_sympathetic_flag,
      rem_delay_flag: enriched.rem_delay_flag,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  const { count } = await clinicianSb
    .from('tiptraq_nights')
    .select('id', { count: 'exact', head: true })
    .eq('assessment_id', assessmentId)

  await syncAssessmentFromNights(clinicianSb, assessmentId, patientId, count ?? 0)
  return { ok: true, id: data.id }
}

async function main() {
  console.log('TipTraQ smoke (§3)\n')

  const clinicianAuth = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
  const clinicianUser = clinicianAuth.data.users.find((u) => u.email === CLINICIAN.email)
  const patientUser = await findUserByEmail(TARGET_PATIENT_EMAIL)

  if (!clinicianUser || !patientUser) {
    console.error('Run seed-clinician-demo.mjs first.')
    process.exit(1)
  }

  await resetTipTraqForPatient(patientUser.id)
  pass(`Reset TipTraQ slate for ${TARGET_PATIENT_NAME}`)

  const { sb: clinicianSb, user: clinician } = await signIn(CLINICIAN.email, CLINICIAN.password)
  pass(`Signed in clinician (${CLINICIAN.email})`)

  console.log('\n§3 TipTraQ flow')

  const order = await orderKit(clinicianSb, clinician.id, patientUser.id)
  if (!order.ok) {
    fail('Order kit', order.error)
    process.exit(1)
  }
  pass(`Order kit → assessment ${order.id.slice(0, 8)}…`)

  let queue = await fetchActiveQueue(clinicianSb, clinician.id)
  const inQueue = queue.find((row) => row.patient_id === patientUser.id)
  if (!inQueue || inQueue.status !== 'kit_ordered') {
    fail('Active kits queue after order', inQueue?.status ?? 'patient not in queue')
    process.exit(1)
  }
  pass(`Active kits: ${TARGET_PATIENT_NAME} · ${inQueue.nights_recorded}/${inQueue.nights_required} nights`)

  for (const night of SEAN_JAMES_NIGHTS) {
    const result = await insertNight(
      clinicianSb,
      clinician.id,
      patientUser.id,
      order.id,
      night
    )
    if (!result.ok) {
      fail(`Insert night ${night.report_date}`, result.error)
      process.exit(1)
    }
  }
  pass('Sean James demo: 3 nights inserted')

  const { data: assessment } = await clinicianSb
    .from('tiptraq_assessments')
    .select('nights_recorded, nights_required, status, baseline_completed_at')
    .eq('id', order.id)
    .single()

  if (!assessment || assessment.nights_recorded !== 3) {
    fail('Assessment nights_recorded', `${assessment?.nights_recorded ?? 0}/3`)
    process.exit(1)
  }
  pass(`Assessment: ${assessment.nights_recorded}/${assessment.nights_required} · ${assessment.status}`)

  const { count: nightCount } = await clinicianSb
    .from('tiptraq_nights')
    .select('id', { count: 'exact', head: true })
    .eq('assessment_id', order.id)

  if ((nightCount ?? 0) !== 3) {
    fail('Readings on chart', `expected 3 nights, got ${nightCount ?? 0}`)
    process.exit(1)
  }
  pass('Readings panel: 3 nights on file')

  queue = await fetchActiveQueue(clinicianSb, clinician.id)
  const stillActive = queue.some((row) => row.patient_id === patientUser.id)
  if (stillActive) {
    pass('Active kits: patient still listed (in-progress/review state)')
  } else if (assessment.status === 'baseline_complete') {
    pass('Active kits: patient graduated (baseline complete — expected)')
  } else {
    fail('Active kits queue state', assessment.status)
    process.exit(1)
  }

  const { data: profile } = await clinicianSb
    .from('patient_profiles')
    .select('is_premium_tier')
    .eq('id', patientUser.id)
    .single()

  if (profile?.is_premium_tier) {
    pass('Premium tier badge eligible (is_premium_tier=true)')
  } else {
    fail('Premium tier after baseline', 'is_premium_tier still false')
    process.exit(1)
  }

  console.log('\nAll §3 checks passed.\n')
  console.log('Manual UI check (optional):')
  console.log(`  /clinical/dashboard/patient/${patientUser.id} → Overview readings + premium badge`)
  console.log('  /clinical/dashboard → Active kits tile')
}

main().catch((err) => {
  console.error('\nSmoke failed:', err.message)
  process.exit(1)
})
