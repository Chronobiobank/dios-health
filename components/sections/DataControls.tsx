'use client'

import Image from 'next/image'
import { useState } from 'react'

import { MatchedLines } from './MatchedLines'
import { BODY, CARD, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const SECTION_IMAGE = {
  src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
  alt: 'Person holding phone — patient data control and consent management',
  width: 1200,
  height: 900,
} as const

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

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <ul className="max-w-md space-y-4">
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

          <div className="order-1 w-full lg:order-2">
            <Image
              src={SECTION_IMAGE.src}
              alt={SECTION_IMAGE.alt}
              width={SECTION_IMAGE.width}
              height={SECTION_IMAGE.height}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-lg object-cover lg:rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
