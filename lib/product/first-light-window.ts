import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'

export type FirstLightWindowStatus = {
  isOpen: boolean
  scanDue: boolean
  outsideEntrainment: boolean
  windowEndHour: number
  message: string
}

/** Layer 1 entrainment window — dawn to ~9am local (memo). Civil twilight ≈ hour 5+. */
export function resolveFirstLightWindow(now = new Date()): FirstLightWindowStatus {
  const hour = now.getHours() + now.getMinutes() / 60
  const end = FIRST_LIGHT_PROTOCOL.windowEndHour
  const isOpen = hour >= 5 && hour < end
  const outsideEntrainment = hour >= end

  let message: string
  if (isOpen) {
    message = 'First Light window open — run your 60s morning scan outside.'
  } else if (outsideEntrainment) {
    message = `Outside today's entrainment window (before ${end}:00). You can still scan — timing precision is reduced.`
  } else {
    message = 'First Light window opens at civil dawn — DIOS will prompt you at sunrise.'
  }

  return {
    isOpen,
    scanDue: isOpen,
    outsideEntrainment,
    windowEndHour: end,
    message,
  }
}
