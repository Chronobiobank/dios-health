import { Suspense } from 'react'

import LoginForm from '@/components/auth/LoginForm'
import { loginEyebrow } from '@/lib/auth/post-login-path'

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams

  return (
    <section className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">{loginEyebrow(next)}</p>
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
