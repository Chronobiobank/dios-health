interface ContainerProps {
  children: React.ReactNode
  size?: 'marketing' | 'app' | 'narrow'
  className?: string
}

const sizes = {
  marketing: 'max-w-[76rem]',
  app: 'max-w-3xl',
  narrow: 'max-w-md',
}

export function Container({ children, size = 'marketing', className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  muted?: boolean
  dark?: boolean
}

export function Section({ children, className = '', muted = false, dark = false }: SectionProps) {
  return (
    <section
      className={`py-12 md:py-16 ${
        dark ? 'dios-hero-navy text-white' : muted ? 'bg-surface-muted' : ''
      } ${className}`}
    >
      {children}
    </section>
  )
}

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`dios-card p-5 md:p-6 ${className}`}>
      {children}
    </div>
  )
}

interface EyebrowProps {
  children: React.ReactNode
  muted?: boolean
  className?: string
}

export function Eyebrow({ children, muted = false, className = '' }: EyebrowProps) {
  return (
    <p className={`dios-eyebrow ${muted ? 'dios-eyebrow--muted' : ''} ${className}`}>
      {children}
    </p>
  )
}

interface BadgeProps {
  children: React.ReactNode
  tone?: 'accent' | 'success' | 'warning' | 'neutral'
}

const badgeTones = {
  accent: 'bg-lilac-light text-aubergine-mid',
  success: 'bg-[var(--status-green-bg)] text-success',
  warning: 'bg-[var(--status-amber-bg)] text-warning',
  neutral: 'bg-surface-muted text-ink-muted',
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 font-mono text-[0.6875rem] font-medium uppercase tracking-wide ${badgeTones[tone]}`}
    >
      {children}
    </span>
  )
}
