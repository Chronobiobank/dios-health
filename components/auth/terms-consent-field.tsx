import Link from 'next/link'

import { cn } from '@/lib/utils'

type TermsConsentFieldProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function TermsConsentField({
  checked,
  onChange,
  disabled = false,
  className,
}: TermsConsentFieldProps) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        required
        className="mt-1 h-4 w-4 shrink-0 rounded border-black/20 accent-black"
      />
      <span className="type-body text-sm leading-snug text-black/70">
        I agree to the{' '}
        <Link
          href="/terms"
          target="_blank"
          className="font-medium text-black underline-offset-2 hover:underline"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          target="_blank"
          className="font-medium text-black underline-offset-2 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  )
}
