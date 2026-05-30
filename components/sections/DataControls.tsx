'use client'

import { useState } from 'react'

import { MatchedLines } from './MatchedLines'
import { BODY, CARD, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const TOGGLES = [
  { id: 'gp', label: ['Share with', 'my GP'], defaultOn: true },
  { id: 'research', label: ['Share with', 'researchers'], defaultOn: false },
  { id: 'policy', label: ['Share with', 'policy teams'], defaultOn: false },
] as const

export function DataControls() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TOGGLES.map((t) => [t.id, t.defaultOn]))
  )

  return (
    <section id="data-controls" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="Data controls" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-md`}>
          Your data.
          <br />
          Your call.
        </h2>
        <p className={`${BODY} mt-4 max-w-sm`}>One toggle. Change it any time.</p>

        <ul className="mt-10 max-w-md space-y-4">
          {TOGGLES.map((toggle) => (
            <li
              key={toggle.id}
              className={`${CARD} flex items-center justify-between gap-4 rounded-lg px-5 py-4`}
            >
              <MatchedLines
                lines={toggle.label}
                variant="headline"
                slots={2}
                className="[&_span]:text-sm [&_span]:font-medium"
              />
              <button
                type="button"
                role="switch"
                aria-checked={state[toggle.id]}
                aria-label={`${toggle.label.join(' ')} — ${state[toggle.id] ? 'on' : 'off'}`}
                onClick={() =>
                  setState((prev) => ({ ...prev, [toggle.id]: !prev[toggle.id] }))
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  state[toggle.id] ? 'bg-black' : 'bg-black/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
                    state[toggle.id] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <p className={`${BODY} mt-6 max-w-sm`}>Off means off. Immediately.</p>
      </div>
    </section>
  )
}
