#!/usr/bin/env node
/**
 * Sync .env.local vars to the linked Vercel project.
 * Production always; preview after Git is connected (see DEPLOY.md).
 *
 * Usage:
 *   node scripts/sync-vercel-env.mjs
 *   node scripts/sync-vercel-env.mjs --preview   # also sync preview (needs Git connect)
 */
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const includePreview = process.argv.includes('--preview')

const KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL',
  'DLMO_PROXY_VERSION',
  'CIRCADIAN_SCORE_VERSION',
  'NEXT_PUBLIC_ENABLE_PATIENT_TIER',
  'NEXT_PUBLIC_ENABLE_CLINICAL_TIER',
  'NEXT_PUBLIC_ENABLE_ENTERPRISE_TIER',
]

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=')
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/\r$/, '')]
    })
)

const missing = KEYS.filter((k) => !env[k])
if (missing.length) {
  console.error('Missing in .env.local:', missing.join(', '))
  process.exit(1)
}

async function addEnv(key, target) {
  const sensitive = key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN')
  const args = [
    'env',
    'add',
    key,
    target,
    '--value',
    env[key],
    '--yes',
    '--force',
    ...(sensitive ? ['--sensitive'] : []),
  ]
  const result = spawnSync('vercel', args, { stdio: 'pipe', encoding: 'utf8', shell: true })
  const out = `${result.stdout ?? ''}${result.stderr ?? ''}`
  if (result.status !== 0 && !/already exists|same value/i.test(out)) {
    if (target === 'preview' && /git_branch_required/i.test(out)) {
      console.warn(`⚠ Skipped ${key} (preview) — connect Git first, then re-run with --preview`)
      return
    }
    console.error(`Failed ${key} (${target}):`, out.trim())
    process.exit(1)
  }
  console.log(`✓ ${key} → ${target}`)
}

for (const key of KEYS) {
  await addEnv(key, 'production')
  if (includePreview) {
    await addEnv(key, 'preview')
  }
}

console.log(includePreview ? 'Done (production + preview).' : 'Done (production). Run with --preview after Git connect.')
