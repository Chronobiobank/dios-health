import type { SleepLabFeatureIconId } from '@/lib/deepdose-marketing/sleeplab-content'

/** Hairline glyphs for Sleep Lab list rows — stroke only. */
export function SleepLabFeatureIcon({ name }: { name: SleepLabFeatureIconId }) {
  return (
    <svg
      className="dark-sleeplab__includes-icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      aria-hidden
    >
      {name === 'sensing' ? (
        <>
          <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.15" />
          <path
            d="M12 4.5v2.1M12 17.4v2.1M4.5 12h2.1M17.4 12h2.1M6.7 6.7l1.5 1.5M15.8 15.8l1.5 1.5M6.7 17.3l1.5-1.5M15.8 8.2l1.5-1.5"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {name === 'wake' ? (
        <>
          <path
            d="M5 15.75c1.7-2.4 3.9-3.6 7-3.6s5.3 1.2 7 3.6"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
          <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.15" />
          <path
            d="M12 4.25v1.6M7.6 6.35l1.1 1.1M16.4 6.35l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {name === 'score' ? (
        <>
          <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.15" />
          <path
            d="M12 12V7.4M12 12l3.6 2.4"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
    </svg>
  )
}
