import Link from 'next/link'
import type { ReactNode } from 'react'

type AppTopBarProps = {
  title: string
  /** Left control — e.g. back link */
  leading?: ReactNode
  /** Right control — e.g. settings gear */
  trailing?: ReactNode
}

/**
 * OpenAI-style product top bar: plain centered title, hairline icons.
 * Not a marketing spectrum head.
 */
export function AppTopBar({ title, leading, trailing }: AppTopBarProps) {
  return (
    <header className="app-top-bar">
      <div className="app-top-bar__inner">
        <div className="app-top-bar__side app-top-bar__side--start">
          {leading ?? <span className="app-top-bar__slot" aria-hidden />}
        </div>
        <h1 className="app-top-bar__title">{title}</h1>
        <div className="app-top-bar__side app-top-bar__side--end">
          {trailing ?? <span className="app-top-bar__slot" aria-hidden />}
        </div>
      </div>
    </header>
  )
}

export function AppTopBarBack({ href, label = 'Back' }: { href: string; label?: string }) {
  return (
    <Link href={href} className="app-top-bar__icon-btn" aria-label={label}>
      <svg
        className="app-top-bar__icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        aria-hidden
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
