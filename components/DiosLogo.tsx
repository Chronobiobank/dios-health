import Image from 'next/image'

import { cn } from '@/lib/utils'

/** Official brand assets in /public — matches DIOS Health logo black.png */
const WORDMARK = {
  black: {
    src: '/DIOS Health logo black.png',
    width: 3840,
    height: 2160,
  },
  white: {
    src: '/DIOS Health logo white.png',
    width: 3840,
    height: 2160,
  },
} as const

/** Zoom the mark — PNG includes padding; scale up for legibility in nav/footer */
const GRAPHIC_SCALE = 1.35

const HEIGHT_CLASSES = {
  sm: 'h-[18px]',
  xl: 'h-7',
  '4xl': 'h-14',
  '7xl': 'h-24',
} as const

export type DiosLogoSize = keyof typeof HEIGHT_CLASSES

export interface DiosLogoProps {
  /** Preset height — xl matches 28px nav (SiteNav reference) */
  size?: DiosLogoSize
  /** Black on light backgrounds; white on dark */
  variant?: keyof typeof WORDMARK
  /** Height override, e.g. `h-8 sm:h-9` */
  className?: string
  priority?: boolean
}

export function DiosLogo({
  size = 'xl',
  variant = 'black',
  className,
  priority = false,
}: DiosLogoProps) {
  const asset = WORDMARK[variant]

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center overflow-visible',
        HEIGHT_CLASSES[size],
        className
      )}
    >
      <Image
        src={asset.src}
        alt="DIOS Health"
        width={asset.width}
        height={asset.height}
        priority={priority || size === 'xl'}
        className="h-full w-auto max-w-none origin-left object-contain object-left"
        style={{ transform: `scale(${GRAPHIC_SCALE})` }}
      />
    </span>
  )
}

const GALLERY_SCALES: { label: string; size: DiosLogoSize; note: string }[] = [
  {
    label: 'Mobile navigation',
    size: 'sm',
    note: 'h-[18px] — footer & compact header',
  },
  {
    label: 'Desktop navigation',
    size: 'xl',
    note: 'h-7 (28px) — primary nav wordmark',
  },
  {
    label: 'Hero callout',
    size: '4xl',
    note: 'h-14 — section headlines',
  },
  {
    label: 'Display impact',
    size: '7xl',
    note: 'h-24 — brand display environments',
  },
]

/** Side-by-side scale verification using official brand PNGs */
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
          Rendered from <code className="font-mono text-xs">DIOS Health logo black.png</code> in{' '}
          <code className="font-mono text-xs">/public</code>. The target O, stroke weight, and
          letter alignment match the brand file at every size.
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
            <DiosLogo className="h-5 w-auto md:h-7 lg:h-14" />
          </div>
          <p className="mt-2 font-mono text-xs text-black/40">
            h-5 → md:h-7 → lg:h-14 (resize viewport to verify)
          </p>
        </div>
      </div>
    </div>
  )
}
