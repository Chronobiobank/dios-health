import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildOuraAuthUrl, isOuraConfigured } from '@/lib/wearables/oura'

export async function GET() {
  if (!isOuraConfigured()) {
    return NextResponse.json(
      { error: 'Oura integration is not configured on this server.' },
      { status: 503 }
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL))
  }

  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('oura_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/wearables/oura/callback`
  const url = buildOuraAuthUrl(redirectUri, state)

  return NextResponse.redirect(url)
}
