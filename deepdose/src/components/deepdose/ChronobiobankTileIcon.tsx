export type ChronobiobankTileIconId =
  | 'edge'
  | 'learning'
  | 'licensing'
  | 'warehouse'
  | 'shield'
  | 'device'
  | 'weights'
  | 'query'
  | 'governance'
  | 'healthkit'
  | 'federated'
  | 'pysyft'
  | 'tre'
  | 'sleep'
  | 'meds'
  | 'outcomes'
  | 'store-patient'
  | 'store-learning'
  | 'store-license'
  | 'role-patient'
  | 'role-clinician'
  | 'role-coordinator'
  | 'role-enterprise'
  | 'consent-care'
  | 'consent-model'
  | 'consent-research'
  | 'partner-openmined'
  | 'partner-hdruk'
  | 'partner-academic'
  | 'partner-nhs'
  | 'audience-patient'
  | 'audience-researcher'
  | 'audience-funder'
  | 'quote'

type ChronobiobankTileIconProps = {
  id: ChronobiobankTileIconId
}

export function ChronobiobankTileIcon({ id }: ChronobiobankTileIconProps) {
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
    case 'edge':
      return (
        <svg {...common}>
          <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
          <path d="M9 17.5h6" />
          <circle cx="12" cy="8" r="2.25" />
        </svg>
      )
    case 'learning':
      return (
        <svg {...common}>
          <circle cx="6.5" cy="8" r="2" />
          <circle cx="17.5" cy="8" r="2" />
          <circle cx="12" cy="17" r="2" />
          <path d="M8.2 9.4 10.6 15M15.8 9.4 13.4 15M8.4 8.2h7.2" />
        </svg>
      )
    case 'licensing':
      return (
        <svg {...common}>
          <path d="M4.5 9.5V6.5A2 2 0 0 1 6.5 4.5h11A2 2 0 0 1 19.5 6.5v11A2 2 0 0 1 17.5 19.5H6.5A2 2 0 0 1 4.5 17.5V14.5" />
          <path d="M8 12h8M8 9h5" />
          <path d="M15.5 14.5 18 17l-2.5 2.5" />
        </svg>
      )
    case 'warehouse':
      return (
        <svg {...common}>
          <path d="M3.5 10.5 12 4.5l8.5 6" />
          <path d="M5.5 10v8.5h13V10" />
          <path d="M9.5 18.5V13h5v5.5" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3.5 18 6.5V11c0 4.2-2.8 6.8-6 8.5-3.2-1.7-6-4.3-6-8.5V6.5z" />
          <path d="M9.2 12.2 11 14l3.8-4" />
        </svg>
      )
    case 'device':
      return (
        <svg {...common}>
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M10 18.5h4" />
          <path d="M9.5 7h5" opacity="0.45" />
        </svg>
      )
    case 'weights':
      return (
        <svg {...common}>
          <path d="M5 7h14M5 12h10M5 17h6" />
          <circle cx="18" cy="17" r="2" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      )
    case 'query':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6.5" rx="7" ry="2.5" />
          <path d="M5 6.5v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5" />
          <path d="M5 11.5v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5" />
        </svg>
      )
    case 'governance':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 8v4.5l3 1.75" />
        </svg>
      )
    case 'healthkit':
      return (
        <svg {...common}>
          <path d="M12 6.5v11M7 12h10" />
          <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" />
        </svg>
      )
    case 'federated':
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="2.25" />
          <circle cx="17" cy="7" r="2.25" />
          <circle cx="12" cy="17" r="2.25" />
          <path d="M8.8 8.5 10.8 15.2M15.2 8.5 13.2 15.2" />
        </svg>
      )
    case 'pysyft':
      return (
        <svg {...common}>
          <path d="M6 8.5h12M6 12h8M6 15.5h10" />
          <path d="M17.5 11.5v5.5" />
          <path d="M15.5 13.5h4" />
        </svg>
      )
    case 'tre':
      return (
        <svg {...common}>
          <path d="M5 6.5h14v11H5z" />
          <path d="M8.5 10h7M8.5 13h4.5" />
          <path d="M16.5 15.5 18 17l-1.5 1.5" />
        </svg>
      )
    case 'sleep':
      return (
        <svg {...common}>
          <path d="M4.5 14.5a7.5 7.5 0 0 1 15 0" />
          <path d="M14.5 8.5a4 4 0 0 0-5 0" opacity="0.55" />
        </svg>
      )
    case 'meds':
      return (
        <svg {...common}>
          <rect x="8" y="4" width="8" height="16" rx="4" />
          <path d="M8 12h8" />
        </svg>
      )
    case 'outcomes':
      return (
        <svg {...common}>
          <path d="M5 17V9M10 17V6M15 17v-4M20 17V8" />
        </svg>
      )
    case 'store-patient':
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="2.5" />
          <path d="M5.5 17c0-2 1.8-3.5 3.5-3.5S12.5 15 12.5 17" />
          <rect x="13.5" y="7" width="6" height="10" rx="1.25" />
        </svg>
      )
    case 'store-learning':
      return (
        <svg {...common}>
          <path d="M4.5 7.5 12 4l7.5 3.5V16L12 19.5 4.5 16z" />
          <path d="M12 11.5V19.5" />
        </svg>
      )
    case 'store-license':
      return (
        <svg {...common}>
          <path d="M6 5.5h12v13H6z" />
          <path d="M9 9.5h6M9 12.5h4" />
          <path d="M14.5 15.5 16.5 17.5 19.5 14.5" />
        </svg>
      )
    case 'role-patient':
      return (
        <svg {...common}>
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M10 17.5h4" />
        </svg>
      )
    case 'role-clinician':
      return (
        <svg {...common}>
          <path d="M12 3.5v3M8.5 4.2l1.5 2.6M15.5 4.2l-1.5 2.6" />
          <path d="M7 10.5a5 5 0 0 1 10 0V18H7z" />
        </svg>
      )
    case 'role-coordinator':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M8.5 12h7M12 8.5v7" />
        </svg>
      )
    case 'role-enterprise':
      return (
        <svg {...common}>
          <path d="M4.5 9.5h15v9h-15z" />
          <path d="M8 9.5V7.5h8v2" />
          <path d="M9.5 14h5" />
        </svg>
      )
    case 'consent-care':
      return (
        <svg {...common}>
          <path d="M12 4.5 14.5 9.5H20l-4.5 3.5 1.5 5.5L12 15.5 7 18.5l1.5-5.5L4 9.5h5.5z" />
        </svg>
      )
    case 'consent-model':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M9.5 12.2 11.2 14l3.8-4.5" />
        </svg>
      )
    case 'consent-research':
      return (
        <svg {...common}>
          <path d="M6.5 5.5h11v13h-11z" />
          <path d="M9 9.5h6M9 12.5h6M9 15.5h4" />
        </svg>
      )
    case 'partner-openmined':
      return (
        <svg {...common}>
          <path d="M5 7.5h14v9H5z" />
          <path d="M8.5 11h7M8.5 14h4.5" />
          <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'partner-hdruk':
      return (
        <svg {...common}>
          <path d="M12 4.5 18.5 7.5V12c0 3.2-2.2 5.4-6.5 7-4.3-1.6-6.5-3.8-6.5-7V7.5z" />
        </svg>
      )
    case 'partner-academic':
      return (
        <svg {...common}>
          <path d="M4.5 10 12 6l7.5 4v6.5L12 21l-7.5-4.5z" />
          <path d="M12 10.5V21" />
        </svg>
      )
    case 'partner-nhs':
      return (
        <svg {...common}>
          <path d="M12 4.5v15M7.5 9.5h9M7.5 14.5h9" />
        </svg>
      )
    case 'audience-patient':
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="3" />
          <path d="M6.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
        </svg>
      )
    case 'audience-researcher':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="7" rx="7" ry="2.5" />
          <path d="M5 7v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V7" />
          <path d="M5 13v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4" />
        </svg>
      )
    case 'audience-funder':
      return (
        <svg {...common}>
          <path d="M5 17.5V8.5l7-4 7 4v9" />
          <path d="M9.5 12h5v5.5h-5z" />
        </svg>
      )
    case 'quote':
      return (
        <svg {...common}>
          <path d="M7.5 8.5c0-2 1.2-3.5 3-3.5 1.4 0 2.5 1 2.5 2.5 0 2.2-2.2 3.5-4 5.5H12" />
          <path d="M14.5 8.5c0-2 1.2-3.5 3-3.5 1.4 0 2.5 1 2.5 2.5 0 2.2-2.2 3.5-4 5.5H19" />
        </svg>
      )
  }
}
