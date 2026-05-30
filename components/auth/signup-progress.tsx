type SignupProgressProps = {
  step: number
  total: number
}

export function SignupProgress({ step, total }: SignupProgressProps) {
  const percent = Math.round((step / total) * 100)

  return (
    <div className="mb-6">
      <p className="type-caption font-mono text-black/50">
        Step {step} of {total}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
