import { Suspense } from 'react'

import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <section className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Patient access</p>
        <h1 className="seco-page__title">Sign in</h1>
        <div className="seco-app-card mt-6 p-5 md:p-6">
          <Suspense fallback={<p className="seco-page__lede">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
