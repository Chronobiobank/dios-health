'use client'

/** Dev-only — confirms you are on the live design preview route. */
export function DevPreviewBar() {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[100] flex justify-center px-4"
      aria-hidden
    >
      <p className="rounded-full border border-white/60 bg-black/75 px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white shadow-lg backdrop-blur-md">
        Live design preview · edits hot-reload ·{' '}
        <span className="font-mono text-white/90">localhost:3000/dev/dashboard</span>
      </p>
    </div>
  )
}
