import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { exchangeWhoopCode, isWhoopConfigured } from '@/lib/wearables/whoop'
import { syncWhoopForPatient } from '@/lib/wearables/sync-whoop'
import { persistDlmoProxySnapshot } from '@/lib/circadian/persist-dlmo-proxy'

export async function GET(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const dataUrl = `${appUrl}/patient/dashboard/data`

  if (!isWhoopConfigured()) {
    return NextResponse.redirect(`${dataUrl}?whoop=not_configured`)
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const cookieStore = await cookies()
  const savedState = cookieStore.get('whoop_oauth_state')?.value

  cookieStore.delete('whoop_oauth_state')

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${dataUrl}?whoop=error`)
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.redirect(`${appUrl}/login`)
  }

  try {
    const redirectUri = `${appUrl}/api/wearables/whoop/callback`
    const tokens = await exchangeWhoopCode(code, redirectUri)
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null

    await adminClient.from('patient_profiles').upsert({ id: user.id }, { onConflict: 'id' })

    await adminClient.from('wearable_connections').upsert(
      {
        patient_id: user.id,
        provider: 'whoop',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: expiresAt,
        sync_status: 'idle',
        last_error: null,
      },
      { onConflict: 'patient_id,provider' }
    )

    await syncWhoopForPatient(adminClient, user.id)
    await persistDlmoProxySnapshot(adminClient, user.id)

    return NextResponse.redirect(`${dataUrl}?whoop=connected`)
  } catch {
    return NextResponse.redirect(`${dataUrl}?whoop=error`)
  }
}
