import Link from 'next/link'

import { SplashFrame } from '@/components/secopeutic/SplashFrame'

type SplashGatewayProps = {
  title: string
  cta: { href: string; label: string }
}

export function SplashGateway({ title, cta }: SplashGatewayProps) {
  return (
    <SplashFrame>
      <div className="seco-splash__inner seco-splash__inner--gateway seco-reveal seco-reveal--1">
        <h1 className="seco-splash__title seco-splash__title--gateway">{title}</h1>
        <Link href={cta.href} className="seco-landing__btn seco-landing__btn--ghost">
          {cta.label}
        </Link>
      </div>
    </SplashFrame>
  )
}
