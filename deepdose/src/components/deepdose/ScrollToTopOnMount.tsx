'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Force window to top on every route change (signup must never open mid-page). */
export function ScrollToTopOnMount() {
  const pathname = usePathname()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    reset()
    const frame = window.requestAnimationFrame(() => {
      reset()
      window.requestAnimationFrame(reset)
    })
    // Catch late sticky-nav / image layout shifts after paint
    const t = window.setTimeout(reset, 50)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(t)
    }
  }, [pathname])

  return null
}
