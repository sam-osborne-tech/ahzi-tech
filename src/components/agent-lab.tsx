import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDot,
  Database,
  FileSearch,
  GitBranch,
  ListChecks,
  ShieldCheck,
  TriangleAlert,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { KeyboardEvent } from 'react'
import { useReducer } from 'react'
import { siteContent } from '../content/site-content'
import { sectionPhotos } from '../lib/site-assets'
import { cn } from '../lib/utils'
import {
  agentLabReducer,
  buildAgentLabRun,
  initialAgentLabState,
  nextScenarioTabIndex,
  policyById,
  scenarioById,
  traceTransition,
  type AgentLabAction,
  type AgentLabPolicy,
  type AgentLabState,
  type AgentLabStep,
  type AgentLabStepKind,
} from './agent-lab-model'
import { SectionHeading, SectionShell } from './marketing-components'

const controlButtonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-45'

const stepIcons: Record<AgentLabStepKind, LucideIcon> = {
  approval: ShieldCheck,
  context: Database,
  evaluation: ListChecks,
  plan: Workflow,
  policy: GitBranch,
  trigger: CircleDot,
  write: FileSearch,
}

function ScenarioTabs({
  activeId,
  dispatch,
}: {
  activeId: string
  dispatch: (action: AgentLabAction) => void
}) {
  const scenarios = siteContent.agentLab.scenarios
  const selectFromKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const nextIndex = nextScenarioTabIndex(currentIndex, event.key, scenarios.length)
    if (nextIndex === currentIndex && !['Home', 'End'].includes(event.key)) return
    event.preventDefault()
    dispatch({ scenarioId: scenarios[nextIndex].id, type: 'select-scenario' })
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    )
    tabs?.[nextIndex]?.focus()
  }

  return (
    <div
      aria-label="Agent scenarios"
      className="grid gap-2 sm:grid-cols-3"
      role="tablist"
    >
      {scenarios.map((scenario, index) => {
        const selected = scenario.id === activeId
        return (
          <button
            aria-controls="agent-lab-run-panel"
            aria-selected={selected}
            className={cn(
              controlButtonClass,
              'justify-start text-left',
              selected
                ? 'border-[var(--accent)] bg-[var(--accent-wash)] text-[var(--foreground)]'
                : 'border-[var(--line)] bg-[var(--surface)] text-[var(--foreground-muted)]',
            )}
            id={`agent-lab-tab-${scenario.id}`}
            key={scenario.id}
            onClick={() =>
              dispatch({ scenarioId: scenario.id, type: 'select-scenario' })
            }
            onKeyDown={(event) => selectFromKeyboard(event, index)}
            role="tab"
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            {scenario.label}
          </button>
        )
      })}
    </div>
  )
}

function PolicyControl({
  dispatch,
  policy,
}: {
  dispatch: (action: AgentLabAction) => void
  policy: AgentLabPolicy
}) {
  return (
    <fieldset className="mt-5 rounded-md border border-[var(--line)] p-4">
      <legend className="px-2 text-sm font-semibold text-[var(--foreground)]">
        Approval policy
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {siteContent.agentLab.policies.map((option) => (
          <label
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-md border p-3',
              option.id === policy
                ? 'border-[var(--accent)] bg-[var(--accent-wash)]'
                : 'border-[var(--line)]',
            )}
            key={option.id}
          >
            <input
              checked={option.id === policy}
              className="mt-1 accent-[var(--accent)]"
              name="agent-lab-policy"
              onChange={() => dispatch({ policy: option.id, type: 'set-policy' })}
              type="radio"
              value={option.id}
            />
            <span>
              <span className="block text-sm font-semibold text-[var(--foreground)]">
                {option.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[var(--foreground-muted)]">
                {option.body}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function TraceList({
  dispatch,
  highestStepIndex,
  run,
  stepIndex,
}: {
  dispatch: (action: AgentLabAction) => void
  highestStepIndex: number
  run: AgentLabStep[]
  stepIndex: number
}) {
  return (
    <ol aria-label="Agent run trace" className="grid gap-2">
      {run.map((step, index) => {
        const Icon = stepIcons[step.kind]
        const current = index === stepIndex
        const available = index <= highestStepIndex
        return (
          <li key={`${step.kind}-${step.label}`}>
            <button
              aria-current={current ? 'step' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                current
                  ? 'border-[var(--accent)] bg-[var(--accent-wash)] text-[var(--foreground)]'
                  : 'border-[var(--line)] text-[var(--foreground-muted)]',
              )}
              disabled={!available}
              onClick={() => dispatch({ stepIndex: index, type: 'inspect-step' })}
              type="button"
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="flex-1">{step.label}</span>
              {index < highestStepIndex ? (
                <Check aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
              ) : null}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function ApprovalActions({
  dispatch,
}: {
  dispatch: (action: AgentLabAction) => void
}) {
  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2">
      <button
        className={`${controlButtonClass} border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]`}
        onClick={() => dispatch({ decision: 'approved', type: 'decide' })}
        type="button"
      >
        <Check aria-hidden="true" className="h-4 w-4" />
        Approve action
      </button>
      <button
        className={`${controlButtonClass} border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)]`}
        onClick={() => dispatch({ decision: 'exception', type: 'decide' })}
        type="button"
      >
        <TriangleAlert aria-hidden="true" className="h-4 w-4" />
        Route exception
      </button>
    </div>
  )
}

function TraceDetail({
  dispatch,
  reducedMotion,
  state,
  step,
}: {
  dispatch: (action: AgentLabAction) => void
  reducedMotion: boolean
  state: AgentLabState
  step: AgentLabStep
}) {
  const waitingForDecision = step.kind === 'approval' && state.decision === null
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      aria-live="polite"
      className="photo-card rounded-md border border-[var(--line)] p-5"
      initial={reducedMotion ? false : { opacity: 0.45, y: 8 }}
      key={`${state.scenarioId}-${state.policy}-${state.stepIndex}-${state.decision}`}
      transition={traceTransition(reducedMotion)}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-muted)]">
        Current trace stage
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{step.label}</h3>
      <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{step.detail}</p>
      <div className="mt-5 rounded-md border border-[var(--line)] p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
          Evidence panel
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{step.evidence}</p>
      </div>
      {waitingForDecision ? <ApprovalActions dispatch={dispatch} /> : null}
    </motion.div>
  )
}

function RunNavigation({
  canContinue,
  dispatch,
  isComplete,
  state,
}: {
  canContinue: boolean
  dispatch: (action: AgentLabAction) => void
  isComplete: boolean
  state: AgentLabState
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        className={`${controlButtonClass} border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)]`}
        disabled={state.stepIndex === 0}
        onClick={() => dispatch({ type: 'previous' })}
        type="button"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Previous stage
      </button>
      <button
        className={`${controlButtonClass} border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]`}
        disabled={isComplete || !canContinue}
        onClick={() => dispatch({ type: 'next' })}
        type="button"
      >
        Continue run
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
      <button
        className={`${controlButtonClass} border-transparent text-[var(--foreground-muted)]`}
        onClick={() => dispatch({ type: 'restart' })}
        type="button"
      >
        Restart walkthrough
      </button>
    </div>
  )
}

export function AgentLab() {
  const [state, dispatch] = useReducer(agentLabReducer, initialAgentLabState)
  const reducedMotion = Boolean(useReducedMotion())
  const scenario = scenarioById(state.scenarioId)
  const run = buildAgentLabRun(scenario, state.policy, state.decision)
  const currentStep = run[state.stepIndex] ?? run[0]
  const isComplete = state.stepIndex === run.length - 1
  const canContinue = currentStep.kind !== 'approval' || state.decision !== null

  return (
    <SectionShell id="agent-lab" photo={sectionPhotos.approach} surface="ink">
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={Workflow} tone="ink" {...siteContent.agentLab.heading} />
        <div className="mt-8">
          <ScenarioTabs activeId={state.scenarioId} dispatch={dispatch} />
          <PolicyControl dispatch={dispatch} policy={state.policy} />
        </div>
        <div
          aria-labelledby={`agent-lab-tab-${scenario.id}`}
          className="mt-6 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]"
          id="agent-lab-run-panel"
          role="tabpanel"
        >
          <div>
            <div className="mb-4 rounded-md border border-[var(--ink-line)] p-4">
              <div className="text-sm font-semibold text-[var(--ink-foreground)]">
                {scenario.label}
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
                {scenario.summary}
              </p>
              <p className="mt-3 text-xs leading-5 text-[var(--accent-soft)]">
                Active policy: {policyById(state.policy).label}
              </p>
            </div>
            <TraceList
              dispatch={dispatch}
              highestStepIndex={state.highestStepIndex}
              run={run}
              stepIndex={state.stepIndex}
            />
          </div>
          <div>
            <TraceDetail
              dispatch={dispatch}
              reducedMotion={reducedMotion}
              state={state}
              step={currentStep}
            />
            <RunNavigation
              canContinue={canContinue}
              dispatch={dispatch}
              isComplete={isComplete}
              state={state}
            />
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
