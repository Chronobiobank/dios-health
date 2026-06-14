import { NextResponse } from 'next/server'

import type { MicronutrientItemId } from '@/lib/chronoimmune/indication-zones'
import { getShopProduct, SHOP_PRODUCTS } from '@/lib/shop/catalog'
import { syncShopCheckoutToFulfillment } from '@/lib/shop/fulfillment-bridge'
import { appendSupplementOrder, createOrderId } from '@/lib/shop/order-store'
import { createStripeCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import type { OrderFlow, PatientDeliveryProfile } from '@/lib/shop/types'
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
    const orderId = createOrderId()
    const origin = originFromRequest(request)
    const successPath = body.successPath ?? '/shop/success'
    const cancelPath = body.cancelPath ?? `/shop/${product.slug}`

    const validMicronutrientIds = new Set(
      SHOP_PRODUCTS.flatMap((p) => p.micronutrientIds)
    )
    const micronutrientId: MicronutrientItemId | null =
      body.micronutrientId && validMicronutrientIds.has(body.micronutrientId as MicronutrientItemId)
        ? (body.micronutrientId as MicronutrientItemId)
        : null

    const orderEvent = {
      id: orderId,
      patientRecordId: body.patientRecordId,
      patientName: body.patientName,
      productSlug: product.slug,
      productName: product.name,
      micronutrientId,
      quantity: qty.units,
      unitPriceGbp: qty.priceGbp,
      totalGbp: qty.priceGbp,
      protocolDose: body.protocolDose ?? product.defaultProtocolDose,
      orderFlow: body.orderFlow,
      orderedBy,
      deliveryLine1: body.delivery.line1,
      deliveryCity: body.delivery.city,
      deliveryPostcode: body.delivery.postcode,
      deliveryCountry: body.delivery.country,
      status: 'pending_fulfilment' as const,
      createdAt: new Date().toISOString(),
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
        orderId,
        patientRecordId: body.patientRecordId,
        patientName: body.patientName,
        orderFlow: body.orderFlow,
        orderedBy,
        delivery: body.delivery,
        successUrl: `${origin}${successPath}?order_id=${orderId}`,
        cancelUrl: `${origin}${cancelPath}`,
      })

      if (session?.url) {
        orderEvent.stripeSessionId = session.id
        appendSupplementOrder(orderEvent)

        const fulfillment = await syncShopCheckoutToFulfillment(supabase, {
          productSlug: product.slug,
          patientRecordId: body.patientRecordId,
          patientName: body.patientName,
          orderFlow: body.orderFlow,
          orderedByProfileId: user.id,
          shopOrderId: orderId,
          quantityLabel: qty.label,
          totalGbp: qty.priceGbp,
          protocolDose: body.protocolDose ?? product.defaultProtocolDose,
        })

        if (!fulfillment.synced) {
          console.warn('[shop/checkout] fulfillment sync skipped', {
            orderId,
            reason: fulfillment.error,
          })
        }

        return NextResponse.json({
          mode: 'stripe',
          url: session.url,
          orderId,
          fulfillmentOrderId: fulfillment.orderId ?? null,
        })
      }
    }

    appendSupplementOrder({ ...orderEvent, status: 'confirmed' })

    const fulfillment = await syncShopCheckoutToFulfillment(supabase, {
      productSlug: product.slug,
      patientRecordId: body.patientRecordId,
      patientName: body.patientName,
      orderFlow: body.orderFlow,
      orderedByProfileId: user.id,
      shopOrderId: orderId,
      quantityLabel: qty.label,
      totalGbp: qty.priceGbp,
      protocolDose: body.protocolDose ?? product.defaultProtocolDose,
    })

    if (!fulfillment.synced) {
      console.warn('[shop/checkout] fulfillment sync skipped', {
        orderId,
        reason: fulfillment.error,
      })
    }

    return NextResponse.json({
      mode: 'demo',
      orderId,
      redirectUrl: `${successPath}?order_id=${orderId}`,
      fulfillmentOrderId: fulfillment.orderId ?? null,
    })
  } catch (err) {
    console.error('[shop/checkout]', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
