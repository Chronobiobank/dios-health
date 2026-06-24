import { cn } from '@/lib/utils/cn'

type DeepDoseLogoGlyphProps = {
  className?: string
}

/** ʘ-style mark — ring at 50% white, centre dot glides inside on a smooth spirograph path. */
export function DeepDoseLogoGlyph({ className }: DeepDoseLogoGlyphProps) {
  return (
    <span className={cn('seco-logo-glyph', className)} aria-hidden="true">
      <span className="seco-logo-glyph__ring" />
      <span className="seco-logo-glyph__arm seco-logo-glyph__arm--a">
        <span className="seco-logo-glyph__arm-mount">
          <span className="seco-logo-glyph__arm seco-logo-glyph__arm--b">
            <span className="seco-logo-glyph__dot" />
          </span>
        </span>
      </span>
    </span>
  )
}
