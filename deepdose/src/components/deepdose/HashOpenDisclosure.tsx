'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { ScienceTrustDisclosure } from '@/components/deepdose/ScienceTrustDisclosure'

type HashOpenDisclosureProps = {
  anchor: string
  title: string
  teaser?: string
  badge?: string
  className?: string
  children: ReactNode
}

/** Opens and scrolls to a fold when the URL hash matches (e.g. /mission#research). */
export function HashOpenDisclosure({
  anchor,
  title,
  teaser,
  badge,
  className,
  children,
}: HashOpenDisclosureProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const sync = () => {
      if (window.location.hash !== `#${anchor}` || !detailsRef.current) return
      detailsRef.current.open = true
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [anchor])

  return (
    <ScienceTrustDisclosure
      ref={detailsRef}
      id={anchor}
      title={title}
      teaser={teaser}
      badge={badge}
      className={className}
    >
      {children}
    </ScienceTrustDisclosure>
  )
}
