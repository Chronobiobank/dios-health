import Link from 'next/link'

import { CONTAINER, SECTION } from './layout'

export function EvidenceLink() {
  return (
    <section className={`${SECTION} border-y border-black/10 bg-[#FAFAFA] py-14 sm:py-16`}>
      <div className={`${CONTAINER} text-center`}>
        <Link
          href="/evidence"
          className="type-button text-black underline-offset-4 hover:underline"
        >
          Evidence library →
        </Link>
      </div>
    </section>
  )
}
