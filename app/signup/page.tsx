import { AuthShell } from '@/components/auth/auth-shell'
import { SignUpChoice } from '@/components/auth/sign-up-choice'

export default function SignUpPage() {
  return (
    <AuthShell headline="Who are you joining as?" maxWidthClass="max-w-3xl">
      <SignUpChoice />
    </AuthShell>
  )
}
