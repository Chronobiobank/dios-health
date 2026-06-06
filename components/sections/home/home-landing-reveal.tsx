'use client'

import { useEffect } from 'react'

export function HomeLandingReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.home-landing__reveal')
    if (nodes.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const markVisible = (el: Element) => {
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight || document.documentElement.clientHeight
      if (rect.top < viewport * 0.92 && rect.bottom > 0) {
        el.classList.add('is-visible')
      }
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
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    )

    const observeAll = () => {
      nodes.forEach((el) => {
        markVisible(el)
        io.observe(el)
      })
    }

    observeAll()
    requestAnimationFrame(observeAll)
    window.addEventListener('hashchange', observeAll)
    return () => {
      io.disconnect()
      window.removeEventListener('hashchange', observeAll)
    }
  }, [])

  return null
}
