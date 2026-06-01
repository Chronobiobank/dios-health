import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

export function PitchFooter() {
  return (
    <footer
      className="border-t border-white/10 bg-calm-bg px-5 py-6 sm:px-6"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      <div className="mx-auto flex max-w-[76rem] flex-col gap-4 text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="dios-wordmark shrink-0 text-base text-white"
          aria-label="DIOS — home"
        >
          {DIOS_WORDMARK}
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Footer">
          <Link href="/evidence/tiptraq" className="transition-opacity hover:opacity-80">
            The science
          </Link>
          <Link href="/signup/clinician" className="transition-opacity hover:opacity-80">
            For clinicians
          </Link>
          <Link href="/privacy" className="transition-opacity hover:opacity-80">
            Privacy
          </Link>
          <Link href="/terms" className="transition-opacity hover:opacity-80">
            Terms
          </Link>
        </nav>
        <p className="shrink-0 text-center sm:text-right">© 2026 DIOS Health</p>
      </div>
    </footer>
  )
}
