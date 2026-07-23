import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { siteContent } from '../content/site-content'
import { AgentLab } from './agent-lab'
import {
  agentLabReducer,
  buildAgentLabRun,
  initialAgentLabState,
  nextScenarioTabIndex,
  traceTransition,
} from './agent-lab-model'

describe('AgentLab', () => {
  it('labels the experience as synthetic and renders accessible controls', () => {
    const markup = renderToStaticMarkup(<AgentLab />)

    expect(markup).toContain('Interactive synthetic walkthrough')
    expect(markup).toContain('No live model, customer data, or production execution.')
    expect(markup).toContain('role="tablist"')
    expect(markup.match(/role="tab"/g)).toHaveLength(siteContent.agentLab.scenarios.length)
    expect(markup).toContain('aria-selected="true"')
    expect(markup).toContain('type="radio"')
    expect(markup).toContain('aria-current="step"')
  })

  it('holds a review-every-action run at its human approval gate', () => {
    const scenario = siteContent.agentLab.scenarios[0]
    const approvalIndex = buildAgentLabRun(scenario, 'review-every-action', null)
      .findIndex(({ kind }) => kind === 'approval')
    const waiting = {
      ...initialAgentLabState,
      scenarioId: scenario.id,
      stepIndex: approvalIndex,
    }

    expect(agentLabReducer(waiting, { type: 'next' })).toEqual(waiting)

    const approved = agentLabReducer(waiting, { type: 'decide', decision: 'approved' })
    const approvedRun = buildAgentLabRun(scenario, approved.policy, approved.decision)

    expect(approvedRun[approvalIndex].label).toBe('Human approval recorded')
    expect(approvedRun.some(({ kind }) => kind === 'write')).toBe(true)
  })

  it('changes the run path for bounded autonomy and exception routing', () => {
    const lowRiskScenario = siteContent.agentLab.scenarios.find(({ risk }) => risk === 'low')
    expect(lowRiskScenario).toBeDefined()

    const boundedRun = buildAgentLabRun(lowRiskScenario!, 'bounded-autonomy', null)
    expect(boundedRun.some(({ kind }) => kind === 'approval')).toBe(false)
    expect(boundedRun).toContainEqual(expect.objectContaining({
      kind: 'policy',
      label: 'Policy check passed',
    }))

    const exceptionRun = buildAgentLabRun(
      siteContent.agentLab.scenarios[0],
      'review-every-action',
      'exception',
    )
    expect(exceptionRun).toContainEqual(expect.objectContaining({
      kind: 'write',
      label: 'Exception routed',
    }))
    expect(exceptionRun.at(-1)?.evidence).toContain('No system write')
  })

  it('supports keyboard tab movement without trapping focus', () => {
    expect(nextScenarioTabIndex(0, 'ArrowRight', 3)).toBe(1)
    expect(nextScenarioTabIndex(0, 'ArrowLeft', 3)).toBe(2)
    expect(nextScenarioTabIndex(1, 'Home', 3)).toBe(0)
    expect(nextScenarioTabIndex(1, 'End', 3)).toBe(2)
    expect(nextScenarioTabIndex(1, 'Tab', 3)).toBe(1)
  })

  it('removes trace animation when reduced motion is requested', () => {
    expect(traceTransition(true)).toEqual({ duration: 0 })
    expect(traceTransition(false).duration).toBeGreaterThan(0)
  })
})
