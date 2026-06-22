type ClinicianPortalTileIconProps = {
  id: 'triage' | 'tiptraq' | 'timing' | 'invite'
}

export function ClinicianPortalTileIcon({ id }: ClinicianPortalTileIconProps) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.12,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (id) {
    case 'triage':
      return (
        <svg {...common}>
          <path d="M5 7h14M5 12h10M5 17h6" />
          <circle cx="18" cy="17" r="2.25" fill="currentColor" stroke="none" opacity="0.9" />
        </svg>
      )
    case 'tiptraq':
      return (
        <svg {...common}>
          <path d="M12 3v3M8.5 4.2l1.5 2.6M15.5 4.2l-1.5 2.6" />
          <path d="M7 10.5a5 5 0 0 1 10 0V18H7z" />
          <path d="M9.5 18v2.5h5V18" />
        </svg>
      )
    case 'timing':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 8v4.5l3 1.75" />
          <path d="M4 12H2M22 12h-2M12 4V2M12 22v-2" opacity="0.35" />
        </svg>
      )
    case 'invite':
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="2.75" />
          <circle cx="16.5" cy="10" r="2.25" />
          <path d="M4.5 18.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" />
          <path d="M14 16.5c.5-1.6 1.8-2.8 3.5-2.8 2 0 3.5 1.4 3.5 3.8" />
        </svg>
      )
  }
}
