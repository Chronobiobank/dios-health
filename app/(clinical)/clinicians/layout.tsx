import type { ReactNode } from 'react'

import { marketingFontVariableClasses } from '@/lib/fonts/marketing-fonts'

import '@/app/styles/clinical-globals.css'
import '@/app/styles/secopeutic-demo.css'
import '@/app/styles/secopeutic-landing.css'

type LayoutProps = {
  children: ReactNode
}

/** Public DIOS clinician routes — no auth required. */
export default function DiosCliniciansLayout({ children }: LayoutProps) {
  return <div className={marketingFontVariableClasses}>{children}</div>
}
