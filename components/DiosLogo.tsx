import { cn } from '@/lib/utils'

/** Plain brand name — copy, titles, aria-labels. Never use the dotted O outside the logo. */
export const DIOS_BRAND_NAME = 'DIOS'

/**
 * Visual wordmark only — O replaced with ʘ (U+0298 latin letter bilabial click).
 * Always pair with `.dios-wordmark` (Montserrat Medium).
 */
export const DIOS_LOGO_MARK = `DI${String.fromCodePoint(0x0298)}S`

/** Single ʘ glyph (U+0298) — footer and compact brand moments only */
export const DIOS_LOGO_GLYPH = String.fromCodePoint(0x0298)

/** Logo mark alias for existing nav imports */
export const DIOS_WORDMARK = DIOS_LOGO_MARK

export const DIOS_TAGLINE = 'Make Time Count'

const SIZE_CLASSES = {
  sm: 'text-[18px] leading-none',
  xl: 'text-[28px] leading-none',
  '4xl': 'text-[56px] leading-none',
  '7xl': 'text-[96px] leading-none',
} as const

export type DiosLogoSize = keyof typeof SIZE_CLASSES

export interface DiosLogoProps {
  /** Preset size — xl matches 28px nav reference */
  size?: DiosLogoSize
  /** Black on light backgrounds; white on dark */
  variant?: 'black' | 'white'
  /** Size override, e.g. `text-xl md:text-2xl` */
  className?: string
}

export function DiosLogo({
  size = 'xl',
  variant = 'black',
  className,
}: DiosLogoProps) {
  return (
    <span
      className={cn(
        'dios-wordmark inline-flex shrink-0 items-baseline',
        variant === 'white' ? 'text-white' : 'text-black',
        SIZE_CLASSES[size],
        className
      )}
      aria-label={DIOS_BRAND_NAME}
    >
      {DIOS_LOGO_MARK}
    </span>
  )
}

const GALLERY_SCALES: { label: string; size: DiosLogoSize; note: string }[] = [
  {
    label: 'Mobile navigation',
    size: 'sm',
    note: '18px — footer & compact header',
  },
  {
    label: 'Desktop navigation',
    size: 'xl',
    note: '28px — primary nav wordmark',
  },
  {
    label: 'Hero callout',
    size: '4xl',
    note: '56px — section headlines',
  },
  {
    label: 'Display impact',
    size: '7xl',
    note: '96px — brand display environments',
  },
]

/** Side-by-side scale verification for the text wordmark */
export function DiosLogoGallery() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-[#0D0D0D]">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-black/40">
          DIOS / Logo system
        </p>
        <h1 className="mt-4 text-2xl font-medium tracking-tight text-black md:text-3xl">
          Official wordmark — scale gallery
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-black/60">
          Rendered with <code className="font-mono text-xs">.dios-wordmark</code> (Montserrat Medium,
          500). Logo mark uses ʘ (U+0298) in place of O — plain{' '}
          <code className="font-mono text-xs">{DIOS_BRAND_NAME}</code> in body copy only.
        </p>

        <ul className="mt-16 divide-y divide-black/10 border-t border-black/10">
          {GALLERY_SCALES.map((item) => (
            <li
              key={item.size}
              className="grid grid-cols-1 items-center gap-6 py-12 md:grid-cols-[12rem_1fr]"
            >
              <div>
                <p className="text-sm font-medium text-black">{item.label}</p>
                <p className="mt-1 font-mono text-xs text-black/40">{item.note}</p>
              </div>
              <div className="flex min-h-[4rem] items-center border border-black/5 bg-white px-8 py-10 md:min-h-[5rem]">
                <DiosLogo size={item.size} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 border-t border-black/10 pt-16">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40">
            Stacked alignment check
          </p>
          <div className="mt-8 flex flex-col items-start gap-10 border border-black/5 bg-white p-10">
            <DiosLogo size="sm" />
            <DiosLogo size="xl" />
            <DiosLogo size="4xl" />
            <DiosLogo size="7xl" />
          </div>
        </div>

        <div className="mt-16 border-t border-black/10 pt-16">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40">
            On dark background
          </p>
          <div className="mt-8 flex items-center bg-[#3B1F35] px-8 py-10">
            <DiosLogo variant="white" size="xl" />
          </div>
        </div>

        <div className="mt-16 border-t border-black/10 pt-16">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40">
            Responsive className
          </p>
          <div className="mt-8 flex items-center border border-black/5 bg-white px-8 py-10">
            <DiosLogo className="text-xl leading-none md:text-[28px] lg:text-[56px]" />
          </div>
          <p className="mt-2 font-mono text-xs text-black/40">
            text-xl → md:28px → lg:56px (resize viewport to verify)
          </p>
        </div>
      </div>
    </div>
  )
}
