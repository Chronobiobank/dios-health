'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/** True after hydration; false on the server and the first client pass. */
export function useIsClient(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}
