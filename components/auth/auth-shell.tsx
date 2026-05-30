import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'
import { cn } from '@/lib/utils'

type AuthShellProps = {
  headline?: string
  subtext?: string
  maxWidthClass?: string
  /** Use on routes that already render the marketing site Nav (e.g. /signup). */
  withSiteNav?: boolean
  children: React.ReactNode
}

export function AuthShell({
  headline,
  subtext,
  maxWidthClass = 'max-w-[400px]',
  withSiteNav = false,
  children,
}: AuthShellProps) {
  const hasIntro = Boolean(headline)

  return (
    <main
      className={cn(
        'flex flex-1 justify-center bg-white px-5 pb-12 text-[#0D0D0D]',
        withSiteNav ? 'pt-4 sm:pt-5' : 'min-h-dvh pt-8 pb-16 sm:pt-10'
      )}
    >
      <div className={`w-full ${maxWidthClass}`}>
        {!withSiteNav ? (
          <Link
            href="/"
            className={`dios-wordmark block text-center text-xl text-black ${hasIntro ? 'mb-10' : 'mb-6'}`}
            aria-label="DIOS — home"
          >
            {DIOS_WORDMARK}
          </Link>
        ) : null}

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
