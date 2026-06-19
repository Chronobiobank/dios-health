#!/usr/bin/env node
/**
 * Submit DeepDose sitemap via Google Search Console API (service account).
 *
 * Setup (one-time):
 * 1. GCP → enable "Google Search Console API"
 * 2. Create service account + JSON key
 * 3. Search Console → Settings → Users → add service account email (Full permission)
 * 4. Set GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64 in .env.local (or _JSON / _PATH)
 *
 * Usage:
 *   node scripts/submit-google-index.mjs
 *   node scripts/submit-google-index.mjs --key path\to\key.json
 *   node scripts/submit-google-index.mjs --site-url sc-domain:deepdose.org
 */
import {
  getAccessToken,
  loadServiceAccount,
  resolveSiteUrl,
  resolveSitemapUrl,
  submitSitemap,
} from './lib/google-search-console.mjs'

function readArg(flag) {
  const i = process.argv.indexOf(flag)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const keyPath = readArg('--key')
const siteOverride = readArg('--site-url')

if (siteOverride) {
  process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL = siteOverride
}

const siteUrl = resolveSiteUrl()
const sitemapUrl = resolveSitemapUrl()

let serviceAccount
try {
  serviceAccount = loadServiceAccount(keyPath)
} catch (err) {
  console.error('✗', err.message)
  process.exit(1)
}

if (!serviceAccount) {
  console.log('⚠ Skipping Google Search Console — no service account configured.')
  console.log('  Set one of:')
  console.log('    GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64  (recommended for Vercel)')
  console.log('    GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON')
  console.log('    GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_PATH')
  console.log('    deepdose/gsc-service-account.json  (local test file, gitignored)')
  console.log('    node scripts/submit-google-index.mjs --key path\\to\\key.json')
  console.log('\n  Manual fallback: submit in Search Console →', sitemapUrl)
  process.exit(0)
}

try {
  console.log(`▶ Google Search Console — ${siteUrl}`)
  console.log(`  Sitemap: ${sitemapUrl}`)

  const token = await getAccessToken(serviceAccount)
  const result = await submitSitemap(token, siteUrl, sitemapUrl)

  if (result.ok) {
    console.log(`✓ Sitemap submitted (${result.status})`)
    process.exit(0)
  }

  console.error(`✗ Sitemap submit failed (${result.status})`)
  if (result.detail) console.error(`  ${result.detail}`)

  if (result.status === 403) {
    console.error(
      '\n  Add the service account email to Search Console → Settings → Users and permissions:'
    )
    console.error(`  ${serviceAccount.client_email}`)
    console.error(
      `  Site URL must match the property exactly (current: ${siteUrl}). For domain properties use sc-domain:deepdose.org`
    )
  }

  process.exit(1)
} catch (err) {
  console.error('✗ Google Search Console error:', err.message)
  process.exit(1)
}
