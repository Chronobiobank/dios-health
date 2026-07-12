import { cn } from '@/lib/utils/cn'

type AmbientBackgroundProps = {
  /** Light pastel wash (default) or legacy dark navy/sunset. */
  tone?: 'light' | 'dark'
}

/** Fixed full-viewport soft-blur orb drift — shared by every shell route. */
export function AmbientBackground({ tone = 'light' }: AmbientBackgroundProps) {
  return (
    <div
      className={cn('deepdose-ambient', tone === 'light' && 'deepdose-ambient--light')}
      aria-hidden
    >
      <div className="deepdose-ambient__orb deepdose-ambient__orb--navy" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--sunset" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--twilight" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--ember" />
      <div className="deepdose-ambient__veil" />
    </div>
  )
}

/** @deprecated Use AmbientBackground tone="dark" */
export function DarkAmbientBackground() {
  return <AmbientBackground tone="dark" />
}
