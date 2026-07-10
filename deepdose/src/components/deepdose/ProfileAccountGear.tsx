import Link from 'next/link'

/** Crisp settings control — Lucide sliders (geometric; no blob cog). */
export function ProfileAccountGear() {
  return (
    <Link href="/account" className="app-top-bar__icon-btn" aria-label="Account settings">
      <svg
        className="app-top-bar__icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Link>
  )
}
