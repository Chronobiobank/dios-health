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
 * Screen / Score / Share / Sync on the ring.
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

    const onScene = Boolean(root.closest('.seco-marketing-scene-tile'))
    const count = HOW_IT_WORKS_STEPS.length
    // Equal spacing; first step (sleep score) at top, then clockwise.
    const angles = HOW_IT_WORKS_STEPS.map(
      (_, i) => -Math.PI / 2 + (i / count) * Math.PI * 2,
    )

    let width = 0
    let height = 0
    let orbitR = ORBIT_RADIUS

    function resize() {
      if (!root || !canvas || !ctx) return
      const rect = root.getBoundingClientRect()
      const side = Math.min(rect.width || 0, 26 * 16)
      if (side < 2) return
      // Pull radius in if nodes would clip the square stage.
      const maxR = 0.5 - (NODE_SIZE / 2 + 6) / side
      orbitR = Math.min(ORBIT_RADIUS, Math.max(0.22, maxR))
      width = side
      height = side
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function orbitPos(index: number) {
      const angle = angles[index]!
      return {
        x: 0.5 + Math.cos(angle) * orbitR,
        y: 0.5 + Math.sin(angle) * orbitR,
      }
    }

    function paintRing() {
      if (!ctx || width < 2) return
      ctx.clearRect(0, 0, width, height)

      const cx = width * 0.5
      const cy = height * 0.5
      const r = Math.min(width, height) * orbitR
      // Leave a clear gap so the stroke never runs behind glass disks
      const halfNode = (NODE_SIZE / 2 + 10) / r
      const arrowBack = 9
      const arrowHalf = 5.5

      ctx.strokeStyle = onScene ? 'rgba(255, 255, 255, 0.78)' : 'rgba(15, 23, 42, 0.32)'
      ctx.fillStyle = onScene ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 42, 0.38)'
      ctx.lineWidth = onScene ? 1.75 : 1.5
      ctx.lineCap = 'round'

      for (let i = 0; i < count; i += 1) {
        const a0 = angles[i]!
        const a1 = angles[(i + 1) % count]!
        // Clockwise span (angles increase clockwise in our layout)
        let start = a0 + halfNode
        let end = a1 - halfNode
        if (end <= start) end += Math.PI * 2

        ctx.beginPath()
        ctx.arc(cx, cy, r, start, end, false)
        ctx.stroke()

        // Arrowhead at the clockwise end of the arc
        const tipX = cx + Math.cos(end) * r
        const tipY = cy + Math.sin(end) * r
        const tx = -Math.sin(end)
        const ty = Math.cos(end)
        const nx = -ty
        const ny = tx
        const baseX = tipX - tx * arrowBack
        const baseY = tipY - ty * arrowBack

        ctx.beginPath()
        ctx.moveTo(tipX, tipY)
        ctx.lineTo(baseX + nx * arrowHalf, baseY + ny * arrowHalf)
        ctx.lineTo(baseX - nx * arrowHalf, baseY - ny * arrowHalf)
        ctx.closePath()
        ctx.fill()
      }
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
    <figure className="dd-how-loop-wrap" aria-label="How Deepdose Works">
      <div ref={rootRef} className="home-face-net dd-how-loop">
        <canvas ref={canvasRef} className="home-face-net__field" aria-hidden />

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
              <span className="dd-how-loop__lead">{step.lead}</span>
              <span className="dd-how-loop__rest">{step.rest}</span>
            </span>
          </Link>
        ))}
      </div>
    </figure>
  )
}
