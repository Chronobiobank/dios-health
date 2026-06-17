const OURA_AUTH_URL = 'https://cloud.ouraring.com/oauth/authorize'
const OURA_TOKEN_URL = 'https://api.ouraring.com/oauth/token'
const OURA_API = 'https://api.ouraring.com/v2/usercollection/sleep'

export function isOuraConfigured(): boolean {
  return Boolean(process.env.OURA_CLIENT_ID && process.env.OURA_CLIENT_SECRET)
}

export function buildOuraAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.OURA_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email personal daily',
    state,
  })
  return `${OURA_AUTH_URL}?${params}`
}

type OuraTokenResponse = {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

export async function exchangeOuraCode(
  code: string,
  redirectUri: string
): Promise<OuraTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.OURA_CLIENT_ID!,
    client_secret: process.env.OURA_CLIENT_SECRET!,
    redirect_uri: redirectUri,
    code,
  })

  const res = await fetch(OURA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Oura token exchange failed: ${text}`)
  }

  return res.json()
}

type OuraSleepSession = {
  id: string
  bedtime_start: string
  bedtime_end: string
  deep_sleep_duration?: number
  rem_sleep_duration?: number
}

type OuraSleepResponse = {
  data: OuraSleepSession[]
}

export async function fetchOuraSleep(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<OuraSleepSession[]> {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
  const res = await fetch(`${OURA_API}?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Oura sleep fetch failed: ${text}`)
  }

  const json = (await res.json()) as OuraSleepResponse
  return json.data ?? []
}

export function ouraDurationMinutes(seconds: number | undefined): number | null {
  if (seconds === undefined || seconds === null) return null
  return Math.round(seconds / 60)
}
