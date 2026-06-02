import Link from 'next/link'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

export function SpectrumUpgradePaths() {
  return (
    <section>
      <p className="font-mono text-[11px] uppercase tracking-widest text-black/35">
        Sharpen your picture
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-black/55">
        Each layer adds precision. Start with Mel daily — add bloods or TipTraQ when ready.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/[0.08] bg-white p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/35">Layer 2</p>
          <p className="mt-2 text-[15px] font-semibold text-black">Blood panel</p>
          <p className="mt-1 text-[12px] leading-relaxed text-black/55">
            Gominak nutrient panel. Sharpens nodes 3, 4, and 5.
          </p>
          <p className="mt-2 font-mono text-[12px] font-medium text-black">£149 · Posted to you</p>
          <Link
            href={PATIENT_ROUTES.streamsBloods}
            className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full border border-black/10 text-[13px] font-medium text-black transition-colors hover:bg-black hover:text-white"
          >
            Order now →
          </Link>
        </div>

        <div className="rounded-2xl border border-black/[0.08] bg-white p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/35">Layer 3</p>
          <p className="mt-2 text-[15px] font-semibold text-black">TipTraQ</p>
          <p className="mt-1 text-[12px] leading-relaxed text-black/55">
            Sleep and autonomic data. Confirms all seven nodes.
          </p>
          <p className="mt-2 font-mono text-[12px] font-medium text-black">£299 · 14-night kit</p>
          <Link
            href={PATIENT_ROUTES.streams}
            className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full border border-black/10 text-[13px] font-medium text-black transition-colors hover:bg-black hover:text-white"
          >
            Order now →
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/35">Clinical</p>
          <p className="mt-2 text-[15px] font-semibold text-black">See a specialist</p>
          <p className="mt-1 text-[12px] leading-relaxed text-black/55">
            Circadian medicine referral via your GP.
          </p>
          <p className="mt-2 font-mono text-[12px] font-medium text-black">Via your GP practice</p>
          <a
            href="mailto:hello@dios.health?subject=Specialist referral"
            className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-black text-[13px] font-medium text-white transition-opacity hover:opacity-80"
          >
            Request referral →
          </a>
        </div>
      </div>
    </section>
  )
}
