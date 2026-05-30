import { AuthShell } from '@/components/auth/auth-shell'
import { SignInForm } from '@/components/auth/sign-in-form'

export default function SignInPage() {
  return (
    <AuthShell headline="Welcome back." subtext="Your body clock data is waiting.">
      <SignInForm />
    </AuthShell>
  )
}
