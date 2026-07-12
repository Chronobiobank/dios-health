'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import {
  resolvePatientPostLoginPath,
  resolvePostLoginPath,
} from '@/lib/auth/post-login-path'

type SplashGateFormProps = {
  aboutHref: string
  aboutLabel: string
  signInLabel: string
  brand: ReactNode
  headline: ReactNode
  /** Primary actions under the hero (CTAs or legacy med baseline). */
  baseline?: ReactNode
  footer: ReactNode
}

/** Splash: chrome + headline + med baseline. Auth lives on /login. */
export function SplashGateForm({
  aboutHref,
  aboutLabel,
  signInLabel,
  brand,
  headline,
  baseline,
  footer,
}: SplashGateFormProps) {
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const [authedHome, setAuthedHome] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled || !user) return

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tier')
        .eq('id', user.id)
        .maybeSingle()
      const tier = profile?.tier
      const home =
        tier === 'patient' || !tier
          ? await resolvePatientPostLoginPath(supabase, user.id, next)
          : resolvePostLoginPath(tier, next)
      if (!cancelled) setAuthedHome(home)
    })()
    return () => {
      cancelled = true
    }
  }, [next])

  const signInHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login'

  return (
    <div className="dd-gate__shell">
      <header className="dd-gate__chrome">
        {brand}
        <nav className="dd-gate__chrome-links" aria-label="Account">
          <Link href={aboutHref} className="dd-gate__chrome-link">
            {aboutLabel}
          </Link>
          <Link href={authedHome ?? signInHref} className="dd-gate__chrome-link">
            {signInLabel}
          </Link>
        </nav>
      </header>

      <div className="dd-gate__main">
        {headline}
        {baseline ? <div className="dd-gate__baseline">{baseline}</div> : null}
      </div>

      {footer ? <div className="dd-gate__foot">{footer}</div> : null}
    </div>
  )
}
