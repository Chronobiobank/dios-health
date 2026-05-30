'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { scrollToSectionId } from '@/lib/scroll-to-section'

function scrollToCurrentHash(behavior: ScrollBehavior = 'auto') {
  const hash = window.location.hash.slice(1)
  if (!hash) return

  scrollToSectionId(hash, behavior)

  // Layout can shift after fonts/images — one follow-up scroll
  window.setTimeout(() => scrollToSectionId(hash, 'auto'), 150)
}

export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    if (!window.location.hash) return

    requestAnimationFrame(() => {
      scrollToCurrentHash('auto')
    })
  }, [pathname])

  useEffect(() => {
    const onHashChange = () => scrollToCurrentHash('smooth')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return null
}
