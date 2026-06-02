export function PitchRouteLoading() {
  return (
    <div className="min-h-[50svh] animate-pulse bg-[#F7FAFC] px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[76rem]">
        <div className="h-3 w-24 rounded bg-black/[0.06]" />
        <div className="mt-6 h-10 max-w-lg rounded bg-black/[0.08]" />
        <div className="mt-4 h-4 max-w-2xl rounded bg-black/[0.05]" />
        <div className="mt-8 h-[220px] w-full rounded-lg bg-black/[0.06] sm:h-[320px]" />
        <div className="mt-8 space-y-4">
          <div className="h-28 rounded-lg bg-black/[0.05]" />
          <div className="h-28 rounded-lg bg-black/[0.05]" />
        </div>
      </div>
    </div>
  )
}
