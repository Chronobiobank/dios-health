'use client'

import Link from 'next/link'

import { useSupabaseUser } from '@/lib/auth/use-supabase-user'
import { resolvePlanAvatarUrl } from '@/lib/patient/patient-landing-defaults'

function ChatIcon() {
  return (
    <svg className="app-top-bar__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <path
        d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v6A2.25 2.25 0 0 1 17.25 15H12l-3.75 3.75V15H6.75A2.25 2.25 0 0 1 4.5 12.75v-6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="app-top-bar__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <path
        d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 3.5 1.5 5 1.5 5H5s1.5-1.5 1.5-5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.5a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Nextdoor-style trailing chrome: chat · alerts · face — members only. */
export function AppChromeActions() {
  const { user, ready } = useSupabaseUser()
  // Stable SSR/client markup — avoid localStorage reads during render (hydration).
  const avatarUrl = resolvePlanAvatarUrl(null)

  if (!ready || !user) return null

  return (
    <div className="app-top-bar__actions">
      <Link href="/chat" className="app-top-bar__icon-btn" aria-label="Chat">
        <ChatIcon />
      </Link>
      <Link href="/profile" className="app-top-bar__icon-btn" aria-label="Alerts">
        <BellIcon />
      </Link>
      <Link href="/profile" className="app-top-bar__avatar-btn" aria-label="Profile">
        <span
          className="app-top-bar__avatar"
          style={{ backgroundImage: `url(${avatarUrl})` }}
          aria-hidden
        />
      </Link>
    </div>
  )
}
