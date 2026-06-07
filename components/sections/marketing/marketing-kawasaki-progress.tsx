'use client'

import { useEffect, useRef, useState } from 'react'

type MarketingKawasakiProgressProps = {
  sectionIds: readonly string[]
}

export function MarketingKawasakiProgress({ sectionIds }: MarketingKawasakiProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement)
            if (idx >= 0) setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((section) => observerRef.current?.observe(section))

    return () => observerRef.current?.disconnect()
  }, [sectionIds])

  return (
    <div className="kz-progress-dots" aria-hidden="true">
      {sectionIds.map((id, index) => (
        <div
          key={id}
          className={`kz-pd${index === activeIndex ? ' kz-pd--active' : ''}`}
        />
      ))}
    </div>
  )
}
