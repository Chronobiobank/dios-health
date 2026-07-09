#!/usr/bin/env node
/**
 * Update Supabase Auth redirect URLs via Management API (auth-only; avoids full config push).
 * Requires: SUPABASE_ACCESS_TOKEN in env (from https://supabase.com/dashboard/account/tokens)
 *
 * Usage: node scripts/update-supabase-auth-urls.mjs
 */
const PROJECT_REF = 'yavqgklsfmawhrqvuvuf'
const token = process.env.SUPABASE_ACCESS_TOKEN

if (!token) {
  console.error('Set SUPABASE_ACCESS_TOKEN (Supabase dashboard → Account → Access Tokens)')
  process.exit(1)
}

const body = {
  site_url: 'https://www.deepdose.org',
  uri_allow_list:
    'http://127.0.0.1:3000,http://127.0.0.1:3000/auth/callback,https://127.0.0.1:3000,https://www.deepdose.org/auth/callback,https://deepdose.org/auth/callback,https://www.unmed.net/auth/callback,https://unmed.net/auth/callback,https://*.vercel.app/auth/callback',
}

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

const text = await res.text()
if (!res.ok) {
  console.error('Auth config update failed:', res.status, text)
  process.exit(1)
}

console.log('Supabase auth URLs updated for DeepDose.')
console.log(JSON.stringify(JSON.parse(text), null, 2))
