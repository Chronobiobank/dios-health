import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ClinicTopBar } from '@/components/clinic/clinic-top-bar'
import { ProductCheckoutForm } from '@/components/shop/product-checkout-form'
import { getClinicianSurname, requireClinicianSession } from '@/lib/auth/require-clinician'
import { CLINIC_ROUTES } from '@/lib/auth/routes'
import { getCohortTriagePatient } from '@/lib/clinic/cohort-triage-patients'
import { deliveryForCohortPatient } from '@/lib/clinic/patient-delivery'
import { getShopProduct } from '@/lib/shop/catalog'
import type { MicronutrientItemId } from '@/lib/chronoimmune/indication-zones'

type Props = {
  params: Promise<{ patientId: string }>
  searchParams: Promise<{ product?: string; micronutrient?: string }>
}

export default async function ClinicianOrderPage({ params, searchParams }: Props) {
  const { profile, clinician } = await requireClinicianSession()
  const { patientId } = await params
  const query = await searchParams

  const patient = getCohortTriagePatient(patientId)
  if (!patient) notFound()

  const productSlug = query.product ?? 'd3-k2-protocol'
  const product = getShopProduct(productSlug)
  if (!product) notFound()

  const delivery = deliveryForCohortPatient(patientId)
  if (!delivery) notFound()

  const surname = getClinicianSurname(profile.full_name ?? 'Clinician', clinician.family_name)

  return (
    <>
      <ClinicTopBar fullName={profile.full_name ?? 'Clinician'} avatarUrl={profile.avatar_url} />

      <Link href={CLINIC_ROUTES.panel} className="text-sm text-black/50 hover:text-black">
        ← Cohort triage
      </Link>

      <h1 className="mt-4 text-xl font-semibold">Order for {patient.displayName}</h1>
      <p className="mt-1 text-sm text-black/65">
        Dr {surname} · practitioner order · {patient.profile.recordId}
      </p>

      <div className="shop-page mt-6 !max-w-lg !px-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-black/45">
          {product.protocolIndication}
        </p>
        <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
        <p className="mt-2 text-sm text-black/70">{product.doseSpecification}</p>

        <ProductCheckoutForm
          product={product}
          initialQtyId={product.quantityOptions[0].id}
          orderFlow="practitioner_for_patient"
          patientRecordId={patient.profile.recordId}
          patientName={patient.displayName}
          delivery={delivery}
          micronutrientId={(query.micronutrient as MicronutrientItemId) ?? null}
          protocolDose={product.defaultProtocolDose}
          successPath={`${CLINIC_ROUTES.panel}?ordered=${patient.profile.recordId}`}
          cancelPath={CLINIC_ROUTES.order(patientId)}
          submitLabel={`Place order for ${patient.displayName}`}
        />
      </div>
    </>
  )
}
