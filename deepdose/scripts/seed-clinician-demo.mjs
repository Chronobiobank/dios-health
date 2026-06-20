// Seed a demo clinician + linked panel patients so the clinical triage dashboard
// renders populated. Idempotent: safe to re-run.
//
//   node --env-file=.env.local scripts/seed-clinician-demo.mjs
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

const CLINICIAN_EMAIL = 'clinician-demo@deepdose.org'
const CLINICIAN_PASSWORD = 'DemoClinical!2026'
const ORG_NAME = 'Riverside GP (Demo)'

const DEMO_PATIENTS = [
  {
    email: 'demo.panel.urgent@deepdose.org',
    displayName: 'Maya Okonkwo',
    deviceAlert: true,
    isPremium: true,
    chronotype: { msf_sc: 23.5, sjl_hours: 0.6, chronotype_cat: 'intermediate' },
  },
  {
    email: 'demo.panel.review@deepdose.org',
    displayName: 'James Reid',
    deviceAlert: false,
    isPremium: false,
    chronotype: { msf_sc: 10.0, sjl_hours: 4.0, chronotype_cat: 'extreme_late' },
  },
  {
    email: 'demo.panel.track@deepdose.org',
    displayName: 'Priya Sharma',
    deviceAlert: false,
    isPremium: false,
    chronotype: { msf_sc: 23.5, sjl_hours: 0.4, chronotype_cat: 'intermediate' },
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

async function main() {
  const clinician = await ensureAuthUser(
    CLINICIAN_EMAIL,
    CLINICIAN_PASSWORD,
    'Dr Sam Clarke (Demo)'
  )

  await admin.from('user_profiles').upsert({
    id: clinician.id,
    tier: 'clinician',
    display_name: 'Dr Sam Clarke (Demo)',
  })

  let { data: org } = await admin
    .from('organisations')
    .select('id')
    .eq('name', ORG_NAME)
    .maybeSingle()

  if (!org) {
    const { data, error } = await admin
      .from('organisations')
      .insert({
        name: ORG_NAME,
        org_type: 'gp_practice',
        tier: 'clinical',
        contract_start: '2026-01-01',
      })
      .select('id')
      .single()
    if (error) throw error
    org = data
    console.log('Created organisation:', org.id)
  } else {
    console.log('Reusing organisation:', org.id)
  }

  const { data: member } = await admin
    .from('org_members')
    .select('id')
    .eq('org_id', org.id)
    .eq('user_id', clinician.id)
    .maybeSingle()

  if (!member) {
    await admin.from('org_members').insert({
      org_id: org.id,
      user_id: clinician.id,
      role: 'clinician',
    })
    console.log('Linked clinician to org.')
  }

  const { data: framework } = await admin
    .from('consent_frameworks')
    .select('id')
    .eq('is_current', true)
    .maybeSingle()

  if (!framework) {
    console.warn('No current consent framework — patient RLS may hide panel rows until consent is seeded.')
  }

  for (const patient of DEMO_PATIENTS) {
    const user = await ensureAuthUser(patient.email, 'DemoPatient!2026', patient.displayName)

    await admin.from('user_profiles').upsert({
      id: user.id,
      tier: 'patient',
      display_name: patient.displayName,
    })

    await admin.from('patient_profiles').upsert({
      id: user.id,
      is_premium_tier: patient.isPremium,
      device_alert_triggered: patient.deviceAlert,
      last_device_sync_at: patient.deviceAlert
        ? null
        : new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    })

    if (framework) {
      const { data: existingConsent } = await admin
        .from('patient_consents')
        .select('id')
        .eq('patient_id', user.id)
        .eq('purpose_code', 'clinical_care')
        .maybeSingle()

      if (!existingConsent) {
        await admin.from('patient_consents').insert({
          patient_id: user.id,
          purpose_code: 'clinical_care',
          framework_id: framework.id,
          granted: true,
          granted_at: new Date().toISOString(),
        })
      }
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
        ...patient.chronotype,
      })
    }

    const { data: existingCare } = await admin
      .from('care_relationships')
      .select('id')
      .eq('clinician_id', clinician.id)
      .eq('patient_id', user.id)
      .maybeSingle()

    if (!existingCare) {
      await admin.from('care_relationships').insert({
        clinician_id: clinician.id,
        patient_id: user.id,
        org_id: org.id,
        relationship: 'gp',
        active: true,
      })
    }
  }

  console.log('\nDemo ready. Sign in at /login?next=/clinical/dashboard with:')
  console.log('  email:    ' + CLINICIAN_EMAIL)
  console.log('  password: ' + CLINICIAN_PASSWORD)
  console.log('Then open /clinical/dashboard — expect 3 linked panel patients.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
