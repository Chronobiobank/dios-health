'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { AUTH_LINKS, NAV_MENU_LINKS } from './navigation'

export function NavMenu() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5 sm:h-11 sm:w-11"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 sm:top-[4.5rem] md:bg-transparent"
            aria-hidden
            onClick={() => setOpen(false)}
          />

          <nav
            id={menuId}
            aria-label="Menu"
            className={cn(
              'fixed inset-x-0 top-16 z-50 border-b border-black/10 bg-white px-5 py-6 sm:top-[4.5rem] sm:px-6',
              'md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-2 md:w-64 md:rounded-xl md:border md:px-0 md:py-2 md:shadow-lg',
            )}
          >
            <ul className="flex flex-col gap-1">
              {NAV_MENU_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="type-nav block rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03] hover:text-black md:py-2"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-3 border-t border-black/10 md:mx-2" />

            <ul className="flex flex-col gap-1">
              {AUTH_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="type-nav block rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03] hover:text-black md:py-2"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  )
}
