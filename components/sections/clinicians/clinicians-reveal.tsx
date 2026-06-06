'use client'

import { useEffect } from 'react'

/** Scroll-reveal for clinicians landing — respects prefers-reduced-motion via CSS. */
export function CliniciansRevealInit() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.clinicians-landing__reveal')
    if (nodes.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
    )

    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
