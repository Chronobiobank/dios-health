'use client'

import { motion } from 'framer-motion'

import {
  dotStyleForSeverity,
  isElevatedSeverity,
  type DotStyle,
} from '@/lib/patient-dashboard/dashboard-indicators'
import type { SpectrumNode, SpectrumNodeId } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type ChronosomaticSpectrumProps = {
  nodes: SpectrumNode[]
  openNodeId: SpectrumNodeId | null
  onSelectNode: (id: SpectrumNodeId) => void
}

function SpectrumDotButton({
  node,
  isOpen,
  onSelect,
}: {
  node: SpectrumNode
  isOpen: boolean
  onSelect: () => void
}) {
  const style: DotStyle = dotStyleForSeverity(node.severity)
  const isSevere = node.severity === 'severe'

  return (
    <button
      type="button"
      onClick={onSelect}
      className="chronosomatic-spectrum__dot-btn"
      aria-expanded={isOpen}
      aria-label={`${node.label}, ${node.severity}`}
    >
      <span className="chronosomatic-spectrum__dot-wrap">
        {isSevere ? (
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
    </button>
  )
}

export function ChronosomaticSpectrum({ nodes, openNodeId, onSelectNode }: ChronosomaticSpectrumProps) {
  return (
    <div className="chronosomatic-spectrum">
      <div className="chronosomatic-spectrum__rail">
        <div className="chronosomatic-spectrum__track" aria-hidden />
        <div className="chronosomatic-spectrum__dots">
          {nodes.map((node) => (
            <SpectrumDotButton
              key={node.id}
              node={node}
              isOpen={openNodeId === node.id}
              onSelect={() => onSelectNode(node.id)}
            />
          ))}
        </div>
      </div>
      <div className="chronosomatic-spectrum__labels">
        {nodes.map((node) => (
          <button
            key={`${node.id}-label`}
            type="button"
            onClick={() => onSelectNode(node.id)}
            className={cn(
              'chronosomatic-spectrum__label-btn',
              isElevatedSeverity(node.severity) && 'chronosomatic-spectrum__label--concern'
            )}
          >
            {node.label}
          </button>
        ))}
      </div>
    </div>
  )
}
