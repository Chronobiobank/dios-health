import { createSign } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/webmasters'
const API_BASE = 'https://www.googleapis.com/webmasters/v3'

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

function signJwt(payload, privateKey) {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(payload))
  const data = `${header}.${body}`
  const signer = createSign('RSA-SHA256')
  signer.update(data)
  signer.end()
  return `${data}.${signer.sign(privateKey, 'base64url')}`
}

export function loadServiceAccount(keyPathOverride) {
  if (keyPathOverride) {
    const resolved = resolve(keyPathOverride)
    if (!existsSync(resolved)) {
      throw new Error(`Service account key not found: ${resolved}`)
    }
    return JSON.parse(readFileSync(resolved, 'utf8'))
  }

  const localDefault = resolve(process.cwd(), 'gsc-service-account.json')
  if (existsSync(localDefault)) {
    return JSON.parse(readFileSync(localDefault, 'utf8'))
  }

  const b64 = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64?.trim()
  if (b64) {
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  }

  const inline = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON?.trim()
  if (inline) {
    return JSON.parse(inline)
  }

  const path = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_PATH?.trim()
  if (path) {
    return JSON.parse(readFileSync(path, 'utf8'))
  }

  return null
}

export async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000)
  const assertion = signJwt(
    {
      iss: serviceAccount.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    },
    serviceAccount.private_key
  )

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description ?? data.error ?? `Token request failed (${res.status})`)
  }

  return data.access_token
}

/**
 * @param {string} siteUrl Property URL exactly as in Search Console (e.g. https://deepdose.org/)
 * @param {string} sitemapUrl Full sitemap URL (e.g. https://deepdose.org/sitemap.xml)
 */
export async function submitSitemap(accessToken, siteUrl, sitemapUrl) {
  const path = `${API_BASE}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`
  const res = await fetch(path, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (res.status === 204 || res.status === 200) {
    return { ok: true, status: res.status }
  }

  let detail = ''
  try {
    const body = await res.json()
    detail = body?.error?.message ?? JSON.stringify(body)
  } catch {
    detail = await res.text()
  }

  return { ok: false, status: res.status, detail }
}

export function resolveSiteUrl() {
  const configured = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim()
  if (configured) return configured

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://deepdose.org').replace(/\/$/, '')
  return `${appUrl}/`
}

export function resolveSitemapUrl() {
  const configured = process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL?.trim()
  if (configured) return configured

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://deepdose.org').replace(/\/$/, '')
  return `${appUrl}/sitemap.xml`
}
