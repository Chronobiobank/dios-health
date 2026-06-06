import Image from 'next/image'

import { CARD } from '@/components/sections/layout'
import { GRANT_MUNRO_FOUNDER, GRANT_MUNRO_FOUNDER_ORIGIN } from '@/lib/pitch/grant-munro-founder'
import { cn } from '@/lib/utils'

/** Founder background — NIHI prevention research and partner measurement stack */
export function PitchFounderOrigin({ className }: { className?: string }) {
  const origin = GRANT_MUNRO_FOUNDER_ORIGIN

  return (
    <section className={cn(CARD, 'pitch-founder-origin rounded-[var(--calm-radius-card,8px)] p-5 sm:p-6', className)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/80 shadow-[var(--dios-glass-inner-highlight)] sm:mx-0">
          <Image
            src={GRANT_MUNRO_FOUNDER.profileImage}
            alt={GRANT_MUNRO_FOUNDER.profileImageAlt}
            fill
            sizes="112px"
            className="object-cover object-center"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="type-pitch-eyebrow">{origin.eyebrow}</p>
          <h2 className="type-pitch-title mt-2">{origin.headline}</h2>
          <p className="mt-2 text-sm font-medium text-black/80">{GRANT_MUNRO_FOUNDER.name}</p>
          <p className="font-mono text-xs text-black/50">{GRANT_MUNRO_FOUNDER.affiliationShort}</p>
          <div className="mt-4 space-y-3">
            {origin.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="type-body text-sm leading-relaxed text-black/72 sm:text-[15px]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
