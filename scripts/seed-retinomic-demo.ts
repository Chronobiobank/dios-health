/**
 * Retinomic demo patients — FREE_SCREENING + PREMIUM_VERIFICATION
 *
 * Run (requires .env.local with Supabase service role):
 *   npm run seed:retinomic-demo
 *
 * Or:
 *   npx tsx --env-file=.env.local scripts/seed-retinomic-demo.ts
 */
import { createAdminClient } from '../lib/supabase/admin'
import { seedRetinomicPatientRecord } from '../lib/auth/seed-retinomic-patient'
import { syncRetinomicPatientState } from '../lib/retinomic/sync-tier'

const FREE_EMAIL = process.env.DEMO_FREE_EMAIL ?? 'demo-free@dios.health'
const PREMIUM_EMAIL = process.env.DEMO_PREMIUM_EMAIL ?? 'demo-premium@dios.health'
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD ?? 'DiosDemo2026!'
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

type DemoProfile = {
  email: string
  firstName: string
  familyName: string
  tierLabel: string
}

const DEMO_PROFILES: DemoProfile[] = [
  { email: FREE_EMAIL, firstName: 'Demo', familyName: 'Free', tierLabel: 'FREE_SCREENING' },
  { email: PREMIUM_EMAIL, firstName: 'Demo', familyName: 'Premium', tierLabel: 'PREMIUM_VERIFICATION' },
]

const ONBOARDING = {
  irisPigment: 'LIGHT' as const,
  skinITA: 42,
  lat: -36.8485,
  lng: 174.7633,
}

async function findUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string
): Promise<string | null> {
  let page = 1
  const perPage = 200

  while (page <= 25) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw new Error(`listUsers: ${error.message}`)

    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (match) return match.id

    if (data.users.length < perPage) break
    page += 1
  }

  return null
}

async function getOrCreateUserId(
  admin: ReturnType<typeof createAdminClient>,
  profile: DemoProfile
): Promise<string> {
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: profile.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      first_name: profile.firstName,
      family_name: profile.familyName,
    },
  })

  if (!createError && created.user) {
    return created.user.id
  }

  const existingId = await findUserIdByEmail(admin, profile.email)
  if (existingId) return existingId

  throw new Error(
    `Could not create or find user ${profile.email}: ${createError?.message ?? 'unknown error'}`
  )
}

async function seedPremiumStreams(admin: ReturnType<typeof createAdminClient>, patientId: string) {
  const reportDate = new Date().toISOString().slice(0, 10)

  const { count: bloodCount } = await admin
    .from('blood_circadian_panels')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', patientId)
    .eq('lab_source', 'demo_seed')

  if (!bloodCount) {
    const { error: insertBloodError } = await admin.from('blood_circadian_panels').insert({
      patient_id: patientId,
      lab_source: 'demo_seed',
      vitamin_d3_nmoll: 142,
      vitamin_b5_umoll: 1.8,
      raw_results: { source: 'seed-retinomic-demo' },
      algorithm_version: 'demo_v1',
    })
    if (insertBloodError) {
      throw new Error(`blood panel: ${insertBloodError.message}`)
    }
  }

  const nightPayload = {
    patient_id: patientId,
    report_date: reportDate,
    tst_minutes: 392,
    rem_sleep_efficiency_pct: 86,
    micro_arousals_count: 4,
    min_spo2: 89,
    rem_delay_flag: false,
    high_sympathetic_flag: false,
    webhook_source: 'demo_seed',
    webhook_received_at: new Date().toISOString(),
    algorithm_version: 'demo_v1',
  }

  const { data: existingNight } = await admin
    .from('tiptraq_nights')
    .select('id')
    .eq('patient_id', patientId)
    .eq('report_date', reportDate)
    .maybeSingle<{ id: string }>()

  if (existingNight) {
    const { error } = await admin.from('tiptraq_nights').update(nightPayload).eq('id', existingNight.id)
    if (error) throw new Error(`tiptraq update: ${error.message}`)
  } else {
    const { error } = await admin.from('tiptraq_nights').insert(nightPayload)
    if (error) throw new Error(`tiptraq insert: ${error.message}`)
  }

  const { tier, error: syncError } = await syncRetinomicPatientState(admin, patientId)
  if (syncError) throw new Error(`tier sync: ${syncError}`)
  return tier
}

function printWebhookCurlExamples(premiumUserId: string) {
  const silotonSecret = process.env.SILOTON_WEBHOOK_SECRET ?? 'change-me-siloton'
  const tiptraqSecret = process.env.TIPTRAQ_WEBHOOK_SECRET ?? 'change-me-tiptraq'

  console.log('\n── Webhook smoke tests (dev server: npm run dev) ──\n')
  console.log(`curl -X POST ${APP_ORIGIN}/api/hardware/siloton/webhook \\
  -H "Content-Type: application/json" \\
  -H "x-webhook-secret: ${silotonSecret}" \\
  -d '{"userId":"${premiumUserId}","irisPigment":"LIGHT","skinITA":42,"gclIplThicknessMicrons":{"leftEye":78.2,"rightEye":79.1}}'`)

  console.log(`\ncurl -X POST ${APP_ORIGIN}/api/telemetry/tiptraq \\
  -H "Content-Type: application/json" \\
  -H "x-webhook-secret: ${tiptraqSecret}" \\
  -d '{"userId":"${premiumUserId}","totalSleepTime":392,"remSleepEfficiencyPercent":86,"microArousalsCount":4,"overnightSpO2Min":89}'`)
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
        'Copy .env.example → .env.local and fill in Supabase credentials.'
    )
    process.exit(1)
  }

  const admin = createAdminClient()
  const results: { email: string; userId: string; tier: string }[] = []

  for (const profile of DEMO_PROFILES) {
    const userId = await getOrCreateUserId(admin, profile)
    const { error: seedError } = await seedRetinomicPatientRecord(admin, {
      userId,
      email: profile.email,
      firstName: profile.firstName,
      familyName: profile.familyName,
      ...ONBOARDING,
    })
    if (seedError) throw new Error(`${profile.email}: ${seedError}`)

    let tier = 'FREE_SCREENING'
    if (profile.tierLabel === 'PREMIUM_VERIFICATION') {
      tier = await seedPremiumStreams(admin, userId)
    }

    results.push({ email: profile.email, userId, tier })
  }

  console.log('Retinomic demo seed complete:\n')
  for (const row of results) {
    console.log(`  ${row.email}`)
    console.log(`    userId: ${row.userId}`)
    console.log(`    tier:   ${row.tier}`)
    console.log(`    sign-in: ${row.email} / ${DEMO_PASSWORD}\n`)
  }

  const premium = results.find((r) => r.email === PREMIUM_EMAIL)
  if (premium) {
    printWebhookCurlExamples(premium.userId)
  }

  console.log('\nPublic UI preview: /how-it-works  ·  Signed-in dashboard: /dashboard')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
