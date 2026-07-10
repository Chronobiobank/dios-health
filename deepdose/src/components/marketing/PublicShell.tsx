import Link from 'next/link'
import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { Container } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-canvas/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="clinical-site-nav__brand">
          <DeepdoseWordmark className="deepdose-wordmark--compact" />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/mission" className="hidden text-sm text-ink-muted hover:text-ink sm:block">
            Mission
          </Link>
          <Button href="/login" variant="primary" className="!px-5 !py-2 text-sm">
            Sign in
          </Button>
        </nav>
      </Container>
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg text-ink">{DEEPDOSE_NAME}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Patient-owned chronobiobank · Precision dosing
            </p>
          </div>
          <p className="text-xs text-ink-faint">
            UK GDPR aligned · Not a substitute for clinical advice
          </p>
        </div>
      </Container>
    </footer>
  )
}
