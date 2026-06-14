import { NextResponse } from 'next/server'

import type { MicronutrientItemId } from '@/lib/chronoimmune/indication-zones'
import { getShopProduct, SHOP_PRODUCTS } from '@/lib/shop/catalog'
import { syncShopCheckoutToFulfillment } from '@/lib/shop/fulfillment-bridge'
import { createShopOrderId } from '@/lib/shop/order-id'
import { createStripeCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import type { OrderFlow, PatientDeliveryProfile } from '@/lib/shop/types'
import type { ShopProductSlug } from '@/lib/shop/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type CheckoutBody = {
  productSlug: string
  quantityOptionId: string
  orderFlow: OrderFlow
  patientRecordId: string
  patientName: string
  micronutrientId?: string | null
  delivery: PatientDeliveryProfile
  protocolDose?: string
  successPath?: string
  cancelPath?: string
}

const FULFILLMENT_SHOP_SLUGS = new Set<ShopProductSlug>([
  'd3-k2-protocol',
  'b-complex-gominak',
  'magnesium-glycinate',
])

function originFromRequest(request: Request): string {
  const host = request.headers.get('host') ?? 'localhost:3000'
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  return `${proto}://${host}`
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = (await request.json()) as CheckoutBody
    const product = getShopProduct(body.productSlug)
    if (!product) {
      return NextResponse.json({ error: 'Unknown product' }, { status: 400 })
    }

    const qty = product.quantityOptions.find((q) => q.id === body.quantityOptionId)
    if (!qty) {
      return NextResponse.json({ error: 'Invalid quantity option' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .maybeSingle<{ full_name: string | null; role: 'patient' | 'clinician' }>()

    const orderedBy = profile?.full_name ?? user.email ?? 'DIOS user'
    const shopOrderId = createShopOrderId()
    const origin = originFromRequest(request)
    const successPath = body.successPath ?? '/shop/success'
    const cancelPath = body.cancelPath ?? `/shop/${product.slug}`
    const protocolDose = body.protocolDose ?? product.defaultProtocolDose

    const validMicronutrientIds = new Set(
      SHOP_PRODUCTS.flatMap((p) => p.micronutrientIds)
    )
    const micronutrientId: MicronutrientItemId | null =
      body.micronutrientId && validMicronutrientIds.has(body.micronutrientId as MicronutrientItemId)
        ? (body.micronutrientId as MicronutrientItemId)
        : null

    const requiresFulfillment = FULFILLMENT_SHOP_SLUGS.has(product.slug)

    const syncInput = {
      productSlug: product.slug,
      productName: product.name,
      patientRecordId: body.patientRecordId,
      patientName: body.patientName,
      orderFlow: body.orderFlow,
      orderedByProfileId: user.id,
      orderedByName: orderedBy,
      shopOrderId,
      quantityLabel: qty.label,
      quantityUnits: qty.units,
      unitPriceGbp: qty.priceGbp,
      totalGbp: qty.priceGbp,
      protocolDose,
      deliveryLine1: body.delivery.line1,
      deliveryCity: body.delivery.city,
      deliveryPostcode: body.delivery.postcode,
      deliveryCountry: body.delivery.country,
      stripeSessionId: null as string | null,
    }

    if (stripeConfigured()) {
      const session = await createStripeCheckoutSession({
        lineItem: {
          product,
          quantityOptionId: qty.id,
          priceGbp: qty.priceGbp,
          label: qty.label,
        },
        orderId: shopOrderId,
        patientRecordId: body.patientRecordId,
        patientName: body.patientName,
        orderFlow: body.orderFlow,
        orderedBy,
        delivery: body.delivery,
        successUrl: `${origin}${successPath}?order_id=${shopOrderId}`,
        cancelUrl: `${origin}${cancelPath}`,
      })

      if (session?.url) {
        syncInput.stripeSessionId = session.id

        const fulfillment = await syncShopCheckoutToFulfillment(supabase, syncInput)
        if (!fulfillment.synced && requiresFulfillment) {
          return NextResponse.json(
            { error: fulfillment.error ?? 'Could not record fulfillment order' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          mode: 'stripe',
          url: session.url,
          orderId: shopOrderId,
          fulfillmentOrderId: fulfillment.orderId ?? null,
        })
      }
    }

    const fulfillment = await syncShopCheckoutToFulfillment(supabase, syncInput)
    if (!fulfillment.synced && requiresFulfillment) {
      return NextResponse.json(
        { error: fulfillment.error ?? 'Could not record fulfillment order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      mode: 'demo',
      orderId: shopOrderId,
      redirectUrl: `${successPath}?order_id=${shopOrderId}`,
      fulfillmentOrderId: fulfillment.orderId ?? null,
    })
  } catch (err) {
    console.error('[shop/checkout]', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
