import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=')
      return [line.slice(0, i), line.slice(i + 1)]
    })
)

const url = env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const expectedRef = 'yavqgklsfmawhrqvuvuf'

function jwtRef(key) {
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString())
    return payload.ref ?? null
  } catch {
    return null
  }
}

const ref = jwtRef(anonKey)
const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` }

const health = await fetch(`${url}/auth/v1/health`, { headers })
const tables = ['medications', 'consent_frameworks', 'user_profiles']
const tableResults = {}

for (const table of tables) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, { headers })
  let body = ''
  try {
    body = await res.text()
  } catch {}
  tableResults[table] = { status: res.status, body: body.slice(0, 120) }
}

console.log(JSON.stringify({
  url,
  urlMatches: url === `https://${expectedRef}.supabase.co`,
  jwtRef: ref,
  jwtRefMatches: ref === expectedRef,
  authHealth: health.status,
  tables: tableResults,
}, null, 2))
