'use client'

import { useEffect, useRef } from 'react'

import {
  HOME_FACE_IDS,
  communityFaceUrl,
} from '@/lib/deepdose-marketing/community-faces'

const CENTER_ID = HOME_FACE_IDS[0]
const ORBIT_IDS = HOME_FACE_IDS.slice(1)

const CENTER_SIZE = 72
const ORBIT_SIZE = 40
const DUST_COUNT = 56
const ORBIT_RADIUS = 0.34

/** Soft pastels — visible on white, non-conformer energy (not grey clinical). */
const PASTELS = [
  { r: 244, g: 163, b: 198 }, // blush
  { r: 186, g: 168, b: 230 }, // lilac
  { r: 152, g: 214, b: 198 }, // mint
  { r: 255, g: 198, b: 158 }, // peach
  { r: 168, g: 198, b: 235 }, // sky
  { r: 232, g: 176, b: 214 }, // orchid
] as const

type Dust = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number
  maxLife: number
  /** +1 toward center, -1 outward to an orbiter */
  dir: 1 | -1
  orbitIndex: number
  pastel: (typeof PASTELS)[number]
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function spawnDust(orbitCount: number): Dust {
  const orbitIndex = Math.floor(Math.random() * orbitCount)
  const dir: 1 | -1 = Math.random() < 0.55 ? 1 : -1
  const angle = (orbitIndex / orbitCount) * Math.PI * 2 + rand(-0.2, 0.2)
  const along = dir === 1 ? rand(0.55, 0.95) : rand(0.08, 0.35)
  const radius = ORBIT_RADIUS * along
  return {
    x: 0.5 + Math.cos(angle) * radius,
    y: 0.5 + Math.sin(angle) * radius,
    vx: 0,
    vy: 0,
    r: rand(0.7, 2.1),
    life: rand(0, 0.4),
    maxLife: rand(3.2, 6.5),
    dir,
    orbitIndex,
    pastel: PASTELS[Math.floor(Math.random() * PASTELS.length)]!,
  }
}

export function HomeFaceNetwork() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const centerRef = useRef<HTMLSpanElement | null>(null)
  const orbitRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const maybeCtx = canvas.getContext('2d')
    if (!maybeCtx) return
    const ctx: CanvasRenderingContext2D = maybeCtx

    const orbitCount = ORBIT_IDS.length
    const angles = ORBIT_IDS.map((_, i) => (i / orbitCount) * Math.PI * 2)
    const dust: Dust[] = Array.from({ length: DUST_COUNT }, () => spawnDust(orbitCount))

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let last = performance.now()
    let spin = 0

    function resize() {
      if (!root || !canvas) return
      const rect = root.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function orbitPos(index: number, t: number) {
      const angle = angles[index] + spin + Math.sin(t * 0.35 + index) * 0.04
      const radius = ORBIT_RADIUS + Math.sin(t * 0.55 + index * 1.3) * 0.018
      return {
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius * 0.92,
        angle,
      }
    }

    function paintDust() {
      ctx.clearRect(0, 0, width, height)

      // Soft orbital ring
      const cx = width * 0.5
      const cy = height * 0.5
      const rx = width * ORBIT_RADIUS
      const ry = height * ORBIT_RADIUS * 0.92
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(186, 168, 230, 0.35)'
      ctx.lineWidth = 1
      ctx.stroke()

      for (const mote of dust) {
        const alpha = Math.sin((mote.life / mote.maxLife) * Math.PI) * 0.88
        if (alpha <= 0.02) continue
        const px = mote.x * width
        const py = mote.y * height
        const { r, g, b } = mote.pastel
        const glow = ctx.createRadialGradient(px, py, 0, px, py, mote.r * 4.2)
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`)
        glow.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.28})`)
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, mote.r * 4.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.beginPath()
        ctx.arc(px, py, mote.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function placeFaces(t: number) {
      const center = centerRef.current
      if (center) {
        const pulse = 1 + Math.sin(t * 1.1) * 0.035
        const size = CENTER_SIZE * pulse
        center.style.width = `${size}px`
        center.style.height = `${size}px`
        center.style.transform = `translate(${width * 0.5 - size / 2}px, ${height * 0.5 - size / 2}px)`
      }

      for (let i = 0; i < orbitCount; i += 1) {
        const el = orbitRefs.current[i]
        if (!el) continue
        const pos = orbitPos(i, t)
        const pulse = 1 + Math.sin(t * 1.4 + i) * 0.05
        const size = ORBIT_SIZE * pulse
        el.style.width = `${size}px`
        el.style.height = `${size}px`
        el.style.transform = `translate(${pos.x * width - size / 2}px, ${pos.y * height - size / 2}px)`
      }
    }

    function step(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000

      if (!reduceMotion) {
        spin += dt * 0.22

        for (let i = 0; i < dust.length; i += 1) {
          const mote = dust[i]
          mote.life += dt
          if (mote.life >= mote.maxLife || Math.random() < 0.003) {
            dust[i] = spawnDust(orbitCount)
            continue
          }

          const orbit = orbitPos(mote.orbitIndex, t)
          const targetX = mote.dir === 1 ? 0.5 : orbit.x
          const targetY = mote.dir === 1 ? 0.5 : orbit.y
          const dx = targetX - mote.x
          const dy = targetY - mote.y
          const dist = Math.hypot(dx, dy) || 0.001

          // Flow along the spoke between center and orbiter
          mote.vx += (dx / dist) * 0.0007 * dt * 60
          mote.vy += (dy / dist) * 0.0007 * dt * 60
          // Gentle orbital swirl so dust follows the ring
          mote.vx += (-dy / dist) * 0.00018
          mote.vy += (dx / dist) * 0.00018
          mote.vx += rand(-0.00025, 0.00025)
          mote.vy += rand(-0.00025, 0.00025)
          mote.vx *= 0.96
          mote.vy *= 0.96
          mote.x += mote.vx
          mote.y += mote.vy

          // Bounce direction when near destination — pheromones exchange
          if (dist < 0.04) {
            mote.dir = mote.dir === 1 ? -1 : 1
            if (Math.random() < 0.35) {
              mote.orbitIndex = Math.floor(Math.random() * orbitCount)
            }
          }
        }
      }

      placeFaces(t)
      paintDust()
      frame = requestAnimationFrame(step)
    }

    resize()
    placeFaces(0)
    paintDust()
    const ro = new ResizeObserver(resize)
    ro.observe(root)
    frame = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} className="home-face-net" aria-hidden>
      <canvas ref={canvasRef} className="home-face-net__field" />

      <span ref={centerRef} className="home-face-net__node home-face-net__node--center">
        <span className="home-face-net__aura" />
        <span className="home-face-net__aura home-face-net__aura--soft" />
        <span
          className="home-face-net__face"
          style={{ backgroundImage: `url(${communityFaceUrl(CENTER_ID, 220)})` }}
        />
      </span>

      {ORBIT_IDS.map((id, index) => (
        <span
          key={id}
          ref={(el) => {
            orbitRefs.current[index] = el
          }}
          className="home-face-net__node home-face-net__node--orbit"
        >
          <span className="home-face-net__aura home-face-net__aura--orbit" />
          <span
            className="home-face-net__face"
            style={{ backgroundImage: `url(${communityFaceUrl(id)})` }}
          />
        </span>
      ))}
    </div>
  )
}
