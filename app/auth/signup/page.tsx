import { Suspense } from 'react'

import { RetinomicAuthShell } from '@/components/auth/retinomic-auth-shell'
import { RetinomicSignUpForm } from '@/components/auth/retinomic-sign-up-form'

export default function RetinomicSignUpPage() {
  return (
    <RetinomicAuthShell
      headline="Secure your baseline identity"
      subtext="Link your iris hue, skin ITA, and solar zenith markers to a protected Retinomic record. Free tier screening included."
    >
      <Suspense
        fallback={
          <p className="text-center text-sm text-[rgb(250_250_247/0.5)]">Loading sign-up…</p>
        }
      >
        <RetinomicSignUpForm initialBridge={null} />
      </Suspense>
    </RetinomicAuthShell>
  )
}
