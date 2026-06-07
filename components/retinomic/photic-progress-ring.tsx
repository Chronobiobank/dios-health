'use client'

type PhoticProgressRingProps = {
  current: number
  ceiling: number
  size?: number
}

export function PhoticProgressRing({ current, ceiling, size = 112 }: PhoticProgressRingProps) {
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = ceiling > 0 ? Math.min(1, current / ceiling) : 0
  const offset = circumference * (1 - ratio)
  const center = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      role="img"
      aria-label={`Melanopic lux ${current} of ${ceiling} target`}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgb(13 13 13 / 0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--photic-core)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        x={center}
        y={center - 4}
        textAnchor="middle"
        className="fill-[var(--text-primary)] font-sans text-[15px] font-medium tabular-nums"
      >
        {current}
      </text>
      <text
        x={center}
        y={center + 14}
        textAnchor="middle"
        className="fill-[var(--text-muted)] font-mono text-ui-label uppercase tracking-widest"
      >
        mLux
      </text>
    </svg>
  )
}
