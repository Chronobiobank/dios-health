import type { ReactNode } from 'react'

import '@/app/styles/dina-page.css'

import { metadata } from './metadata'

export { metadata }

export default function DinaLayout({ children }: { children: ReactNode }) {
  return children
}
