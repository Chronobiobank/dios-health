'use client'

import { motion } from 'framer-motion'

import {
  dotStyleForSeverity,
  type DotStyle,
} from '@/lib/patient-dashboard/dashboard-indicators'
import type { SpectrumNode, SpectrumNodeId } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type ChronosomaticSpectrumProps = {
  nodes: SpectrumNode[]
  openNodeId: SpectrumNodeId | null
  onSelectNode: (id: SpectrumNodeId) => void
}

function normalDotSize(node: SpectrumNode): 'sm' | 'md' {
  if (node.severity !== 'normal') return 'sm'
  if (node.id === 'cancer-risk') return 'md'
  return 'sm'
}

function SpectrumDot({
  node,
  isOpen,
  onSelect,
}: {
  node: SpectrumNode
  isOpen: boolean
  onSelect: () => void
}) {
  const style: DotStyle = dotStyleForSeverity(node.severity, normalDotSize(node))
  const isCritical = node.severity === 'critical'

  return (
    <button
      type="button"
      onClick={onSelect}
      className="chronosomatic-spectrum__node-btn"
      aria-expanded={isOpen}
      aria-label={`${node.label}, ${node.severity}`}
    >
      <span className="chronosomatic-spectrum__dot-wrap">
        {isCritical ? (
          <>
            <motion.span
              className="chronosomatic-spectrum__pulse-ring"
              style={{ borderColor: style.border }}
              animate={{ scale: [0.75, 1.75], opacity: [0.85, 0] }}
              transition={{
                duration: 2.2,
                ease: 'easeOut',
                repeat: Infinity,
              }}
              aria-hidden
            />
            <motion.span
              className="chronosomatic-spectrum__pulse-ring"
              style={{ borderColor: style.border }}
              animate={{ scale: [0.75, 1.75], opacity: [0.85, 0] }}
              transition={{
                duration: 2.2,
                ease: 'easeOut',
                repeat: Infinity,
                delay: 0.8,
              }}
              aria-hidden
            />
          </>
        ) : null}
        <span
          className={cn('chronosomatic-spectrum__dot', isOpen && 'chronosomatic-spectrum__dot--open')}
          style={{
            width: style.size,
            height: style.size,
            backgroundColor: style.fill,
            borderColor: style.border,
            borderWidth: style.borderWidth,
          }}
        />
      </span>
      <span
        className={cn(
          'chronosomatic-spectrum__label',
          node.severity !== 'normal' && 'chronosomatic-spectrum__label--concern'
        )}
      >
        {node.label}
      </span>
    </button>
  )
}

export function ChronosomaticSpectrum({ nodes, openNodeId, onSelectNode }: ChronosomaticSpectrumProps) {
  return (
    <div className="chronosomatic-spectrum">
      <div className="chronosomatic-spectrum__track" aria-hidden />
      <div className="chronosomatic-spectrum__nodes">
        {nodes.map((node) => (
          <SpectrumDot
            key={node.id}
            node={node}
            isOpen={openNodeId === node.id}
            onSelect={() => onSelectNode(node.id)}
          />
        ))}
      </div>
    </div>
  )
}
