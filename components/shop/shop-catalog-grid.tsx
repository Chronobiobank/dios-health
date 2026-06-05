import Link from 'next/link'

import { SHOP_PRODUCTS, shopProductUrl } from '@/lib/shop/catalog'

export function ShopCatalogGrid() {
  return (
    <ul className="shop-catalog-grid mt-6 grid gap-4 sm:grid-cols-2">
      {SHOP_PRODUCTS.map((product) => {
        const fromPrice = Math.min(...product.quantityOptions.map((q) => q.priceGbp))
        return (
          <li key={product.slug}>
            <Link href={shopProductUrl(product.slug)} className="shop-catalog-card block h-full">
              <p className="font-mono text-[10px] uppercase tracking-wider text-black/45">
                {product.protocolIndication}
              </p>
              <h2 className="mt-2 text-base font-semibold text-black">{product.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/65">{product.doseSpecification}</p>
              <p className="mt-4 text-sm font-medium text-black">From £{fromPrice}</p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
