import { Bot, ChevronDown } from 'lucide-react'
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
import {
  CardGrid,
  GradientCard,
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

function AgentPatternCard({ agent }: { agent: AgentPatternContent }) {
  return (
    <GradientCard className="p-0" interactive>
      <details className="group h-full">
        <summary className="flex min-h-64 cursor-pointer list-none flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-muted)]">
              {agent.businessFunction}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-open:rotate-180"
            />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{agent.title}</h3>
          <p className="mt-4 flex-1 text-sm leading-6 text-[var(--foreground-muted)]">
            {agent.summary}
          </p>
          <span className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
            {agent.status}
          </span>
        </summary>
        <dl className="grid gap-4 border-t border-[var(--line)] p-5">
          <AgentDetail body={agent.trigger} label="Trigger" />
          <AgentDetail body={agent.readsFrom} label="Reads from" />
          <AgentDetail body={agent.workPerformed} label="Work performed" />
          <AgentDetail body={agent.writesActions} label="Writes and actions" />
          <AgentDetail body={agent.humanGate} label="Human gate" />
          <AgentDetail body={agent.evidence} label="Output and evidence" />
        </dl>
      </details>
    </GradientCard>
  )
}

export function AgentCatalog() {
  const [filter, setFilter] = useState<AgentFilter>('All')
  const visiblePatterns = filterAgentPatterns(siteContent.agentCatalog.items, filter)

  return (
    <SectionShell id="agent-catalog" photo={sectionPhotos.outputs} surface="soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={Bot} {...siteContent.agentCatalog.heading} />
        <p className="mt-6 max-w-3xl rounded-md border border-[var(--accent-border)] bg-[var(--accent-wash)] px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
          {siteContent.agentCatalog.patternNote}
        </p>
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
              onClick={() => setFilter(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="sr-only">
          Showing {filter === 'All' ? 'all business functions' : filter} agent patterns.
        </p>
        <CardGrid className="mt-8 items-start" columns={3}>
          {visiblePatterns.map((agent) => (
            <AgentPatternCard agent={agent} key={agent.id} />
          ))}
        </CardGrid>
      </div>
    </SectionShell>
  )
}
