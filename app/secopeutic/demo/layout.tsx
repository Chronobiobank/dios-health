import type { ReactNode } from 'react'

import '@/app/styles/clinical-globals.css'
import '@/app/styles/secopeutic-demo.css'

type LayoutProps = {
  children: ReactNode
}

/** Public pilot demo — no auth, no nested clinical shell. */
export default function SecopeuticDemoLayout({ children }: LayoutProps) {
  return children
}
