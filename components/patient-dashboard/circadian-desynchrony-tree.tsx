'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

import {
  ALL_DESYNCHRONY_BRANCH_NODES,
  DESYNCHRONY_BRANCHES,
  DESYNCHRONY_ROOT,
  DESYNCHRONY_TRUNK,
  getDesynchronyNode,
  zoneStyleForNode,
  type DesynchronyTreeNode,
} from '@/lib/spectrum/desynchrony-tree'
import { cn } from '@/lib/utils'

type CircadianDesynchronyTreeProps = {
  activeNodeIds?: readonly string[]
  compact?: boolean
  showAxisNote?: boolean
}

function TreeDot({
  node,
  isActive,
  isOpen,
  onSelect,
  pulse,
}: {
  node: DesynchronyTreeNode
  isActive: boolean
  isOpen: boolean
  onSelect: () => void
  pulse?: boolean
}) {
  const style = zoneStyleForNode(node.typicalZoneId)
  const size = isActive ? style.size + 2 : style.size

  return (
    <button
      type="button"
      onClick={onSelect}
      className="chronosomatic-spectrum__dot-btn desynchrony-tree__dot-btn"
      aria-expanded={isOpen}
      aria-label={`${node.label}${isActive ? ' — active on your profile' : ''}`}
      aria-current={isActive ? 'true' : undefined}
    >
      <span
        className="chronosomatic-spectrum__dot-wrap"
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      >
        {pulse && isActive ? (
          <motion.span
            className="chronosomatic-spectrum__pulse-ring"
            style={{ borderColor: style.border }}
            animate={{ scale: [0.75, 1.75], opacity: [0.85, 0] }}
            transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity }}
            aria-hidden
          />
        ) : null}
        <span
          className={cn(
            'chronosomatic-spectrum__dot',
            isOpen && 'chronosomatic-spectrum__dot--open',
            isActive && 'desynchrony-tree__dot--active'
          )}
          style={{
            width: size,
            height: size,
            minWidth: size,
            minHeight: size,
            backgroundColor: style.fill,
            borderColor: style.border,
            borderWidth: isActive ? style.borderWidth + 0.5 : style.borderWidth,
            boxShadow: isActive ? `0 0 0 2px ${style.fill}` : undefined,
          }}
        />
      </span>
    </button>
  )
}

function NodeDetailPanel({ node }: { node: DesynchronyTreeNode }) {
  const style = zoneStyleForNode(node.typicalZoneId)

  return (
    <div className="desynchrony-tree__detail">
      <div className="desynchrony-tree__detail-head">
        <span
          className="desynchrony-tree__detail-dot"
          style={{ backgroundColor: style.fill, borderColor: style.border }}
        />
        <div>
          <p className="desynchrony-tree__detail-title">{node.label}</p>
          <p className="desynchrony-tree__detail-meta">
            {node.category.charAt(0).toUpperCase() + node.category.slice(1)} · Zone {node.typicalZoneId}{' '}
            typical
          </p>
        </div>
      </div>
      <dl className="desynchrony-tree__detail-grid">
        <div>
          <dt>Reclassification</dt>
          <dd>{node.reclassificationNote}</dd>
        </div>
        <div>
          <dt>NLRP3 mechanism</dt>
          <dd>{node.nlrp3Mechanism}</dd>
        </div>
        <div>
          <dt>DIOS measurement</dt>
          <dd>{node.diosMeasurement}</dd>
        </div>
        <div>
          <dt>Protocol module</dt>
          <dd>{node.protocolModule}</dd>
        </div>
      </dl>
    </div>
  )
}

export function CircadianDesynchronyTree({
  activeNodeIds = [],
  compact = false,
  showAxisNote = true,
}: CircadianDesynchronyTreeProps) {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null)
  const activeSet = new Set(activeNodeIds)

  const openNode = openNodeId ? getDesynchronyNode(openNodeId) : null

  const handleSelect = (id: string) => {
    setOpenNodeId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={cn('desynchrony-tree', compact && 'desynchrony-tree--compact')}>
      <div className="desynchrony-tree__spine">
        <div className="desynchrony-tree__spine-node">
          <TreeDot
            node={DESYNCHRONY_ROOT}
            isActive={activeSet.has(DESYNCHRONY_ROOT.id)}
            isOpen={openNodeId === DESYNCHRONY_ROOT.id}
            onSelect={() => handleSelect(DESYNCHRONY_ROOT.id)}
          />
          <button
            type="button"
            className="desynchrony-tree__spine-label"
            onClick={() => handleSelect(DESYNCHRONY_ROOT.id)}
          >
            {DESYNCHRONY_ROOT.label}
          </button>
        </div>
        <div className="desynchrony-tree__spine-line" aria-hidden />
        <div className="desynchrony-tree__spine-node">
          <TreeDot
            node={DESYNCHRONY_TRUNK}
            isActive={activeSet.has(DESYNCHRONY_TRUNK.id)}
            isOpen={openNodeId === DESYNCHRONY_TRUNK.id}
            onSelect={() => handleSelect(DESYNCHRONY_TRUNK.id)}
            pulse
          />
          <button
            type="button"
            className="desynchrony-tree__spine-label"
            onClick={() => handleSelect(DESYNCHRONY_TRUNK.id)}
          >
            {DESYNCHRONY_TRUNK.label}
          </button>
        </div>
      </div>

      <div className="desynchrony-tree__branches">
        {DESYNCHRONY_BRANCHES.map((branch) => (
          <div key={branch.id} className="desynchrony-tree__branch">
            <p className="desynchrony-tree__branch-title">{branch.title}</p>
            <p className="desynchrony-tree__branch-sub">{branch.subtitle}</p>
            <div className="desynchrony-tree__branch-rail">
              <div className="desynchrony-tree__branch-connector" aria-hidden />
              <div className="desynchrony-tree__branch-dots">
                {branch.nodes.map((node) => (
                  <div key={node.id} className="desynchrony-tree__branch-item">
                    <TreeDot
                      node={node}
                      isActive={activeSet.has(node.id)}
                      isOpen={openNodeId === node.id}
                      onSelect={() => handleSelect(node.id)}
                      pulse={node.typicalZoneId >= 4}
                    />
                    <button
                      type="button"
                      className={cn(
                        'desynchrony-tree__branch-label',
                        activeSet.has(node.id) && 'desynchrony-tree__branch-label--active'
                      )}
                      onClick={() => handleSelect(node.id)}
                    >
                      {node.shortLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {openNode ? <NodeDetailPanel node={openNode} /> : null}

      {showAxisNote ? (
        <p className="desynchrony-tree__axis-note">
          Diagnostic tree — where conditions sit upstream. Chronoimmune zones below assign protocol
          intensity separately. Zone reflects the most severe active indication across all branches.
        </p>
      ) : null}

      {!compact && activeNodeIds.length === 0 ? (
        <p className="desynchrony-tree__hint font-mono text-[10px] text-black/35">
          {ALL_DESYNCHRONY_BRANCH_NODES.length} branch nodes · select any dot to explore mechanism and
          measurement
        </p>
      ) : null}
    </div>
  )
}
