'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import {
  APP_FEED_GROUPS,
  APP_GROUP_STORAGE_KEY,
  parseAppGroupId,
  resolveAppGroup,
  type AppGroupId,
} from '@/lib/deepdose-marketing/app-groups'

const MENU_ID = 'app-top-bar-group-menu'

function readStoredGroup(): AppGroupId {
  try {
    return parseAppGroupId(localStorage.getItem(APP_GROUP_STORAGE_KEY)) ?? 'lark'
  } catch {
    return 'lark'
  }
}

function writeStoredGroup(id: AppGroupId) {
  try {
    localStorage.setItem(APP_GROUP_STORAGE_KEY, id)
  } catch {
    /* private mode */
  }
}

function readClockFromLocation(): AppGroupId | null {
  try {
    return parseAppGroupId(new URLSearchParams(window.location.search).get('clock'))
  } catch {
    return null
  }
}

/** Nextdoor-style left control: open a chronotype group list. */
export function AppGroupSwitcher() {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  // SSR + first client paint always "Early birds" — sync from URL/storage after mount.
  const [activeId, setActiveId] = useState<AppGroupId>('lark')

  useEffect(() => {
    setActiveId(readClockFromLocation() ?? readStoredGroup())
  }, [pathname])

  const active = resolveAppGroup(activeId)

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function selectGroup(id: AppGroupId) {
    writeStoredGroup(id)
    setActiveId(id)
    setOpen(false)
    router.push(resolveAppGroup(id).href)
  }

  return (
    <div className="app-top-bar__group" ref={rootRef}>
      <button
        type="button"
        className="app-top-bar__group-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="app-top-bar__group-label">{active.label}</span>
        <svg
          className="app-top-bar__group-caret"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul id={MENU_ID} className="app-top-bar__group-menu" role="listbox" aria-label="Feed groups">
          {APP_FEED_GROUPS.map((group) => (
            <li key={group.id} role="option" aria-selected={group.id === active.id}>
              <button
                type="button"
                className={
                  group.id === active.id
                    ? 'app-top-bar__group-option app-top-bar__group-option--on'
                    : 'app-top-bar__group-option'
                }
                onClick={() => selectGroup(group.id)}
              >
                {group.label}
              </button>
            </li>
          ))}
          <li className="app-top-bar__group-divider" role="presentation" />
          <li role="option" aria-selected={false}>
            <Link
              href="/connect"
              className="app-top-bar__group-option"
              onClick={() => setOpen(false)}
            >
              Friends
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  )
}
