'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Force window to top when this route mounts (and on same-path revisits). */
export function ScrollToTopOnMount() {
  const pathname = usePathname()

  useEffect(() => {
    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    reset()
    // Catch late layout / sticky-nav scroll adjustments after paint
    const id = window.requestAnimationFrame(reset)
    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  return null
}
