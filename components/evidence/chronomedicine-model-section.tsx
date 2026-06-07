'use client'

import { useState } from 'react'

import { ChronomedicineMatrix } from '@/components/evidence/chronomedicine-matrix'
import { ChronotherapyEvidencePanel } from '@/components/evidence/chronotherapy-evidence-panel'

export function ChronomedicineModelSection() {
  const [activeCluster, setActiveCluster] = useState<string>('foundation')

  return (
    <div className="chronotherapy-model-stack">
      <ChronomedicineMatrix
        activeRowId={activeCluster === 'foundation' ? null : activeCluster}
        onRowSelect={setActiveCluster}
      />
      <ChronotherapyEvidencePanel activeTabId={activeCluster} onTabChange={setActiveCluster} />
    </div>
  )
}
