import Image from 'next/image'

type Overlay = 'light' | 'warm' | 'dark'

const overlays: Record<Overlay, string> = {
  light: 'bg-[var(--seco-navy)]/40',
  warm: 'bg-[var(--seco-navy)]/55',
  dark: 'bg-black/55',
}

interface BackgroundSectionProps {
  image: { src: string; alt: string }
  overlay?: Overlay
  children: React.ReactNode
  className?: string
  minHeight?: string
}

/** Full-bleed lifestyle photography with scrim overlay for text contrast */
export function BackgroundSection({
  image,
  overlay = 'warm',
  children,
  className = '',
  minHeight = 'min-h-[28rem]',
}: BackgroundSectionProps) {
  return (
    <section className={`relative overflow-hidden ${minHeight} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      <div className={`absolute inset-0 ${overlays[overlay]}`} aria-hidden />
      <div className="relative z-10 flex h-full min-h-[inherit] items-center py-16 md:py-24">
        {children}
      </div>
    </section>
  )
}

interface LifestyleImageProps {
  image: { src: string; alt: string }
  className?: string
  priority?: boolean
  aspect?: string
}

/** Rounded editorial image panel (Function-style split hero) */
export function LifestyleImage({
  image,
  className = '',
  priority = false,
  aspect = 'aspect-[4/5]',
}: LifestyleImageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${aspect} ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  )
}
