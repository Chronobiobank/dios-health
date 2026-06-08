import { ENGINE_FLOW_NODES } from '@/lib/pitch/how-it-works-engine-content'

export function DoseIntelligenceEngineFlow() {
  return (
    <div className="hiw-engine" aria-label="Dose intelligence engine flow">
      <ol className="hiw-engine__pipeline">
        {ENGINE_FLOW_NODES.map((node, index) => (
          <li key={node.id} className="hiw-engine__stage">
            <article className="hiw-engine__card">
              <p className="hiw-engine__step">{node.step}</p>
              <h3 className="hiw-engine__title">{node.title}</h3>
              <p className="hiw-engine__detail">{node.detail}</p>
              {node.outputs && node.outputs.length > 0 ? (
                <ul className="hiw-engine__tags" aria-label={`${node.title} outputs`}>
                  {node.outputs.map((tag) => (
                    <li key={tag} className="hiw-engine__tag">
                      {tag.replaceAll('_', ' ')}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
            {index < ENGINE_FLOW_NODES.length - 1 ? (
              <span className="hiw-engine__arrow" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="hiw-engine__loop-note" aria-hidden>
        ↺ anonymised telemetry returns to Chronobiobank
      </p>
    </div>
  )
}
