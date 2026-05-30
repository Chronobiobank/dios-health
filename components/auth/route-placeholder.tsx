import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'
import { AUTH_ROUTES } from '@/lib/auth/routes'

type RoutePlaceholderProps = {
  title: string
  path: string
  note?: string
  steps?: string[]
}

export function RoutePlaceholder({ title, path, note, steps }: RoutePlaceholderProps) {
  return (
    <main className="min-h-screen bg-white text-[#0D0D0D]">
      <div className="mx-auto max-w-lg px-5 py-16 sm:px-6">
        <Link href="/" className="dios-wordmark text-xl text-black" aria-label="DIOS — home">
          {DIOS_WORDMARK}
        </Link>

        <p className="type-caption mt-12 font-mono uppercase tracking-widest text-black/40">
          Route placeholder — step 2
        </p>
        <h1 className="type-section mt-3">{title}</h1>
        <p className="type-mono mt-2 text-sm text-black/50">{path}</p>

        {note ? <p className="type-body mt-6 text-black/70">{note}</p> : null}

        {steps?.length ? (
          <ol className="type-body mt-6 list-decimal space-y-2 pl-5 text-black/70">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}

        <p className="type-caption mt-10">
          <Link href={AUTH_ROUTES.signIn} className="underline underline-offset-2">
            Sign in
          </Link>
          {' · '}
          <Link href="/" className="underline underline-offset-2">
            Marketing home
          </Link>
        </p>
      </div>
    </main>
  )
}
