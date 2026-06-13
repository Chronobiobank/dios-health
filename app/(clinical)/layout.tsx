import type { ReactNode } from 'react'

import '@/app/styles/clinical-globals.css'

type ClinicalLayoutProps = {
  children: ReactNode
}

/** Shared clinical styles — shell is applied per-route (clinic, triage), not clinicians marketing. */
export default function ClinicalLayout({ children }: ClinicalLayoutProps) {
  return children
}
