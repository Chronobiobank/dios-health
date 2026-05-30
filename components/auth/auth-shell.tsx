import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

type AuthShellProps = {
  headline: string
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
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-16 text-[#0D0D0D]">
      <div className={`w-full ${maxWidthClass}`}>
        <Link
          href="/"
          className="dios-wordmark mb-10 block text-center text-xl text-black"
          aria-label="DIOS — home"
        >
          {DIOS_WORDMARK}
        </Link>

        <h1 className="type-section text-center">{headline}</h1>
        {subtext ? <p className="type-body mt-3 text-center text-black/70">{subtext}</p> : null}

        <div className={subtext ? 'mt-8' : 'mt-10'}>{children}</div>
      </div>
    </main>
  )
}
