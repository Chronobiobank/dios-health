'use client'

import { motion } from 'framer-motion'

import {
  CHRONOIMMUNE_ZONES,
  ZONE_COLOUR_STYLES,
  type ChronoimmuneZoneId,
} from '@/lib/chronoimmune/indication-zones'
import { cn } from '@/lib/utils'

type ChronoimmuneIndicationSpectrumProps = {
  activeZoneId: ChronoimmuneZoneId
  openZoneId: ChronoimmuneZoneId | null
  onSelectZone: (id: ChronoimmuneZoneId) => void
}

function ZoneDot({
  zoneId,
  isActive,
  isOpen,
  onSelect,
}: {
  zoneId: ChronoimmuneZoneId
  isActive: boolean
  isOpen: boolean
  onSelect: () => void
}) {
  const zone = CHRONOIMMUNE_ZONES.find((z) => z.id === zoneId)!
  const style = ZONE_COLOUR_STYLES[zone.colour]
  const size = isActive ? style.size + 2 : style.size

  return (
    <button
      type="button"
      onClick={onSelect}
      className="chronosomatic-spectrum__dot-btn"
      aria-expanded={isOpen}
      aria-label={`Zone ${zoneId}: ${zone.title}${isActive ? ' — current indication' : ''}`}
      aria-current={isActive ? 'true' : undefined}
    >
      <span
        className="chronosomatic-spectrum__dot-wrap"
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      >
        {zone.neurodegenerationFlag && isActive ? (
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
            isActive && 'chronoimmune-spectrum__dot--active'
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

export function ChronoimmuneIndicationSpectrum({
  activeZoneId,
  openZoneId,
  onSelectZone,
}: ChronoimmuneIndicationSpectrumProps) {
  return (
    <div className="chronosomatic-spectrum chronoimmune-spectrum">
      <div className="chronosomatic-spectrum__rail">
        <div className="chronosomatic-spectrum__track" aria-hidden />
        <div className="chronosomatic-spectrum__dots">
          {CHRONOIMMUNE_ZONES.map((zone) => (
            <ZoneDot
              key={zone.id}
              zoneId={zone.id}
              isActive={zone.id === activeZoneId}
              isOpen={openZoneId === zone.id}
              onSelect={() => onSelectZone(zone.id)}
            />
          ))}
        </div>
      </div>
      <div className="chronosomatic-spectrum__labels">
        {CHRONOIMMUNE_ZONES.map((zone) => (
          <button
            key={`zone-label-${zone.id}`}
            type="button"
            onClick={() => onSelectZone(zone.id)}
            className={cn(
              'chronosomatic-spectrum__label-btn',
              zone.id === activeZoneId && 'chronoimmune-spectrum__label--active'
            )}
          >
            {zone.shortLabel}
          </button>
        ))}
      </div>
    </div>
  )
}
