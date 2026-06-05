import Stripe from 'stripe'

import type { ShopProduct } from '@/lib/shop/catalog'
import type { OrderFlow, PatientDeliveryProfile } from '@/lib/shop/types'

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim())
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key)
}

export type CheckoutLineItem = {
  product: ShopProduct
  quantityOptionId: string
  priceGbp: number
  label: string
}

export async function createStripeCheckoutSession(input: {
  lineItem: CheckoutLineItem
  orderId: string
  patientRecordId: string
  patientName: string
  orderFlow: OrderFlow
  orderedBy: string
  delivery: PatientDeliveryProfile
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe()
  if (!stripe) return null

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      order_id: input.orderId,
      patient_record_id: input.patientRecordId,
      patient_name: input.patientName,
      order_flow: input.orderFlow,
      ordered_by: input.orderedBy,
      product_slug: input.lineItem.product.slug,
      quantity_option_id: input.lineItem.quantityOptionId,
    },
    shipping_address_collection: { allowed_countries: ['GB', 'NZ', 'AU', 'IE', 'US'] },
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(input.lineItem.priceGbp * 100),
          product_data: {
            name: input.lineItem.product.name,
            description: input.lineItem.product.doseSpecification,
          },
        },
        quantity: 1,
      },
    ],
  })

  return session
}
