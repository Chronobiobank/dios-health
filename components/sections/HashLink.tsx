'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

import { parseHashHref, scrollToSectionId } from '@/lib/scroll-to-section'

type HashLinkProps = ComponentProps<typeof Link>

export function HashLink({ href, onClick, ...props }: HashLinkProps) {
  const hrefString = typeof href === 'string' ? href : (href.pathname ?? '')
  const { path, hash } = parseHashHref(hrefString)

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || !hash) return

        const onSamePage =
          path === window.location.pathname ||
          (path === '/' && window.location.pathname === '/')

        if (!onSamePage) return

        event.preventDefault()
        window.history.pushState(null, '', `#${hash}`)
        scrollToSectionId(hash)
      }}
    />
  )
}
