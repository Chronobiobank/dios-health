import { CARD } from '@/components/sections/layout'
import { cn } from '@/lib/utils'

type AuthToggleProps = {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  readOnly?: boolean
}

export function AuthToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
  readOnly,
}: AuthToggleProps) {
  return (
    <div className={`${CARD} flex items-start justify-between gap-4 rounded-lg px-5 py-4`}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-black">{label}</p>
        {description ? <p className="type-body mt-1 text-sm text-black/60">{description}</p> : null}
      </div>
      {readOnly ? (
        <span
          className={cn(
            'relative h-7 w-12 shrink-0 rounded-full',
            checked ? 'bg-black' : 'bg-black/20'
          )}
          aria-hidden
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${label} — ${checked ? 'on' : 'off'}`}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ease-out disabled:opacity-50',
            checked ? 'bg-black' : 'bg-black/20'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      )}
    </div>
  )
}
