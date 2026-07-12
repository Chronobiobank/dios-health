'use client'

import type { ReactNode } from 'react'

import { AppTopBar } from '@/components/deepdose/AppTopBar'
import { useSupabaseUser } from '@/lib/auth/use-supabase-user'

type ProductAppShellProps = {
  title: string
  leading?: ReactNode
  trailing?: ReactNode
  children: ReactNode
  /** Extra class on the article (e.g. dd-connect) */
  className?: string
  /**
   * `chrome` (default) — home mark · group dropdown · chat/alerts/avatar
   * `detail` — back/title layout for nested screens
   */
  chrome?: 'chrome' | 'detail'
}

/**
 * Fixed product template: AppTopBar + OpenAI-inspired fluid column.
 * Member chrome (profile icons) only when signed in; guests use marketing site nav.
 * Bottom nav comes from PublicMarketingShell — do not duplicate.
 */
export function ProductAppShell({
  title,
  leading,
  trailing,
  children,
  className,
  chrome = 'chrome',
}: ProductAppShellProps) {
  const { user, ready } = useSupabaseUser()
  const variant = leading ? 'detail' : chrome
  const isMember = ready && Boolean(user)
  const showChromeBar = variant === 'chrome' && isMember
  const showDetailBar = variant === 'detail'

  return (
    <article className={['seco-page seco-marketing-page dd-product', className].filter(Boolean).join(' ')}>
      {showChromeBar || showDetailBar ? (
        <AppTopBar
          title={title}
          leading={leading}
          trailing={trailing}
          variant={variant}
        />
      ) : null}
      <div className="seco-landing__section-inner dd-product__inner dd-oai-container">
        <div className="dd-oai-stack">{children}</div>
      </div>
    </article>
  )
}
