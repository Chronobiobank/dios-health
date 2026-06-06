'use client'

import { useEffect } from 'react'

const NAV_ID = 'site-nav'
const ON_DARK_CLASS = 'dios-site-nav--on-dark'
const SURFACE_SELECTOR = '[data-nav-surface="dark"], .dios-surface-dark, .dios-surface-accent'
const MIN_INTERSECTION = 0.12

function navBandRootMargin(navHeight: number): string {
  const viewportH = window.innerHeight
  const bottomShrink = Math.max(0, viewportH - navHeight)
  return `${-navHeight}px 0px -${bottomShrink}px 0px`
}

/** Toggle light nav chrome only while a dark probe strip overlaps the top nav band. */
export function useNavOnDarkSurface() {
  useEffect(() => {
    const nav = document.getElementById(NAV_ID)
    if (!nav) return

    nav.classList.remove(ON_DARK_CLASS)

    const visibleDark = new Set<Element>()
    let observer: IntersectionObserver | null = null
    let observed = new WeakSet<Element>()

    const apply = () => {
      nav.classList.toggle(ON_DARK_CLASS, visibleDark.size > 0)
    }

    const observeSurfaces = () => {
      if (!observer) return
      document.querySelectorAll(SURFACE_SELECTOR).forEach((el) => {
        if (observed.has(el)) return
        observed.add(el)
        observer!.observe(el)
      })
    }

    const mountObserver = () => {
      const navH = Math.round(nav.getBoundingClientRect().height) || 64
      observer?.disconnect()
      observer = null
      visibleDark.clear()
      observed = new WeakSet()
      nav.classList.remove(ON_DARK_CLASS)

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= MIN_INTERSECTION) {
              visibleDark.add(entry.target)
            } else {
              visibleDark.delete(entry.target)
            }
          }
          apply()
        },
        {
          root: null,
          threshold: [0, MIN_INTERSECTION, 0.35, 0.6],
          rootMargin: navBandRootMargin(navH),
        }
      )

      observeSurfaces()
      apply()
    }

    mountObserver()

    let mutationTimer: ReturnType<typeof setTimeout> | undefined
    const mutation = new MutationObserver(() => {
      clearTimeout(mutationTimer)
      mutationTimer = setTimeout(observeSurfaces, 80)
    })
    mutation.observe(document.body, { childList: true, subtree: true })

    const onScroll = () => apply()
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', mountObserver)

    const deck = document.querySelector('.pitch-deck')
    deck?.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(mutationTimer)
      observer?.disconnect()
      mutation.disconnect()
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', mountObserver)
      deck?.removeEventListener('scroll', onScroll)
      nav.classList.remove(ON_DARK_CLASS)
    }
  }, [])
}
