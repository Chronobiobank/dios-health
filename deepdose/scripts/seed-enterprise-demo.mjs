// Seed a demo enterprise org + license + pseudonymised Chronobiobank records so
// the enterprise dashboards render populated. Idempotent: safe to re-run.
//
//   node --env-file=.env.local scripts/seed-enterprise-demo.mjs
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

const DEMO_EMAIL = 'enterprise-demo@chronobiobank.org'
const DEMO_PASSWORD = 'DemoCohort!2026'
const ORG_NAME = 'North London ICB (Demo)'

const MEDICATIONS = [
  'atorvastatin',
  'amlodipine',
  'ramipril',
  'metformin',
  'levothyroxine',
  'sertraline',
]
const CHRONOTYPES = ['early', 'intermediate', 'late']
const AGE_BANDS = ['30-39', '40-49', '50-59', '60-69', '70-79']
const SEXES = ['female', 'male']
const OUTCOMES = [
  { outcome_type: 'bp_reading', unit: 'mmHg', min: 118, max: 152 },
  { outcome_type: 'hba1c', unit: 'mmol/mol', min: 38, max: 64 },
  { outcome_type: 'symptom_score', unit: 'pts', min: 2, max: 9 },
]

let s = 1337
function rng() {
  s = (s * 1103515245 + 12345) & 0x7fffffff
  return s / 0x7fffffff
}
function pick(arr) {
  return arr[Math.floor(rng() * arr.length)]
}
function between(min, max, dp = 0) {
  const v = min + rng() * (max - min)
  return dp === 0 ? Math.round(v) : Math.round(v * 10 ** dp) / 10 ** dp
}
function clockTime(hour, minRange = 60) {
  const m = Math.floor(rng() * minRange)
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
}

async function findUserByEmail(email) {
  // Paginate listUsers to locate an existing demo user.
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const match = data.users.find((u) => u.email === email)
    if (match) return match
    if (data.users.length < 200) break
  }
  return null
}

async function main() {
  // 1. Demo enterprise user.
  let user = await findUserByEmail(DEMO_EMAIL)
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: 'Demo Analyst' },
    })
    if (error) throw error
    user = data.user
    console.log('Created enterprise user:', user.id)
  } else {
    console.log('Reusing enterprise user:', user.id)
  }

  // 2. Tier = enterprise on the user_profile (trigger created the row on signup).
  await admin
    .from('user_profiles')
    .upsert({ id: user.id, tier: 'enterprise', display_name: 'Demo Analyst' })

  // 3. Organisation.
  let { data: org } = await admin
    .from('organisations')
    .select('id')
    .eq('name', ORG_NAME)
    .maybeSingle()
  if (!org) {
    const { data, error } = await admin
      .from('organisations')
      .insert({ name: ORG_NAME, org_type: 'icb', tier: 'enterprise', contract_start: '2026-01-01' })
      .select('id')
      .single()
    if (error) throw error
    org = data
    console.log('Created organisation:', org.id)
  } else {
    console.log('Reusing organisation:', org.id)
  }

  // 4. Membership.
  const { data: member } = await admin
    .from('org_members')
    .select('id')
    .eq('org_id', org.id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!member) {
    await admin.from('org_members').insert({ org_id: org.id, user_id: user.id, role: 'analyst' })
    console.log('Linked user to org as analyst.')
  }

  // 5. Active data license.
  const { data: license } = await admin
    .from('data_licenses')
    .select('id')
    .eq('org_id', org.id)
    .eq('license_type', 'icb_population')
    .maybeSingle()
  if (!license) {
    await admin.from('data_licenses').insert({
      org_id: org.id,
      license_type: 'icb_population',
      cohort_filter: {},
      purpose_codes: ['icb_licensing'],
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      annual_fee_gbp: 75000,
      status: 'active',
    })
    console.log('Created active ICB population license.')
  }

  // 6. Pseudonymised records — skip if already populated.
  const { count } = await admin
    .from('chronobiobank_records')
    .select('id', { count: 'exact', head: true })
  if ((count ?? 0) > 0) {
    console.log(`chronobiobank_records already has ${count} rows — skipping record seed.`)
  } else {
    const records = []
    const participants = 18
    for (let p = 0; p < participants; p += 1) {
      const cohortToken = crypto.randomUUID()
      const ageBand = pick(AGE_BANDS)
      const sex = pick(SEXES)
      const chronotype = pick(CHRONOTYPES)
      const baseHour = chronotype === 'early' ? 19 : chronotype === 'late' ? 23 : 21
      const contributions = 2 + Math.floor(rng() * 3)
      for (let c = 0; c < contributions; c += 1) {
        const withOutcome = rng() > 0.45
        const outcome = withOutcome ? pick(OUTCOMES) : null
        records.push({
          cohort_token: cohortToken,
          age_band: ageBand,
          biological_sex: sex,
          fitzpatrick_type: between(1, 6),
          chronotype_cat: chronotype,
          sjl_hours: between(0.3, 3.4, 1),
          circadian_score: between(42, 94, 1),
          medication_code: pick(MEDICATIONS),
          prior_timing: clockTime(8),
          recommended_timing: clockTime(baseHour),
          outcome_type: outcome?.outcome_type ?? null,
          outcome_value: outcome ? between(outcome.min, outcome.max, 1) : null,
          outcome_unit: outcome?.unit ?? null,
          days_to_outcome: outcome ? between(28, 120) : null,
          consent_purposes: ['icb_licensing'],
          record_date: '2026-06-15',
        })
      }
    }
    const { error } = await admin.from('chronobiobank_records').insert(records)
    if (error) throw error
    console.log(`Inserted ${records.length} pseudonymised records across ${participants} participants.`)
  }

  console.log('\nDemo ready. Sign in at /login with:')
  console.log('  email:    ' + DEMO_EMAIL)
  console.log('  password: ' + DEMO_PASSWORD)
  console.log('Then open /enterprise/dashboard')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
