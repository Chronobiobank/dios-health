'use client'

import { useEffect } from 'react'

const NAV_ID = 'site-nav'
const ON_DARK_CLASS = 'dios-site-nav--on-dark'
const SURFACE_SELECTOR = '[data-nav-surface="dark"]'

/** Toggle light nav chrome when a dark surface intersects the top nav band. */
export function useNavOnDarkSurface() {
  useEffect(() => {
    const nav = document.getElementById(NAV_ID)
    if (!nav) return

    const visibleDark = new Set<Element>()
    let observer: IntersectionObserver | null = null

    const apply = () => {
      nav.classList.toggle(ON_DARK_CLASS, visibleDark.size > 0)
    }

    const mountObserver = () => {
      const navH = Math.round(nav.getBoundingClientRect().height) || 64
      observer?.disconnect()
      visibleDark.clear()

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visibleDark.add(entry.target)
            else visibleDark.delete(entry.target)
          }
          apply()
        },
        {
          root: null,
          threshold: [0, 0.05, 0.12],
          rootMargin: `${-navH}px 0px -50% 0px`,
        }
      )

      document.querySelectorAll(SURFACE_SELECTOR).forEach((el) => observer!.observe(el))
      apply()
    }

    mountObserver()

    const mutation = new MutationObserver(() => {
      mountObserver()
    })
    mutation.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('resize', mountObserver)

    return () => {
      observer?.disconnect()
      mutation.disconnect()
      window.removeEventListener('resize', mountObserver)
      nav.classList.remove(ON_DARK_CLASS)
    }
  }, [])
}
