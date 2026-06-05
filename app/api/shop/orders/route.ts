import { NextResponse } from 'next/server'

import { listSupplementOrders } from '@/lib/shop/order-store'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const patientRecordId = searchParams.get('patientRecordId')
  if (!patientRecordId) {
    return NextResponse.json({ error: 'patientRecordId required' }, { status: 400 })
  }

  return NextResponse.json({ orders: listSupplementOrders(patientRecordId) })
}
