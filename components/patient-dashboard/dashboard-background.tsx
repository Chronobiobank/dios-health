'use client'

import { motion } from 'framer-motion'

import { ORB_COLORS } from '@/components/patient-dashboard/constants'

const ORBS = [
  { color: ORB_COLORS[0], size: 280, top: '-8%', left: '-12%', delay: 0, from: { x: 0, y: 0 }, to: { x: 36, y: 28 } },
  { color: ORB_COLORS[1], size: 240, top: '18%', right: '-18%', delay: 2.5, from: { x: 0, y: 0 }, to: { x: -42, y: 24 } },
  { color: ORB_COLORS[2], size: 320, bottom: '8%', left: '10%', delay: 5, from: { x: 0, y: 0 }, to: { x: 28, y: -32 } },
  { color: ORB_COLORS[3], size: 260, bottom: '-6%', right: '6%', delay: 7.5, from: { x: 0, y: 0 }, to: { x: -24, y: -36 } },
] as const

export function DashboardBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--cream)]" />
      {ORBS.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: 'blur(52px)',
            top: 'top' in orb ? orb.top : undefined,
            left: 'left' in orb ? orb.left : undefined,
            right: 'right' in orb ? orb.right : undefined,
            bottom: 'bottom' in orb ? orb.bottom : undefined,
          }}
          initial={orb.from}
          animate={orb.to}
          transition={{
            duration: 14 + index * 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  )
}
