import { cn } from '@/lib/utils'

type CloQWordmarkProps = {
  className?: string
}

/** CLOQ — Unbounded Light, all caps; Q rendered as ring + dot. */
export function CloQWordmark({ className }: CloQWordmarkProps) {
  return (
    <span className={cn('cloq-wordmark', className)} aria-label="CLOQ">
      CLO
      <span className="cloq-wordmark__q" aria-hidden />
    </span>
  )
}

/** BODYCLOQ metric wordmark — same typography, longer mark. */
export function BodycloQWordmark({ className }: CloQWordmarkProps) {
  return (
    <span className={cn('cloq-wordmark', className)} aria-label="BodycloQ">
      BODYCLO
      <span className="cloq-wordmark__q" aria-hidden />
    </span>
  )
}

type CloQMarkProps = {
  className?: string
}

/** Circle + dot brand icon (footer / compact moments). */
export function CloQMark({ className }: CloQMarkProps) {
  return (
    <span className={cn('cloq-mark', className)} aria-hidden>
      <span className="cloq-mark__ring" />
      <span className="cloq-mark__dot" />
    </span>
  )
}

type CloQTagProps = {
  className?: string
  children: string
}

/** MAKE TIME COUNT — Unbounded Light, all caps. */
export function CloQTag({ className, children }: CloQTagProps) {
  return <span className={cn('cloq-tag', className)}>{children}</span>
}
