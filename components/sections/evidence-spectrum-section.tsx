'use client'

import dynamic from 'next/dynamic'

const CircadianDesynchronySpectrum = dynamic(
  () =>
    import('@/components/sections/CircadianDesynchronySpectrum').then((mod) => ({
      default: mod.CircadianDesynchronySpectrum,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="mt-4 h-[520px] w-full animate-pulse rounded-2xl bg-black/[0.04]"
        aria-hidden
      />
    ),
  }
)

export function EvidenceSpectrumSection() {
  return (
    <CircadianDesynchronySpectrum mluxScore={87} isDemo />
  )
}
