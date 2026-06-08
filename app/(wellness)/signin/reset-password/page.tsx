import { Suspense } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <AuthShell headline="Choose a new password." subtext="Use at least 8 characters.">
      <Suspense fallback={<p className="type-body text-center text-black/60">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
