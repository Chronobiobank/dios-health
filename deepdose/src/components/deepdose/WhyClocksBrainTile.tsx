import Image from 'next/image'
import Link from 'next/link'

import { HOW_IT_WORKS_WHY } from '@/lib/deepdose-marketing/how-it-works-content'
import { cn } from '@/lib/utils/cn'

type WhyClocksBrainTileProps = {
  className?: string
}

/** Stacked social jet lag comparison scans with research citation. */
export function WhyClocksBrainTile({ className }: WhyClocksBrainTileProps) {
  const { brain } = HOW_IT_WORKS_WHY
  const [top, bottom] = brain.scans

  return (
    <figure className={cn('seco-how-brain', className)} aria-label="Social jet lag brain scan comparison">
      <div className="seco-how-brain__frame seco-how-brain__frame--figure">
        <Image
          src={top.src}
          alt={top.alt}
          width={1200}
          height={900}
          sizes="(max-width: 640px) 100vw, 40rem"
          className="seco-how-brain__img seco-how-brain__img--contain"
          priority={false}
        />
        <span className="seco-how-brain__pill">{top.label}</span>
      </div>

      <figcaption className="seco-how-brain__lede">{brain.lede}</figcaption>

      <div className="seco-how-brain__frame seco-how-brain__frame--figure">
        <Image
          src={bottom.src}
          alt={bottom.alt}
          width={1200}
          height={900}
          sizes="(max-width: 640px) 100vw, 40rem"
          className="seco-how-brain__img seco-how-brain__img--contain"
          priority={false}
        />
        <span className="seco-how-brain__pill">{bottom.label}</span>
      </div>

      <p className="seco-how-brain__credit">
        {brain.credit.text}{' '}
        {brain.credit.hrefs.map((link, index) => (
          <span key={link.href}>
            {index > 0 ? ' · ' : null}
            <Link href={link.href} target="_blank" rel="noopener noreferrer" className="seco-how-brain__credit-link">
              {link.label}
            </Link>
          </span>
        ))}
      </p>
    </figure>
  )
}
