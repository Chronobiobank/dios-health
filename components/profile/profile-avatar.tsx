import { initialsFromName } from '@/lib/profile/avatar'
import { cn } from '@/lib/utils'

const SIZE_CLASSES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-16 w-16 text-sm',
  lg: 'h-24 w-24 text-lg',
} as const

type ProfileAvatarProps = {
  name: string
  src?: string | null
  size?: keyof typeof SIZE_CLASSES
  className?: string
}

export function ProfileAvatar({ name, src, size = 'sm', className }: ProfileAvatarProps) {
  const sizeClass = SIZE_CLASSES[size]

  if (src) {
    return (
      <span
        className={cn('relative block shrink-0 overflow-hidden rounded-full bg-black/5', sizeClass, className)}
        aria-label={`Profile photo for ${name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-black font-medium text-white',
        sizeClass,
        className
      )}
      aria-label={`Signed in as ${name}`}
    >
      {initialsFromName(name)}
    </span>
  )
}
