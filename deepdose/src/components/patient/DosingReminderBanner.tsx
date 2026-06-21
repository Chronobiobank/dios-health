'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BtiPayload } from '@/lib/bti/types'
import { getMedicationDisplayName } from '@/lib/medications/catalog'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Form'

interface DosingReminderBannerProps {
  payloads: BtiPayload[]
  remindersEnabled: boolean
  todayAcks: string[]
}

function medicationName(code: string): string {
  return getMedicationDisplayName(code)
}

export function DosingReminderBanner({
  payloads,
  remindersEnabled,
  todayAcks,
}: DosingReminderBannerProps) {
  const router = useRouter()
  const notifiedRef = useRef<Set<string>>(new Set())
  const [logging, setLogging] = useState<string | null>(null)
  const permissionRequested = useRef(false)

  const openWindows = payloads.filter(
    (p) => p.bti_status === 'WINDOW_OPEN' && !todayAcks.includes(p.medication_id)
  )

  const requestNotificationPermission = useCallback(async () => {
    if (permissionRequested.current || typeof Notification === 'undefined') return
    permissionRequested.current = true
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (!remindersEnabled || !openWindows.length) return
    void requestNotificationPermission()
  }, [remindersEnabled, openWindows.length, requestNotificationPermission])

  useEffect(() => {
    if (!remindersEnabled || typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return

    for (const payload of openWindows) {
      if (notifiedRef.current.has(payload.medication_id)) continue
      new Notification('DeepDose — dosing window open', {
        body: payload.display_instruction,
        tag: `deepdose-${payload.medication_id}`,
      })
      notifiedRef.current.add(payload.medication_id)
    }
  }, [openWindows, remindersEnabled])

  async function logTaken(medicationCode: string) {
    setLogging(medicationCode)
    await fetch('/api/patient/adherence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medication_code: medicationCode }),
    })
    setLogging(null)
    router.refresh()
  }

  if (!remindersEnabled || !openWindows.length) return null

  return (
    <div className="space-y-3">
      {openWindows.map((payload) => (
        <Callout key={payload.medication_id} tone="success">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-ink">
                {medicationName(payload.medication_id)}
              </p>
              <p className="text-sm">{payload.display_instruction}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              disabled={logging === payload.medication_id}
              onClick={() => logTaken(payload.medication_id)}
            >
              {logging === payload.medication_id ? 'Logging…' : 'I took it'}
            </Button>
          </div>
        </Callout>
      ))}
    </div>
  )
}
