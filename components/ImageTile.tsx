import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export interface ImageTileProps {
  href: string
  image: string
  alt: string
  label: string
  title: string
  meta?: string
  variant?: 'default' | 'featured' | 'wide'
  className?: string
  priority?: boolean
}

export function ImageTile({
  href,
  image,
  alt,
  label,
  title,
  meta,
  variant = 'default',
  className,
  priority = false,
}: ImageTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-lg bg-[#F5F5F5]',
          variant === 'featured' && 'aspect-[16/10] min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]',
          variant === 'wide' && 'aspect-[21/9] min-h-[200px] sm:min-h-[260px]',
          variant === 'default' && 'aspect-[4/3]'
        )}
      >
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={
            variant === 'featured'
              ? '(max-width: 1024px) 100vw, 66vw'
              : variant === 'wide'
                ? '(max-width: 1024px) 100vw, 80vw'
                : '(max-width: 768px) 100vw, 33vw'
          }
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          aria-hidden
        />
        {(variant === 'featured' || variant === 'wide') && (
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="type-tile-overlay-label">{label}</p>
            <p className="type-tile-overlay-title mt-2 max-w-2xl">{title}</p>
            {meta ? <p className="type-caption mt-2 text-white/60">{meta}</p> : null}
          </div>
        )}
      </div>

      {variant === 'default' && (
        <div className="mt-4 flex flex-1 flex-col">
          <p className="type-label min-h-[2.5em]">{label}</p>
          <p className="type-tile-title mt-1 min-h-[2.7em] transition-colors group-hover:text-black/70">
            {title}
          </p>
          {meta ? (
            <p className="type-caption mt-1 min-h-[2.6em] text-pretty">{meta}</p>
          ) : null}
        </div>
      )}
    </Link>
  )
}
