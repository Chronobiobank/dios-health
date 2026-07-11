'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

import {
  HOW_IT_WORKS_STEPS,
} from '@/lib/deepdose-marketing/how-it-works-content'

/** Orbit radius as fraction of stage — kept inside so node disks aren't clipped. */
const ORBIT_RADIUS = 0.30
const NODE_SIZE = 104

/**
 * How CVP — same stage + placement as HomeFaceNetwork.
 * Hub title in the center; Max / Score / Flow on the ring.
 */
export function HowLoopDiagram() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodeRefs = useRef<Array<HTMLAnchorElement | null>>([])

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const count = HOW_IT_WORKS_STEPS.length
    // Equal spacing; first step (sleep score) at top, then clockwise.
    const angles = HOW_IT_WORKS_STEPS.map(
      (_, i) => -Math.PI / 2 + (i / count) * Math.PI * 2,
    )

    let width = 0
    let height = 0

    function resize() {
      if (!root || !canvas || !ctx) return
      const rect = root.getBoundingClientRect()
      const side = Math.min(rect.width || 0, 26 * 16)
      if (side < 2) return
      // Pull radius in if nodes would clip the square stage.
      const maxR = 0.5 - (NODE_SIZE / 2 + 6) / side
      const r = Math.min(ORBIT_RADIUS, Math.max(0.22, maxR))
      width = side
      height = side
      root.dataset.orbitR = String(r)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function orbitRadius() {
      const raw = root.dataset.orbitR
      const parsed = raw ? Number(raw) : ORBIT_RADIUS
      return Number.isFinite(parsed) ? parsed : ORBIT_RADIUS
    }

    function orbitPos(index: number) {
      const angle = angles[index]!
      const r = orbitRadius()
      return {
        x: 0.5 + Math.cos(angle) * r,
        y: 0.5 + Math.sin(angle) * r,
      }
    }

    function paintRing() {
      if (!ctx || width < 2) return
      ctx.clearRect(0, 0, width, height)
      const r = Math.min(width, height) * orbitRadius()
      ctx.beginPath()
      ctx.arc(width * 0.5, height * 0.5, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    function placeNodes() {
      if (width < 2) return
      for (let i = 0; i < count; i += 1) {
        const el = nodeRefs.current[i]
        if (!el) continue
        const pos = orbitPos(i)
        el.style.width = `${NODE_SIZE}px`
        el.style.height = `${NODE_SIZE}px`
        el.style.transform = `translate(${pos.x * width - NODE_SIZE / 2}px, ${pos.y * height - NODE_SIZE / 2}px)`
      }
    }

    function layout() {
      resize()
      placeNodes()
      paintRing()
    }

    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(root)
    return () => ro.disconnect()
  }, [])

  return (
    <figure className="dd-how-loop-wrap" aria-label="How Medmaxxing works">
      <div ref={rootRef} className="home-face-net dd-how-loop">
        <canvas ref={canvasRef} className="home-face-net__field" aria-hidden />

        <h1 className="dd-how-loop__center" aria-label="Medmaxxing">
          <span className="dd-how-loop__center-line" aria-hidden>
            Med
          </span>
          <span className="dd-how-loop__center-line" aria-hidden>
            maxxing
          </span>
        </h1>

        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <Link
            key={step.id}
            href={step.href}
            ref={(el) => {
              nodeRefs.current[index] = el
            }}
            className="home-face-net__node dd-how-loop__node"
            style={{ ['--cue' as string]: step.cue }}
            title={step.teaser}
            aria-label={`${step.lead} ${step.rest}`}
          >
            <span className="dd-how-loop__copy">
              <span className="dd-how-loop__lead">{step.lead}</span>{' '}
              <span className="dd-how-loop__rest">{step.rest}</span>
            </span>
          </Link>
        ))}
      </div>
    </figure>
  )
}
