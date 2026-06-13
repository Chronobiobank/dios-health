import type { ReactNode } from 'react'

import '@/app/styles/clinical-globals.css'
import '@/app/styles/secopeutic-demo.css'
import '@/app/styles/secopeutic-landing.css'

type LayoutProps = {
  children: ReactNode
}

/** Public Secopeutic routes — no auth required. */
export default function SecopeuticLayout({ children }: LayoutProps) {
  return children
}
