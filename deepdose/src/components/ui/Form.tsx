import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/Input'

export const checkboxClass = 'dios-checkbox'

interface FormSectionProps {
  title?: string
  titleClassName?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, titleClassName, children, className = '' }: FormSectionProps) {
  return (
    <section className={`dios-card space-y-4 p-5 md:p-6 ${className}`}>
      {title && (
        <h2 className={titleClassName ?? 'text-lg font-semibold text-ink'}>{title}</h2>
      )}
      {children}
    </section>
  )
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-ink-faint">{children}</p>
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p className="dios-callout dios-callout--error" role="alert">
      {children}
    </p>
  )
}

type CalloutTone = 'info' | 'success' | 'warning' | 'error'

const calloutStyles: Record<CalloutTone, string> = {
  info: 'dios-callout dios-callout--info',
  success: 'dios-callout dios-callout--success',
  warning: 'dios-callout dios-callout--warning',
  error: 'dios-callout dios-callout--error',
}

export function Callout({
  tone = 'info',
  children,
  className = '',
}: {
  tone?: CalloutTone
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`${calloutStyles[tone]} ${className}`}>
      {children}
    </div>
  )
}

export { TimeInput } from './TimeInput'

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <Input type="number" {...props} />
}
