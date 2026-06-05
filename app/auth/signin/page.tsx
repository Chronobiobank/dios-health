import { Suspense } from 'react'

import { RetinomicAuthShell } from '@/components/auth/retinomic-auth-shell'
import { RetinomicSignInForm } from '@/components/auth/retinomic-sign-in-form'

export default function RetinomicSignInPage() {
  return (
    <RetinomicAuthShell headline="Sign in" subtext="Open your dose window and daily med plan.">
      <Suspense
        fallback={<p className="calm-auth-muted text-center text-sm">Loading sign-in…</p>}
      >
        <RetinomicSignInForm />
      </Suspense>
    </RetinomicAuthShell>
  )
}
