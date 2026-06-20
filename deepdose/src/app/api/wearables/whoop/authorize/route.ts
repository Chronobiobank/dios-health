import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildWhoopAuthUrl, isWhoopConfigured } from '@/lib/wearables/whoop'

export async function GET() {
  if (!isWhoopConfigured()) {
    return NextResponse.json(
      { error: 'Whoop integration is not configured on this server.' },
      { status: 503 }
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
  }

  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('whoop_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/wearables/whoop/callback`
  const url = buildWhoopAuthUrl(redirectUri, state)

  return NextResponse.redirect(url)
}
