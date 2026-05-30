type LineVariant = 'headline' | 'body' | 'footer' | 'relevance'

const VARIANT_CLASS: Record<LineVariant, string> = {
  headline: 'block type-tile-title leading-[1.375rem] text-black',
  body: 'block type-body leading-[1.5rem] text-black/70',
  footer: 'block font-mono text-xs leading-[1.125rem] text-black/50',
  relevance: 'block text-sm leading-[1.375rem] text-[var(--researcher-relevance)]',
}

const LINE_HEIGHT_REM: Record<LineVariant, number> = {
  headline: 1.375,
  body: 1.5,
  footer: 1.125,
  relevance: 1.375,
}

type MatchedLinesProps = {
  lines: readonly string[]
  variant?: LineVariant
  slots: number
  className?: string
}

export function MatchedLines({
  lines,
  variant = 'body',
  slots,
  className,
}: MatchedLinesProps) {
  const lineClass = VARIANT_CLASS[variant]
  const minHeight = `${slots * LINE_HEIGHT_REM[variant]}rem`

  return (
    <div className={className} style={{ minHeight }}>
      {Array.from({ length: slots }, (_, i) => (
        <span key={i} className={lineClass}>
          {lines[i] ?? '\u00A0'}
        </span>
      ))}
    </div>
  )
}
