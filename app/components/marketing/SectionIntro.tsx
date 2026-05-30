import { cn } from '@/lib/utils'

export function SectionIntro({
  eyebrow,
  title,
  subtitle,
  dark = false,
  className,
  titleClassName,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  dark?: boolean
  className?: string
  titleClassName?: string
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <p className="dios-eyebrow">{eyebrow}</p>
      <h2
        className={cn(
          'dios-display-lg mb-5',
          dark ? 'text-white' : 'text-dios-aubergine',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={cn('dios-lead', dark && 'text-dios-lilac/90 max-w-2xl')}>{subtitle}</p>
      ) : null}
    </div>
  )
}
