#!/usr/bin/env node
/**
 * DeepDose production deploy helper — run from deepdose/
 *
 *   node scripts/deploy.mjs              # all steps (needs SUPABASE_ACCESS_TOKEN for auth URLs)
 *   node scripts/deploy.mjs --step env   # sync .env.local → Vercel only
 *   node scripts/deploy.mjs --step auth  # Supabase auth URLs only
 *   node scripts/deploy.mjs --step db      # supabase db push
 *   node scripts/deploy.mjs --step deploy # vercel --prod
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const step = process.argv.includes('--step')
  ? process.argv[process.argv.indexOf('--step') + 1]
  : 'all'

function run(label, cmd, args, opts = {}) {
  console.log(`\n▶ ${label}`)
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts })
  if (result.status !== 0) {
    console.error(`✗ Failed: ${label}`)
    process.exit(result.status ?? 1)
  }
  console.log(`✓ ${label}`)
}

function shouldRun(name) {
  return step === 'all' || step === name
}

console.log('DeepDose deploy — circadian-foundation/deepdose')
console.log('Vercel project linked:', existsSync('.vercel/project.json') ? 'yes' : 'no — run: vercel link --yes --project deepdose --scope circadian-foundation')

if (shouldRun('preflight')) {
  run('Pre-flight build', 'pnpm', ['build'])
}

if (shouldRun('env')) {
  if (!existsSync('.env.local')) {
    console.error('Missing .env.local — copy from .env.local.example and fill in Supabase keys.')
    process.exit(1)
  }
  run('Sync env vars to Vercel', 'node', ['scripts/sync-vercel-env.mjs'])
}

if (shouldRun('auth')) {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    run('Update Supabase auth URLs', 'node', ['scripts/update-supabase-auth-urls.mjs'])
  } else {
    console.log('\n⚠ Skipping auth URL update — set SUPABASE_ACCESS_TOKEN or run:')
    console.log('  npx supabase config push --yes')
    console.log('  (Supabase dashboard → Authentication → URL configuration is the manual fallback)')
  }
}

if (shouldRun('db')) {
  run('Push database migrations', 'npx', ['supabase', 'db', 'push', '--yes'])
}

if (shouldRun('deploy')) {
  run('Production deploy', 'vercel', ['--prod', '--yes'])
  console.log('\nNext: add deepdose.org in Vercel → Domains and point DNS.')
  console.log('Smoke test: /, /login, /patient/dashboard (auth required)')
}

if (step === 'all') {
  console.log('\nDone. If Git auto-deploy is wanted:')
  console.log('  vercel git connect https://github.com/Chronobiobank/dios-health.git')
  console.log('  Then set Root Directory = deepdose in Vercel project settings.')
}
