import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

type AuthShellProps = {
  headline?: string
  subtext?: string
  maxWidthClass?: string
  children: React.ReactNode
}

export function AuthShell({
  headline,
  subtext,
  maxWidthClass = 'max-w-[400px]',
  children,
}: AuthShellProps) {
  const hasIntro = Boolean(headline)

  return (
    <main className="flex min-h-dvh justify-center bg-white px-5 pb-16 pt-8 text-[#0D0D0D] sm:pt-10">
      <div className={`w-full ${maxWidthClass}`}>
        <Link
          href="/"
          className={`dios-wordmark block text-center text-xl text-black ${hasIntro ? 'mb-10' : 'mb-6'}`}
          aria-label="DIOS — home"
        >
          {DIOS_WORDMARK}
        </Link>

        {headline ? (
          <>
            <h1 className="type-section text-center">{headline}</h1>
            {subtext ? <p className="type-body mt-3 text-center text-black/70">{subtext}</p> : null}
          </>
        ) : null}

        <div className={hasIntro ? (subtext ? 'mt-8' : 'mt-10') : undefined}>{children}</div>
      </div>
    </main>
  )
}
