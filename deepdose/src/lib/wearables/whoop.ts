// Whoop API v2 client — OAuth 2.0 + sleep collection.
// Docs: https://developer.whoop.com/ (api.prod.whoop.com)

const WHOOP_AUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth'
const WHOOP_TOKEN_URL = 'https://api.prod.whoop.com/oauth/oauth2/token'
const WHOOP_SLEEP_API = 'https://api.prod.whoop.com/developer/v2/activity/sleep'

// `offline` is required to receive a refresh token; Whoop access tokens are short-lived.
const WHOOP_SCOPES = 'read:sleep offline'

export function isWhoopConfigured(): boolean {
  return Boolean(process.env.WHOOP_CLIENT_ID && process.env.WHOOP_CLIENT_SECRET)
}

export function buildWhoopAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.WHOOP_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: WHOOP_SCOPES,
    state,
  })
  return `${WHOOP_AUTH_URL}?${params}`
}

type WhoopTokenResponse = {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
}

export async function exchangeWhoopCode(
  code: string,
  redirectUri: string
): Promise<WhoopTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.WHOOP_CLIENT_ID!,
    client_secret: process.env.WHOOP_CLIENT_SECRET!,
    redirect_uri: redirectUri,
    code,
  })

  const res = await fetch(WHOOP_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    throw new Error(`Whoop token exchange failed: ${await res.text()}`)
  }

  return res.json()
}

export async function refreshWhoopToken(refreshToken: string): Promise<WhoopTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.WHOOP_CLIENT_ID!,
    client_secret: process.env.WHOOP_CLIENT_SECRET!,
    refresh_token: refreshToken,
    scope: WHOOP_SCOPES,
  })

  const res = await fetch(WHOOP_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    throw new Error(`Whoop token refresh failed: ${await res.text()}`)
  }

  return res.json()
}

export type WhoopSleepRecord = {
  id: string | number
  start: string
  end: string
  nap?: boolean
  score?: {
    stage_summary?: {
      total_slow_wave_sleep_time_milli?: number
      total_rem_sleep_time_milli?: number
    }
  }
}

type WhoopSleepResponse = {
  records?: WhoopSleepRecord[]
  next_token?: string | null
}

/** Fetch sleep activities between two ISO timestamps, following pagination. */
export async function fetchWhoopSleep(
  accessToken: string,
  startIso: string,
  endIso: string
): Promise<WhoopSleepRecord[]> {
  const records: WhoopSleepRecord[] = []
  let nextToken: string | null | undefined

  do {
    const params = new URLSearchParams({ start: startIso, end: endIso, limit: '25' })
    if (nextToken) params.set('nextToken', nextToken)

    const res = await fetch(`${WHOOP_SLEEP_API}?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      throw new Error(`Whoop sleep fetch failed: ${await res.text()}`)
    }

    const json = (await res.json()) as WhoopSleepResponse
    records.push(...(json.records ?? []))
    nextToken = json.next_token
  } while (nextToken)

  return records
}

export function whoopMillisToMinutes(millis: number | undefined): number | null {
  if (millis === undefined || millis === null) return null
  return Math.round(millis / 60000)
}
