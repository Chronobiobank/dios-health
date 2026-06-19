#!/usr/bin/env node
/**
 * Save a GCP service account JSON key into .env.local (base64) for deploy submits.
 *
 * Usage:
 *   node scripts/install-gsc-key.mjs path\to\key.json
 *   node scripts/install-gsc-key.mjs   # uses ./gsc-service-account.json
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const keyPath = resolve(process.argv[2] ?? 'gsc-service-account.json')

if (!existsSync(keyPath)) {
  console.error(`Key file not found: ${keyPath}`)
  console.error('Download JSON from GCP → paste path, or copy to deepdose/gsc-service-account.json')
  process.exit(1)
}

const account = JSON.parse(readFileSync(keyPath, 'utf8'))
if (!account.client_email || !account.private_key) {
  console.error('Invalid service account JSON — expected client_email and private_key')
  process.exit(1)
}

const b64 = Buffer.from(readFileSync(keyPath, 'utf8')).toString('base64')
const envPath = resolve(process.cwd(), '.env.local')
let env = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''

const lines = [
  'GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64=' + b64,
  'GOOGLE_SEARCH_CONSOLE_SITE_URL=https://deepdose.org/',
]

for (const line of lines) {
  const key = line.split('=')[0]
  const pattern = new RegExp(`^${key}=.*$`, 'm')
  env = pattern.test(env) ? env.replace(pattern, line) : `${env.replace(/\s*$/, '')}\n${line}\n`
}

writeFileSync(envPath, env.endsWith('\n') ? env : `${env}\n`)
console.log('✓ Wrote GSC vars to .env.local')
console.log(`  Service account: ${account.client_email}`)
console.log('\n▶ Testing sitemap submit…')

const test = spawnSync('node', ['scripts/submit-google-index.mjs'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
})

process.exit(test.status ?? 1)
