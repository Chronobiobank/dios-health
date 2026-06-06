'use client'

import { useEffect } from 'react'

const NAV_ID = 'site-nav'
const ON_DARK_CLASS = 'dios-site-nav--on-dark'
const SURFACE_SELECTOR =
  '[data-nav-surface="dark"], .dios-surface-dark, .dios-surface-accent, .home-landing__hero'

function surfaceUnderNav(el: Element, navHeight: number): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < navHeight && rect.bottom > 0
}

/** Toggle light nav chrome while a dark surface underlies the sticky nav band. */
export function useNavOnDarkSurface() {
  useEffect(() => {
    const nav = document.getElementById(NAV_ID)
    if (!nav) return

    const sync = () => {
      const navH = Math.round(nav.getBoundingClientRect().height) || 64
      let onDark = false
      document.querySelectorAll(SURFACE_SELECTOR).forEach((el) => {
        if (surfaceUnderNav(el, navH)) onDark = true
      })
      nav.classList.toggle(ON_DARK_CLASS, onDark)
    }

    sync()
    requestAnimationFrame(sync)

    let mutationTimer: ReturnType<typeof setTimeout> | undefined
    const mutation = new MutationObserver(() => {
      clearTimeout(mutationTimer)
      mutationTimer = setTimeout(sync, 80)
    })
    mutation.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('scroll', sync, { passive: true, capture: true })
    window.addEventListener('resize', sync)

    const deck = document.querySelector('.pitch-deck')
    deck?.addEventListener('scroll', sync, { passive: true })

    return () => {
      clearTimeout(mutationTimer)
      mutation.disconnect()
      window.removeEventListener('scroll', sync, { capture: true })
      window.removeEventListener('resize', sync)
      deck?.removeEventListener('scroll', sync)
      nav.classList.remove(ON_DARK_CLASS)
    }
  }, [])
}
