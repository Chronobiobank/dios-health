import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-accent-surface text-white hover:bg-aubergine',
  secondary: 'border border-ink bg-transparent text-ink hover:bg-surface-muted',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-muted',
}

type BaseProps = {
  variant?: Variant
  className?: string
  children: React.ReactNode
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type LinkProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string }

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', className = '', children } = props
  const classes = `inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-50 ${variants[variant]} ${className}`

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as ButtonProps
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
