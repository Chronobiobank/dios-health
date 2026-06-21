'use client'

import type { InputHTMLAttributes } from 'react'

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

type TimeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  value?: string
  onChange?: (event: { target: { value: string } }) => void
}

function parseTime(value: string | undefined): [string, string] {
  const [hour = '08', minute = '00'] = (value ?? '08:00').split(':')
  return [hour.padStart(2, '0'), minute.padStart(2, '0').slice(0, 2)]
}

export function TimeInput({
  value = '08:00',
  onChange,
  id,
  className = '',
  disabled,
  required,
  name,
  'aria-label': ariaLabel = 'Time, 24-hour clock',
}: TimeInputProps) {
  const [hour, minute] = parseTime(value)

  function emit(nextHour: string, nextMinute: string) {
    onChange?.({ target: { value: `${nextHour}:${nextMinute}` } })
  }

  return (
    <div
      className={`time-input-24 ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
      data-time-value={`${hour}:${minute}`}
    >
      <select
        id={id}
        name={name ? `${name}-hour` : undefined}
        className="dios-input time-input-24__select"
        value={hour}
        disabled={disabled}
        required={required}
        aria-label="Hour"
        onChange={(event) => emit(event.target.value, minute)}
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="time-input-24__sep" aria-hidden>
        :
      </span>
      <select
        id={id ? `${id}-minute` : undefined}
        name={name ? `${name}-minute` : undefined}
        className="dios-input time-input-24__select"
        value={minute}
        disabled={disabled}
        required={required}
        aria-label="Minute"
        onChange={(event) => emit(hour, event.target.value)}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  )
}
