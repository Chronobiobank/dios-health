import { Suspense } from 'react'

import { RetinomicAuthShell } from '@/components/auth/retinomic-auth-shell'
import { RetinomicSignInForm } from '@/components/auth/retinomic-sign-in-form'

export default function RetinomicSignInPage() {
  return (
    <RetinomicAuthShell
      headline="Protocol access"
      subtext="Sign in to your Retinomic dashboard. Premium verification unlocks full metabolic and TipTraQ streams."
    >
      <Suspense
        fallback={
          <p className="text-center text-sm text-[rgb(250_250_247/0.5)]">Loading sign-in…</p>
        }
      >
        <RetinomicSignInForm />
      </Suspense>
    </RetinomicAuthShell>
  )
}
