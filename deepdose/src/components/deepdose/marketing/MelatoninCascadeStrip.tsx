import type { CSSProperties } from 'react'

import { EVIDENCE_MELATONIN_CASCADE } from '@/lib/deepdose-marketing/evidence-content'

function CascadeIcon({ id }: { id: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (id) {
    case 'dlmo':
      return (
        <svg {...common}>
          <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M8 16a6 6 0 0 1 8 0" opacity="0.55" />
        </svg>
      )
    case 'sleep':
      return (
        <svg {...common}>
          <path d="M20 13.5A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.5z" />
        </svg>
      )
    case 'repair':
      return (
        <svg {...common}>
          <path d="M12 4v4M12 16v4M8 8l2.8 2.8M13.2 13.2L16 16M16 8l-2.8 2.8M10.8 13.2 8 16" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    case 'health':
      return (
        <svg {...common}>
          <path d="M12 20s-6.5-4.2-6.5-9.2a4.2 4.2 0 0 1 7.8-2.1A4.2 4.2 0 0 1 18.5 10.8C18.5 15.8 12 20 12 20z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <rect x="4" y="8" width="16" height="8" rx="4" />
          <path d="M12 8v8" />
        </svg>
      )
  }
}

export function MelatoninCascadeStrip() {
  const { label, title, support, steps } = EVIDENCE_MELATONIN_CASCADE

  return (
    <section className="seco-melatonin-cascade seco-reveal seco-reveal--2" aria-labelledby="melatonin-cascade-title">
      <div className="seco-melatonin-cascade__shell seco-app-card">
        <div className="seco-melatonin-cascade__head">
          <p className="seco-melatonin-cascade__eyebrow">{label}</p>
          <h2 id="melatonin-cascade-title" className="seco-melatonin-cascade__title">
            {title}
          </h2>
          <p className="seco-melatonin-cascade__support">{support}</p>
        </div>

        <div className="seco-melatonin-cascade__track-wrap" aria-hidden="true">
          <div className="seco-melatonin-cascade__track" />
        </div>

        <ol className="seco-melatonin-cascade__steps">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="seco-melatonin-cascade__step"
              style={{ '--cue': step.cue } as CSSProperties}
            >
              <span className="seco-melatonin-cascade__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="seco-melatonin-cascade__main">
                <span className="seco-melatonin-cascade__icon">
                  <CascadeIcon id={step.id} />
                </span>
                <div className="seco-melatonin-cascade__copy">
                  <span className="seco-melatonin-cascade__phase">{step.phase}</span>
                  <span className="seco-melatonin-cascade__step-title">{step.title}</span>
                  <p className="seco-melatonin-cascade__step-body">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
