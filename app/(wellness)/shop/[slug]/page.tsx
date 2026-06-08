import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductCheckoutForm } from '@/components/shop/product-checkout-form'
import { getShopProduct } from '@/lib/shop/catalog'
import { SHOP_ROUTES } from '@/lib/auth/routes'
import { SEAN_JAMES_RECORD_ID } from '@/lib/chronoimmune/sean-james-demo'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    qty?: string
    source?: string
    micronutrient?: string
    dose?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getShopProduct(slug)
  return { title: product ? `${product.name} — DIOS Shop` : 'Product — DIOS Shop' }
}

export default async function ShopProductPage({ params, searchParams }: Props) {
  const { slug } = await params
  const query = await searchParams
  const product = getShopProduct(slug)
  if (!product) notFound()

  const qtyId =
    query.qty && product.quantityOptions.some((q) => q.id === query.qty)
      ? query.qty
      : product.quantityOptions[0].id

  const protocolDose = query.dose ?? product.defaultProtocolDose
  const sourceLabel =
    query.source === 'first-light'
      ? 'Recommended after your First Light Protocol scan'
      : query.source === 'checklist'
        ? 'From your micronutrient checklist'
        : null

  return (
    <main className="shop-page">
      <Link href={SHOP_ROUTES.catalog} className="text-sm text-black/50 hover:text-black">
        ← All products
      </Link>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-black/45">
        {product.protocolIndication}
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{product.name}</h1>
      <p className="mt-2 text-sm text-black/70">{product.description}</p>
      {sourceLabel ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {sourceLabel}
        </p>
      ) : null}

      <ProductCheckoutForm
        product={product}
        initialQtyId={qtyId}
        orderFlow="patient_self"
        patientRecordId={SEAN_JAMES_RECORD_ID}
        patientName="Sean James"
        delivery={{
          line1: '14 Ponsonby Road',
          line2: 'Freemans Bay',
          city: 'Auckland',
          postcode: '1011',
          country: 'New Zealand',
        }}
        micronutrientId={query.micronutrient ?? null}
        protocolDose={protocolDose}
        successPath={SHOP_ROUTES.success}
        cancelPath={SHOP_ROUTES.product(slug)}
        submitLabel="Checkout — patient self-order"
      />
    </main>
  )
}
