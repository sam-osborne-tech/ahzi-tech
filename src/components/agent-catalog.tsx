import { Bot } from 'lucide-react'
import { useState } from 'react'
import {
  siteContent,
  type AgentPatternContent,
} from '../content/site-content'
import { sectionPhotos } from '../lib/site-assets'
import { cn } from '../lib/utils'
import {
  filterAgentPatterns,
  type AgentFilter,
} from './agent-catalog-model'
import { DisclosureGroup } from './disclosure-group'
import {
  SectionHeading,
  SectionShell,
} from './marketing-components'

function AgentDetail({ body, label }: { body: string; label: string }) {
  return (
    <div className="border-t border-[var(--line)] pt-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{body}</dd>
    </div>
  )
}

function agentDisclosureId(agent: AgentPatternContent) {
  return `agent-${agent.id}`
}

function AgentSummary({ businessFunction, outcome, title }: AgentPatternContent) {
  return (
    <span className="grid gap-2 text-left sm:grid-cols-[8rem_minmax(14rem,0.85fr)_minmax(18rem,1.15fr)] sm:items-center sm:gap-5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-muted)]">
        {businessFunction}
      </span>
      <span className="text-lg font-semibold text-[var(--foreground)]">{title}</span>
      <span className="text-sm leading-6 text-[var(--foreground-muted)]">{outcome}</span>
    </span>
  )
}

function AgentPanel({ agent }: { agent: AgentPatternContent }) {
  return (
    <dl className="grid gap-4 border-t border-[var(--line)] p-5 sm:p-6 lg:grid-cols-2">
      <AgentDetail body={agent.trigger} label="Trigger" />
      <AgentDetail body={agent.readsFrom} label="Reads" />
      <AgentDetail body={agent.actions} label="Actions" />
      <AgentDetail body={agent.writes} label="Writes" />
      <AgentDetail body={agent.humanGate} label="Human gate" />
      <AgentDetail body={agent.evidence} label="Proof" />
    </dl>
  )
}

export function AgentCatalog() {
  const [filter, setFilter] = useState<AgentFilter>('All')
  const visiblePatterns = filterAgentPatterns(siteContent.agentCatalog.items, filter)
  const selectFilter = (option: AgentFilter) => {
    setFilter(option)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#agent-catalog')
    }
  }

  return (
    <SectionShell id="agent-catalog" photo={sectionPhotos.outputs} spacing="compact" surface="soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={Bot} {...siteContent.agentCatalog.heading} />
        <div
          aria-label="Filter agent patterns by business function"
          className="mt-8 flex flex-wrap gap-2"
          role="group"
        >
          {siteContent.agentCatalog.filters.map((option) => (
            <button
              aria-pressed={option === filter}
              className={cn(
                'min-h-11 rounded-md border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                option === filter
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'border-[var(--line)] bg-[var(--surface)] text-[var(--foreground-muted)] hover:border-[var(--accent-muted)]',
              )}
              key={option}
              onClick={() => selectFilter(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="sr-only">
          Showing {filter === 'All' ? 'all business functions' : filter} agents.
        </p>
        <DisclosureGroup
          ariaLabel="Agent catalog"
          className="mt-8"
          getItemId={agentDisclosureId}
          groupId="agent-catalog"
          items={visiblePatterns}
          key={filter}
          renderPanel={(agent) => <AgentPanel agent={agent} />}
          renderSummary={(agent) => <AgentSummary {...agent} />}
        />
      </div>
    </SectionShell>
  )
}
