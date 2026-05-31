/** Editorial SVG backdrops — stroke uses Calmer brand token via currentColor on wrapper */

export function PitchBgWorldChanged() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <circle cx="600" cy="400" r="220" fill="none" stroke="white" strokeWidth="0.75" opacity="0.9" />
      <circle cx="600" cy="400" r="180" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="600"
          y1="400"
          x2={600 + 220 * Math.cos((deg * Math.PI) / 180)}
          y2={400 + 220 * Math.sin((deg * Math.PI) / 180)}
          stroke="white"
          strokeWidth="0.5"
          opacity="0.35"
        />
      ))}
      <path
        d="M420 280 Q520 180 600 200 T780 320 Q860 420 720 480 T480 520 Q360 540 420 280"
        fill="none"
        stroke="white"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <path
        d="M450 520 Q580 620 720 560 T900 420"
        fill="none"
        stroke="white"
        strokeWidth="0.4"
        opacity="0.35"
      />
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={i}
          cx={200 + (i % 6) * 160 + (i % 3) * 12}
          cy={120 + Math.floor(i / 6) * 140}
          r={4 + (i % 4)}
          fill="none"
          stroke="white"
          strokeWidth="0.35"
          opacity={0.2 + (i % 5) * 0.08}
        />
      ))}
    </svg>
  )
}

export function PitchBgInsight() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect x="380" y="200" width="440" height="120" rx="60" fill="none" stroke="white" strokeWidth="1" />
      <line x1="380" y1="260" x2="820" y2="260" stroke="white" strokeWidth="0.5" opacity="0.5" />
      <circle cx="600" cy="320" r="48" fill="none" stroke="white" strokeWidth="0.75" />
      <circle cx="600" cy="320" r="36" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
      <line x1="600" y1="320" x2="600" y2="272" stroke="var(--color-brand)" strokeWidth="2" />
      <line x1="600" y1="320" x2="632" y2="300" stroke="var(--color-brand)" strokeWidth="1.5" />
      <circle cx="600" cy="320" r="4" fill="var(--color-brand)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="600"
          y1="320"
          x2={600 + 34 * Math.cos(((deg - 90) * Math.PI) / 180)}
          y2={320 + 34 * Math.sin(((deg - 90) * Math.PI) / 180)}
          stroke="white"
          strokeWidth="0.4"
          opacity="0.45"
        />
      ))}
      <path d="M420 200 L420 180 L440 180" stroke="white" strokeWidth="0.5" fill="none" />
      <path d="M780 320 L800 320 L800 340" stroke="white" strokeWidth="0.5" fill="none" />
    </svg>
  )
}

export function PitchBgWhyNow() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <circle cx="600" cy="400" r="200" fill="none" stroke="white" strokeWidth="0.5" />
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i / 48) * Math.PI * 2
        return (
          <line
            key={i}
            x1={600 + 40 * Math.cos(angle)}
            y1={400 + 40 * Math.sin(angle)}
            x2={600 + 200 * Math.cos(angle)}
            y2={400 + 200 * Math.sin(angle)}
            stroke="white"
            strokeWidth={i % 3 === 0 ? 0.6 : 0.35}
            opacity={0.25 + (i % 4) * 0.1}
          />
        )
      })}
      <circle cx="600" cy="400" r="28" fill="none" stroke="var(--color-brand)" strokeWidth="1.5" />
      <circle cx="600" cy="400" r="12" fill="var(--color-brand)" opacity="0.6" />
      <circle cx="600" cy="400" r="4" fill="var(--color-brand)" />
    </svg>
  )
}

export function PitchBgSolution() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <path
        d="M520 160 L520 620 Q600 640 680 620 L680 160 Q600 140 520 160 Z"
        fill="none"
        stroke="white"
        strokeWidth="0.75"
      />
      <path d="M560 200 Q600 180 640 200" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
      <path
        d="M600 200 L600 120"
        stroke="white"
        strokeWidth="0.6"
        opacity="0.7"
        strokeDasharray="4 6"
      />
      <path
        d="M600 620 L600 700"
        stroke="var(--color-brand)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
      />
      <path
        d="M520 360 Q400 340 320 400"
        fill="none"
        stroke="white"
        strokeWidth="0.55"
        opacity="0.65"
      />
      <path
        d="M680 360 Q800 380 880 320"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="0.55"
        opacity="0.8"
      />
      <path
        d="M600 480 L720 520 L600 560 L480 520 Z"
        fill="none"
        stroke="white"
        strokeWidth="0.45"
        opacity="0.5"
      />
      <circle cx="320" cy="400" r="6" fill="none" stroke="white" strokeWidth="0.5" />
      <circle cx="880" cy="320" r="6" fill="none" stroke="var(--color-brand)" strokeWidth="0.5" />
    </svg>
  )
}

export function PitchBgScale() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {[-60, -30, 0, 30, 60].map((lat) => (
        <line
          key={`lat-${lat}`}
          x1="80"
          y1={400 + lat * 5.5}
          x2="1120"
          y2={400 + lat * 5.5}
          stroke="white"
          strokeWidth="0.4"
          opacity="0.35"
        />
      ))}
      {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((lon) => (
        <path
          key={`lon-${lon}`}
          d={`M ${600 + 480 * Math.sin((lon * Math.PI) / 180)} 80 Q ${600 + 200 * Math.sin((lon * Math.PI) / 180)} 400 ${600 + 480 * Math.sin((lon * Math.PI) / 180)} 720`}
          fill="none"
          stroke="white"
          strokeWidth="0.35"
          opacity="0.3"
        />
      ))}
      {Array.from({ length: 120 }).map((_, i) => {
        const x = 120 + (i % 15) * 68 + ((i * 17) % 40)
        const y = 100 + Math.floor(i / 15) * 52 + ((i * 13) % 30)
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.5"
            fill="var(--color-brand)"
            opacity={0.4 + (i % 3) * 0.2}
          />
        )
      })}
    </svg>
  )
}
