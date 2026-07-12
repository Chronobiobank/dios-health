import Link from 'next/link'
import type { ReactNode } from 'react'

import { DeepDoseLogoGlyph } from '@/components/brand/DeepDoseLogoGlyph'
import { AppChromeActions } from '@/components/deepdose/AppChromeActions'
import { AppGroupSwitcher } from '@/components/deepdose/AppGroupSwitcher'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

type AppTopBarProps = {
  title: string
  /** Left control — e.g. back link. When set with variant detail. */
  leading?: ReactNode
  /** Right control — e.g. settings. Merged or used in detail mode. */
  trailing?: ReactNode
  /**
   * `chrome` — home mark · group dropdown · chat/alerts/avatar
   * `detail` — back · title · trailing (nested screens)
   */
  variant?: 'chrome' | 'detail'
}

/** Perfect-circle ʘ mark → splash `/` — same diameter as profile avatar. */
export function AppHomeMark() {
  return (
    <Link href="/" className="app-top-bar__home" aria-label={`${DEEPDOSE_NAME} home`}>
      <DeepDoseLogoGlyph className="app-top-bar__home-glyph" />
    </Link>
  )
}

/**
 * Product top bar.
 * Chrome mode: home mark left, phenotype switcher, utilities + face right.
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
            <AppHomeMark />
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
          {leading ?? <AppHomeMark />}
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
