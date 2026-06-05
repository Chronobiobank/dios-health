import { Suspense } from 'react'

import { RetinomicAuthShell } from '@/components/auth/retinomic-auth-shell'
import { RetinomicSignUpForm } from '@/components/auth/retinomic-sign-up-form'

export default function RetinomicSignUpPage() {
  return (
    <RetinomicAuthShell
      headline="Create account"
      subtext="Your baseline scan links to this account automatically."
    >
      <Suspense
        fallback={<p className="calm-auth-muted text-center text-sm">Loading sign-up…</p>}
      >
        <RetinomicSignUpForm initialBridge={null} />
      </Suspense>
    </RetinomicAuthShell>
  )
}
