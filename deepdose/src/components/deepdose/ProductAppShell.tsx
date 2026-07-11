import type { ReactNode } from 'react'

import { AppTopBar } from '@/components/deepdose/AppTopBar'

type ProductAppShellProps = {
  title: string
  leading?: ReactNode
  trailing?: ReactNode
  children: ReactNode
  /** Extra class on the article (e.g. dd-connect) */
  className?: string
}

/**
 * Fixed product template: AppTopBar + OpenAI-inspired fluid column.
 * Bottom nav comes from PublicMarketingShell — do not duplicate.
 */
export function ProductAppShell({
  title,
  leading,
  trailing,
  children,
  className,
}: ProductAppShellProps) {
  return (
    <article className={['seco-page seco-marketing-page dd-product', className].filter(Boolean).join(' ')}>
      <AppTopBar title={title} leading={leading} trailing={trailing} />
      <div className="seco-landing__section-inner dd-product__inner dd-oai-container">
        <div className="dd-oai-stack">{children}</div>
      </div>
    </article>
  )
}
