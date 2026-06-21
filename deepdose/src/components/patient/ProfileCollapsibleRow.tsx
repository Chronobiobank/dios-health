'use client'

import { useState, type ReactNode } from 'react'

type ProfileCollapsibleRowProps = {
  id: string
  label: string
  meta: string
  children: ReactNode
  defaultExpanded?: boolean
}

export function ProfileCollapsibleRow({
  id,
  label,
  meta,
  children,
  defaultExpanded = false,
}: ProfileCollapsibleRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <li className="dash-med-row dios-select-card dios-select-card--selected">
      <button
        type="button"
        className="dash-med-row__toggle"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls={`profile-row-${id}`}
      >
        <span className="dash-med-row__summary min-w-0 flex-1 text-left">
          <span className="dash-med-row__name">{label}</span>
          <span className="dash-med-row__meta">{meta}</span>
        </span>
        <span className="dose-dash-expand-icon" aria-hidden>
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div
          id={`profile-row-${id}`}
          className="dash-med-row__detail border-t border-border"
        >
          {children}
        </div>
      )}
    </li>
  )
}
