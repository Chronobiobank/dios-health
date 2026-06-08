import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'

type SignInRedirectPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** Legacy route — Retinomic sign-in lives at /auth/signin */
export default async function SignInRedirectPage({ searchParams }: SignInRedirectPageProps) {
  const params = await searchParams
  const qs = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const entry of value) qs.append(key, entry)
    } else {
      qs.set(key, value)
    }
  }

  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  redirect(`${AUTH_ROUTES.authSignIn}${suffix}`)
}
