import Link from 'next/link'
import type { ReactNode } from 'react'

type ProductIconActionProps = {
  href: string
  label: string
  children: ReactNode
}

/** Product secondary action — icon only, label via aria (OpenAI / iOS pattern). */
export function ProductIconAction({ href, label, children }: ProductIconActionProps) {
  return (
    <Link href={href} className="dd-icon-action" aria-label={label}>
      {children}
    </Link>
  )
}

export function IconShare() {
  return (
    <svg className="dd-icon-action__svg" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
      <path
        d="M12 3v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 7l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconMatches() {
  return (
    <svg className="dd-icon-action__svg" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.75 19c.85-2.35 2.55-3.5 5.25-3.5s4.4 1.15 5.25 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 19c.4-1.35 1.4-2.05 2.9-2.05 1.35 0 2.3.6 2.85 1.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
