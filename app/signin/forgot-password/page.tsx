import { Suspense } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <AuthShell headline="Reset your password." subtext="We will email you a secure link.">
      <Suspense fallback={<p className="type-body text-center text-black/60">Loading…</p>}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
