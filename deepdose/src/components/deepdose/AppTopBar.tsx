import Link from 'next/link'
import type { ReactNode } from 'react'

import { AppChromeActions } from '@/components/deepdose/AppChromeActions'
import { AppGroupSwitcher } from '@/components/deepdose/AppGroupSwitcher'

type AppTopBarProps = {
  title: string
  /** Left control — e.g. back link. When set with variant detail. */
  leading?: ReactNode
  /** Right control — e.g. settings. Merged or used in detail mode. */
  trailing?: ReactNode
  /**
   * `chrome` — Nextdoor-style: group dropdown · chat/alerts/avatar
   * `detail` — back · title · trailing (nested screens)
   */
  variant?: 'chrome' | 'detail'
}

/**
 * Product top bar.
 * Chrome mode mirrors neighborhood apps: community switcher left, utilities + face right.
 */
export function AppTopBar({
  title,
  leading,
  trailing,
  variant = 'detail',
}: AppTopBarProps) {
  if (variant === 'chrome') {
    return (
      <header className="app-top-bar app-top-bar--chrome">
        <h1 className="app-top-bar__title app-top-bar__title--sr">{title}</h1>
        <div className="app-top-bar__inner app-top-bar__inner--chrome">
          <div className="app-top-bar__side app-top-bar__side--start">
            <AppGroupSwitcher />
          </div>
          <div className="app-top-bar__side app-top-bar__side--end">
            {trailing ?? <AppChromeActions />}
          </div>
        </div>
      </header>
    )
  }

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
        width="24"
        height="24"
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
