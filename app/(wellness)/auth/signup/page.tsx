import { Suspense } from 'react'

import { RetinomicAuthShell } from '@/components/auth/retinomic-auth-shell'
import { RetinomicSignUpForm } from '@/components/auth/retinomic-sign-up-form'
import { ONBOARDING_COPY } from '@/lib/pitch/retinomic-landing-copy'

export default function RetinomicSignUpPage() {
  return (
    <RetinomicAuthShell
      headline={ONBOARDING_COPY.signUpHeadline}
      subtext={ONBOARDING_COPY.signUpSubtext}
    >
      <Suspense
        fallback={<p className="calm-auth-muted text-center text-sm">Loading sign-up…</p>}
      >
        <RetinomicSignUpForm initialBridge={null} />
      </Suspense>
    </RetinomicAuthShell>
  )
}
