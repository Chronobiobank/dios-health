export type TechnologyLayerIconId = 'passive-signals' | 'proxy-phase' | 'tiptraq-validate' | 'dose-cues'

type TechnologyLayerIconProps = {
  id: TechnologyLayerIconId
}

/** Layer-specific icons for the four-layer technology stack. */
export function TechnologyLayerIcon({ id }: TechnologyLayerIconProps) {
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
    case 'passive-signals':
      return (
        <svg {...common}>
          <rect x="7.5" y="3.5" width="9" height="17" rx="2" />
          <path d="M10.5 17.5h3" />
          <path d="M4.5 9.5c1.8-1.2 4-1.2 5.8 0M4.5 12.5c1.8-1.2 4-1.2 5.8 0" opacity="0.7" />
          <path d="M19.5 9.5c-1.8-1.2-4-1.2-5.8 0M19.5 12.5c-1.8-1.2-4-1.2-5.8 0" opacity="0.7" />
          <circle cx="12" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'proxy-phase':
      return (
        <svg {...common}>
          <path d="M12 4.5a7.5 7.5 0 1 1-5.3 12.8" />
          <path d="M12 8.5v4l2.75 1.5" />
          <circle cx="16.5" cy="7" r="1.1" fill="currentColor" stroke="none" opacity="0.85" />
          <path d="M5.5 16.5 4 18l1.5 1.5" opacity="0.55" />
        </svg>
      )
    case 'tiptraq-validate':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="14" height="9" rx="2.5" />
          <path d="M8 12.5h8" />
          <path d="M8 15h5" />
          <path d="M12 4.5v2.5" />
          <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
          <path d="M17.5 11.5l1.5 1.5-3 3-1.5-1.5" />
        </svg>
      )
    case 'dose-cues':
      return (
        <svg {...common}>
          <circle cx="6" cy="8" r="1.35" fill="currentColor" stroke="none" />
          <circle cx="12" cy="5.5" r="1.35" fill="currentColor" stroke="none" />
          <circle cx="18" cy="8" r="1.35" fill="currentColor" stroke="none" />
          <circle cx="7.5" cy="14" r="1.35" fill="currentColor" stroke="none" opacity="0.75" />
          <circle cx="12" cy="16.5" r="1.35" fill="currentColor" stroke="none" opacity="0.75" />
          <circle cx="16.5" cy="14" r="1.35" fill="currentColor" stroke="none" opacity="0.75" />
          <path d="M6 8h12M7.5 14h9" opacity="0.35" />
        </svg>
      )
  }
}
