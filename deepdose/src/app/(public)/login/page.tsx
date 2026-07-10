import { Suspense } from 'react'

import LoginForm from '@/components/auth/LoginForm'

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>
}

/** Staff portals only — consumer join/sign-in is the home gate (`/`). */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  await searchParams

  return (
    <section className="seco-page seco-auth-page">
      <div className="seco-landing__section-inner seco-auth-page__inner">
        <div className="seco-app-card seco-auth-card p-5 md:p-6">
          <Suspense fallback={<p className="text-sm text-ink-muted">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
