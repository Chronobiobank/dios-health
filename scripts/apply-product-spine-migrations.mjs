import { createClient } from '@supabase/supabase-js'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  const env = {}
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    env[match[1].trim()] = value
  }
  return env
}

function readAccessToken() {
  const fromEnv = process.env.SUPABASE_ACCESS_TOKEN
  if (fromEnv) return fromEnv

  const candidates = [
    resolve(process.env.APPDATA ?? '', 'supabase', 'access-token'),
    resolve(process.env.USERPROFILE ?? '', '.supabase', 'access-token'),
  ]

  for (const path of candidates) {
    if (existsSync(path)) {
      const token = readFileSync(path, 'utf8').trim()
      if (token) return token
    }
  }

  return null
}

async function tableExists(supabase, table) {
  const { error } = await supabase.from(table).select('*', { head: true, count: 'exact' })
  if (!error) return true
  if (error.code === '42P01' || error.message?.includes('does not exist')) return false
  throw new Error(`${table}: ${error.message}`)
}

async function runSql(token, projectRef, query) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`SQL failed (${response.status}): ${text}`)
  }

  return text
}

async function main() {
  const env = loadEnvFile('.env.local')
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }

  const projectRef = url.replace('https://', '').split('.')[0]
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const checks = {
    fulfillment_orders: await tableExists(supabase, 'fulfillment_orders'),
    demo_requests: await tableExists(supabase, 'demo_requests'),
    patient_protocols: await tableExists(supabase, 'patient_protocols'),
    dose_events_product: false,
  }

  const { error: doseError } = await supabase
    .from('dose_events')
    .select('medication_name', { head: true, count: 'exact' })

  checks.dose_events_product = !doseError

  console.log('Remote schema status:')
  for (const [table, exists] of Object.entries(checks)) {
    console.log(`  ${table}: ${exists ? 'present' : 'missing'}`)
  }

  const migrations = []
  if (!checks.fulfillment_orders) migrations.push('031_protocol_fulfillment.sql')
  if (!checks.demo_requests || !checks.patient_protocols || !checks.dose_events_product) {
    migrations.push('032_product_spine.sql')
  }

  if (migrations.length === 0) {
    console.log('All target tables already exist. Nothing to apply.')
    return
  }

  const token = readAccessToken()
  if (!token) {
    throw new Error(
      'No SUPABASE_ACCESS_TOKEN found. Add it to .env.local or run `npx supabase login`, then retry.'
    )
  }

  for (const file of migrations) {
    const sql = readFileSync(resolve('supabase/migrations', file), 'utf8')
    console.log(`Applying ${file}...`)
    await runSql(token, projectRef, sql)
    console.log(`Applied ${file}`)
  }

  console.log('Migrations complete.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
