'use client'

import { useState } from 'react'

import {
  D3_DECISION_GATES,
  D3_OUTCOME_ACTIONS,
  D3_OUTCOME_LABELS,
  D3_SCENARIOS,
  type D3ScenarioId,
} from '@/lib/pitch/how-it-works-engine-content'
import { cn } from '@/lib/utils'

export function D3ClinicalDecisionTree() {
  const [activeScenarioId, setActiveScenarioId] = useState<D3ScenarioId>('sarah-mitchell')
  const scenario = D3_SCENARIOS.find((s) => s.id === activeScenarioId) ?? D3_SCENARIOS[0]
  const activeBranches = new Set(scenario.branchIds)

  return (
    <div className="hiw-d3-tree">
      <div className="hiw-d3-tree__scenarios" role="tablist" aria-label="Example patient paths">
        {D3_SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeScenarioId === item.id}
            className={cn(
              'hiw-d3-tree__scenario',
              activeScenarioId === item.id && 'hiw-d3-tree__scenario--active'
            )}
            onClick={() => setActiveScenarioId(item.id)}
          >
            <span className="hiw-d3-tree__scenario-name">{item.name}</span>
            <span className="hiw-d3-tree__scenario-id">{item.recordId}</span>
          </button>
        ))}
      </div>

      <div className="hiw-d3-tree__gates">
        {D3_DECISION_GATES.map((gate) => (
          <section key={gate.id} className="hiw-d3-tree__gate" aria-labelledby={`gate-${gate.id}`}>
            <div className="hiw-d3-tree__gate-head">
              <p className="hiw-d3-tree__gate-label">{gate.label}</p>
              <h3 className="hiw-d3-tree__gate-question" id={`gate-${gate.id}`}>
                {gate.question}
              </h3>
            </div>
            <ul className="hiw-d3-tree__branches">
              {gate.branches.map((branch) => {
                const isActive = activeBranches.has(branch.id)
                const outcome = branch.outcome

                return (
                  <li key={branch.id}>
                    <div
                      className={cn(
                        'hiw-d3-tree__branch',
                        isActive && 'hiw-d3-tree__branch--active',
                        outcome && `hiw-d3-tree__branch--${outcome}`
                      )}
                    >
                      <p className="hiw-d3-tree__branch-condition">{branch.condition}</p>
                      <p className="hiw-d3-tree__branch-action">{branch.action}</p>
                      {outcome ? (
                        <p className={cn('hiw-d3-tree__outcome', `hiw-d3-tree__outcome--${outcome}`)}>
                          {D3_OUTCOME_LABELS[outcome]}
                        </p>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="hiw-d3-tree__result" aria-live="polite">
        <p className="hiw-d3-tree__result-label">Path result</p>
        <p className={cn('hiw-d3-tree__result-outcome', `hiw-d3-tree__result-outcome--${scenario.outcome}`)}>
          {D3_OUTCOME_LABELS[scenario.outcome]}
        </p>
        <p className="hiw-d3-tree__result-summary">{scenario.summary}</p>
        <p className="hiw-d3-tree__result-foot">{D3_OUTCOME_ACTIONS[scenario.outcome]}</p>
      </aside>
    </div>
  )
}
