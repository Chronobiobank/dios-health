import { NextResponse } from 'next/server'

import type { CreateFulfillmentOrderInput } from '@/lib/fulfillment/types'
import { createFulfillmentOrder, fetchPatientOrders } from '@/lib/fulfillment/service'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const url = new URL(request.url)
    const patientId = url.searchParams.get('patientId') ?? user.id
    const orders = await fetchPatientOrders(supabase, patientId)
    return NextResponse.json({ orders })
  } catch (err) {
    console.error('[fulfillment/orders GET]', err)
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
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

    const body = (await request.json()) as CreateFulfillmentOrderInput
    if (!body.patientProfileId || !body.requirementKeys?.length) {
      return NextResponse.json({ error: 'Missing order fields' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle<{ role: 'patient' | 'clinician' }>()

    const orderFlow =
      body.orderFlow ??
      (profile?.role === 'clinician' ? 'clinician_for_patient' : 'patient_self')

    const result = await createFulfillmentOrder(
      supabase,
      { ...body, orderFlow },
      user.id
    )

    if (!result.order) {
      return NextResponse.json({ error: result.error ?? 'Order failed' }, { status: 500 })
    }

    return NextResponse.json({ order: result.order })
  } catch (err) {
    console.error('[fulfillment/orders POST]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
