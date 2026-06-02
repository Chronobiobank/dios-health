import { cn } from '@/lib/utils'

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
    <main
      className={cn(
        'flex flex-1 justify-center px-5 pb-12 pt-4 text-[#0D0D0D] sm:pt-5'
      )}
    >
      <div className={`w-full ${maxWidthClass}`}>
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
