import { cn } from '@/lib/utils'

export const SECTION_EYEBROW =
  'font-mono text-xs uppercase tracking-widest text-black/50'

type SectionLabelProps = {
  title: string
  className?: string
  light?: boolean
}

export function SectionLabel({ title, className, light = false }: SectionLabelProps) {
  return (
    <p
      className={cn(
        SECTION_EYEBROW,
        light && 'text-white/50',
        className
      )}
    >
      {title}
    </p>
  )
}
