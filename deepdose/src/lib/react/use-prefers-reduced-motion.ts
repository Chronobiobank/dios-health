'use client'

import { useSyncExternalStore } from 'react'

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Subscribes to `prefers-reduced-motion` without an effect + setState. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
