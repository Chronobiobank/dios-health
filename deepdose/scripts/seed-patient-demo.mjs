// Seed a fully onboarded demo patient for UX testing (consent, chronotype,
// medications, dose dash). Idempotent: safe to re-run.
//
//   node --env-file=.env.local scripts/seed-patient-demo.mjs
//
// Uses the service-role client (bypasses RLS). Never run against a database
// holding real patient data — this inserts synthetic records only.

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const PATIENT_EMAIL = 'patient-demo@deepdose.org'
const PATIENT_PASSWORD = 'DemoPatient!2026'
const CLINICIAN_EMAIL = 'clinician-demo@deepdose.org'

const CHRONOTYPE = {
  msf_sc: 3.25,
  sjl_hours: 0.8,
  chronotype_cat: 'intermediate',
}

const DEMO_MEDS = [
  { code: 'atorvastatin', dose_mg: 20, current_timing: '20:00:00' },
  { code: 'ramipril', dose_mg: 5, current_timing: '21:00:00' },
  { code: 'metformin', dose_mg: 500, current_timing: '07:30:00' },
]

const TIPTRAQ_BASELINE_NIGHTS = 3
const TIPTRAQ_REVIEW_INTERVAL_DAYS = 90

/** Sean James canonical block — mirrors src/lib/clinical/tiptraq/sean-james-fixture.ts */
const DEMO_TIPTRAQ_NIGHTS = [
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

async function ensureAuthUser(email, password, displayName) {
  let user = await findUserByEmail(email)
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    })
    if (error) throw error
    user = data.user
    console.log('Created user:', email)
  } else {
    console.log('Reusing user:', email)
  }
  return user
}

function sleepNightTimestamps(daysAgo) {
  const onset = new Date()
  onset.setDate(onset.getDate() - daysAgo)
  onset.setHours(23, 15, 0, 0)
  const wake = new Date(onset)
  wake.setDate(wake.getDate() + 1)
  wake.setHours(7, 30, 0, 0)
  return {
    sleep_onset_timestamp: onset.toISOString(),
    wake_timestamp: wake.toISOString(),
  }
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
  const proxyDlmo = proxyDlmoFromOnset(input.sleep_onset)
  const remLat = remLatencyMinutes(input.sleep_onset, input.first_rem_onset)
  return {
    ahi_severity: ahiSeverity(input.ahi),
    proxy_dlmo_time: proxyDlmo,
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

function nextQuarterlyReviewFrom(iso) {
  const d = new Date(iso)
  d.setDate(d.getDate() + TIPTRAQ_REVIEW_INTERVAL_DAYS)
  return d.toISOString()
}

async function seedTipTraqBlock(patientId, clinicianId) {
  const completedAt = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  let { data: assessment } = await admin
    .from('tiptraq_assessments')
    .select('id, nights_recorded, baseline_completed_at')
    .eq('patient_id', patientId)
    .eq('clinician_id', clinicianId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!assessment) {
    const { data, error } = await admin
      .from('tiptraq_assessments')
      .insert({
        patient_id: patientId,
        clinician_id: clinicianId,
        status: 'baseline_complete',
        nights_recorded: TIPTRAQ_BASELINE_NIGHTS,
        nights_required: TIPTRAQ_BASELINE_NIGHTS,
        baseline_completed_at: completedAt,
        next_review_at: nextQuarterlyReviewFrom(completedAt),
        metabolic_alert_triggered: false,
      })
      .select('id, nights_recorded, baseline_completed_at')
      .single()
    if (error) throw error
    assessment = data
    console.log('TipTraQ assessment created.')
  }

  let nightsInserted = 0
  for (const night of DEMO_TIPTRAQ_NIGHTS) {
    const { data: existing } = await admin
      .from('tiptraq_nights')
      .select('id')
      .eq('patient_id', patientId)
      .eq('report_date', night.report_date)
      .maybeSingle()

    if (existing) continue

    const enriched = enrichTipTraqNight(night)
    const { error } = await admin.from('tiptraq_nights').insert({
      patient_id: patientId,
      clinician_id: clinicianId,
      assessment_id: assessment.id,
      report_date: night.report_date,
      night_index: night.night_index,
      day_type: night.day_type,
      sleep_onset: night.sleep_onset,
      sleep_offset: night.sleep_offset,
      sleep_latency_minutes: night.sleep_latency_minutes,
      tst_minutes: night.tst_minutes,
      waso_minutes: night.waso_minutes,
      sleep_efficiency_pct: night.sleep_efficiency_pct,
      rem_duration_minutes: night.rem_duration_minutes,
      rem_pct_tst: night.rem_pct_tst,
      first_rem_onset: night.first_rem_onset,
      ahi: night.ahi,
      ahi_severity: enriched.ahi_severity,
      min_spo2: night.min_spo2,
      mean_pr: night.mean_pr,
      min_pr: night.min_pr,
      sns_pct: night.sns_pct,
      pns_pct: night.pns_pct,
      hypoxic_burden: night.hypoxic_burden,
      signal_quality_pct: night.signal_quality_pct,
      proxy_dlmo_time: enriched.proxy_dlmo_time,
      confidence_score: enriched.confidence_score,
      confidence_label: enriched.confidence_label,
      chronotype_signal: enriched.chronotype_signal,
      apnea_confound_flag: enriched.apnea_confound_flag,
      high_sympathetic_flag: enriched.high_sympathetic_flag,
      rem_delay_flag: enriched.rem_delay_flag,
    })
    if (error) throw error
    nightsInserted += 1
  }

  const { count: nightCount } = await admin
    .from('tiptraq_nights')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', patientId)

  const nights = nightCount ?? 0
  const blockComplete = nights >= TIPTRAQ_BASELINE_NIGHTS
  const baselineAt = assessment.baseline_completed_at ?? (blockComplete ? completedAt : null)

  await admin
    .from('tiptraq_assessments')
    .update({
      nights_recorded: Math.min(nights, TIPTRAQ_BASELINE_NIGHTS),
      status: blockComplete ? 'baseline_complete' : 'baseline_in_progress',
      baseline_completed_at: blockComplete ? baselineAt : null,
      next_review_at: blockComplete ? nextQuarterlyReviewFrom(baselineAt ?? completedAt) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', assessment.id)

  if (blockComplete) {
    await admin.from('wearable_connections').upsert(
      {
        patient_id: patientId,
        provider: 'tiptraq',
        connected_at: baselineAt ?? completedAt,
        last_sync_at: baselineAt ?? completedAt,
        sync_status: 'ok',
      },
      { onConflict: 'patient_id,provider' }
    )

    await admin
      .from('patient_profiles')
      .update({ is_premium_tier: true })
      .eq('id', patientId)

    const clinicalDlmo = proxyDlmoFromOnset('00:36')
    const { data: existingEstimate } = await admin
      .from('dlmo_estimates')
      .select('id')
      .eq('patient_id', patientId)
      .eq('method', 'tiptraq_l1')
      .limit(1)
      .maybeSingle()

    if (!existingEstimate) {
      await admin.from('dlmo_estimates').insert({
        patient_id: patientId,
        method: 'tiptraq_l1',
        dlmo_time: clinicalDlmo,
        confidence: 0.88,
        phase_offset: -0.25,
        measured_at: baselineAt ?? completedAt,
      })
    }
  }

  if (nightsInserted > 0) {
    console.log(`TipTraQ: inserted ${nightsInserted} night(s).`)
  }
  console.log(
    blockComplete
      ? `TipTraQ: ${nights}-night clinical block complete · premium tier · anchor ~${proxyDlmoFromOnset('00:36')}.`
      : `TipTraQ: ${nights}/${TIPTRAQ_BASELINE_NIGHTS} nights on file.`
  )
}

async function main() {
  const user = await ensureAuthUser(PATIENT_EMAIL, PATIENT_PASSWORD, 'Alex Demo')

  await admin.from('user_profiles').upsert({
    id: user.id,
    tier: 'patient',
    display_name: 'Alex Demo',
  })

  const now = new Date()
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()

  await admin.from('patient_profiles').upsert({
    id: user.id,
    device_alert_triggered: false,
    last_device_sync_at: sixHoursAgo,
    reminders_enabled: true,
    onboarding_meds_completed_at: now.toISOString(),
  })

  const { data: framework } = await admin
    .from('consent_frameworks')
    .select('id')
    .eq('is_current', true)
    .maybeSingle()

  if (!framework) {
    console.warn('No consent framework found — run migrations first.')
  } else {
    for (const purposeCode of ['clinical_care']) {
      const { data: existing } = await admin
        .from('patient_consents')
        .select('id')
        .eq('patient_id', user.id)
        .eq('purpose_code', purposeCode)
        .maybeSingle()

      if (!existing) {
        await admin.from('patient_consents').insert({
          patient_id: user.id,
          purpose_code: purposeCode,
          framework_id: framework.id,
          granted: true,
          granted_at: now.toISOString(),
        })
      }
    }
    console.log('Consent: clinical_care granted.')
  }

  const { data: existingChrono } = await admin
    .from('chronotype_profiles')
    .select('id')
    .eq('patient_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!existingChrono) {
    await admin.from('chronotype_profiles').insert({
      patient_id: user.id,
      mctq_version: 'standard',
      ...CHRONOTYPE,
    })
    console.log('Chronotype profile created.')
  }

  const today = now.toISOString().slice(0, 10)

  const { data: activeMeds } = await admin
    .from('patient_medications')
    .select('medication_code')
    .eq('patient_id', user.id)
    .eq('is_active', true)

  const activeCodes = new Set((activeMeds ?? []).map((m) => m.medication_code))

  for (const med of DEMO_MEDS) {
    if (activeCodes.has(med.code)) continue
    const { error } = await admin.from('patient_medications').insert({
      patient_id: user.id,
      medication_code: med.code,
      dose_mg: med.dose_mg,
      current_timing: med.current_timing,
      started_at: today,
      is_active: true,
    })
    if (error) throw error
  }
  console.log('Medications: atorvastatin, ramipril, metformin active.')

  const { count: scoreCount } = await admin
    .from('circadian_scores')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', user.id)

  if ((scoreCount ?? 0) === 0) {
    await admin.from('circadian_scores').insert({
      patient_id: user.id,
      score: 74,
      components: {
        dlmoEstimateHours: 20.75,
        sjlHours: CHRONOTYPE.sjl_hours,
        chronotypeCat: CHRONOTYPE.chronotype_cat,
        phaseOffsetMinutes: -15,
      },
      version: 'v1',
    })
    console.log('Circadian score snapshot saved.')
  }

  await admin.from('wearable_connections').upsert(
    {
      patient_id: user.id,
      provider: 'oura',
      sync_status: 'ok',
      last_sync_at: sixHoursAgo,
      connected_at: sixHoursAgo,
    },
    { onConflict: 'patient_id,provider' }
  )

  for (let daysAgo = 1; daysAgo <= 5; daysAgo += 1) {
    const externalId = `demo-night-${daysAgo}`
    const { data: existingLog } = await admin
      .from('wearable_sleep_logs')
      .select('id')
      .eq('patient_id', user.id)
      .eq('provider', 'oura')
      .eq('external_id', externalId)
      .maybeSingle()

    if (existingLog) continue

    const { sleep_onset_timestamp, wake_timestamp } = sleepNightTimestamps(daysAgo)
    await admin.from('wearable_sleep_logs').insert({
      patient_id: user.id,
      provider: 'oura',
      external_id: externalId,
      sleep_onset_timestamp,
      wake_timestamp,
      deep_sleep_duration_minutes: 72 + daysAgo * 3,
      rem_duration_minutes: 88 + daysAgo * 2,
    })
  }
  console.log('Wearable: Oura connection + 5 sleep nights.')

  const clinician = await findUserByEmail(CLINICIAN_EMAIL)
  if (clinician) {
    const { data: existingCare } = await admin
      .from('care_relationships')
      .select('id')
      .eq('clinician_id', clinician.id)
      .eq('patient_id', user.id)
      .maybeSingle()

    if (!existingCare) {
      const { data: membership } = await admin
        .from('org_members')
        .select('org_id')
        .eq('user_id', clinician.id)
        .limit(1)
        .maybeSingle()

      await admin.from('care_relationships').insert({
        clinician_id: clinician.id,
        patient_id: user.id,
        org_id: membership?.org_id ?? null,
        relationship: 'gp',
        active: true,
      })
      console.log('Linked to clinician demo account for care-sharing tests.')
    }

    await seedTipTraqBlock(user.id, clinician.id)
  } else {
    console.log('Clinician demo not found — run seed-clinician-demo.mjs to link care + TipTraQ block.')
  }

  console.log('\nDemo ready. Sign in at /login with:')
  console.log('  email:    ' + PATIENT_EMAIL)
  console.log('  password: ' + PATIENT_PASSWORD)
  console.log('Then open /patient/dashboard — dose dash with 3 medicines + TipTraQ-validated anchor.')
  console.log('Expand "How this is calculated" to see the full estimate → validate ladder.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
