import {
  siteContent,
  type AgentLabScenarioContent,
} from '../content/site-content'

export type AgentLabPolicy = (typeof siteContent.agentLab.policies)[number]['id']
export type AgentLabDecision = 'approved' | 'exception' | null
export type AgentLabStepKind =
  | 'approval'
  | 'context'
  | 'evaluation'
  | 'plan'
  | 'policy'
  | 'trigger'
  | 'write'

export type AgentLabStep = {
  detail: string
  evidence: string
  kind: AgentLabStepKind
  label: string
}

export type AgentLabState = {
  decision: AgentLabDecision
  highestStepIndex: number
  policy: AgentLabPolicy
  scenarioId: string
  stepIndex: number
}

export type AgentLabAction =
  | { decision: Exclude<AgentLabDecision, null>; type: 'decide' }
  | { policy: AgentLabPolicy; type: 'set-policy' }
  | { scenarioId: string; type: 'select-scenario' }
  | { stepIndex: number; type: 'inspect-step' }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'restart' }

export const initialAgentLabState: AgentLabState = {
  decision: null,
  highestStepIndex: 0,
  policy: 'review-every-action',
  scenarioId: siteContent.agentLab.scenarios[0].id,
  stepIndex: 0,
}

export function scenarioById(id: string) {
  return (
    siteContent.agentLab.scenarios.find((scenario) => scenario.id === id) ??
    siteContent.agentLab.scenarios[0]
  )
}

export function policyById(id: AgentLabPolicy) {
  return siteContent.agentLab.policies.find((policy) => policy.id === id)!
}

function needsHumanApproval(scenario: AgentLabScenarioContent, policy: AgentLabPolicy) {
  return policy === 'review-every-action' || scenario.risk === 'controlled'
}

function approvalStep(decision: AgentLabDecision): AgentLabStep {
  if (decision === 'approved') {
    return {
      detail: 'The synthetic owner accepted the proposed action and its attached evidence.',
      evidence: 'Reviewer identity, decision, and accepted action recorded.',
      kind: 'approval',
      label: 'Human approval recorded',
    }
  }
  if (decision === 'exception') {
    return {
      detail: 'The synthetic owner rejected the action and sent the run to exception handling.',
      evidence: 'Reviewer identity, rejection reason, and exception owner recorded.',
      kind: 'approval',
      label: 'Human exception recorded',
    }
  }
  return {
    detail: 'Choose approval or exception routing before this walkthrough can continue.',
    evidence: 'No decision recorded. The synthetic write remains blocked.',
    kind: 'approval',
    label: 'Human approval required',
  }
}

function policyStep(
  scenario: AgentLabScenarioContent,
  approvalRequired: boolean,
): AgentLabStep {
  const confidence = scenario.risk === 'low' ? 'high' : 'mixed'
  return {
    detail: `Synthetic confidence is ${confidence}. ${scenario.riskReason}`,
    evidence: approvalRequired
      ? 'Policy result: pause for the named owner.'
      : 'Policy result: continue within the low-risk internal boundary.',
    kind: 'policy',
    label: approvalRequired ? 'Policy check requires owner' : 'Policy check passed',
  }
}

function writeStep(
  scenario: AgentLabScenarioContent,
  decision: AgentLabDecision,
  approvalRequired: boolean,
): AgentLabStep {
  if (decision === 'exception') {
    return {
      detail: 'The source context and rejected proposal move to the synthetic exception queue.',
      evidence: 'No system write. Exception route and owner recorded.',
      kind: 'write',
      label: 'Exception routed',
    }
  }
  return {
    detail: scenario.write,
    evidence: approvalRequired
      ? 'Approved synthetic action plus before-and-after record captured.'
      : 'Policy-cleared synthetic internal output captured.',
    kind: 'write',
    label: approvalRequired && decision === null ? 'Write held' : 'Synthetic action recorded',
  }
}

export function buildAgentLabRun(
  scenario: AgentLabScenarioContent,
  policy: AgentLabPolicy,
  decision: AgentLabDecision,
): AgentLabStep[] {
  const approvalRequired = needsHumanApproval(scenario, policy)
  const steps: AgentLabStep[] = [
    {
      detail: scenario.trigger,
      evidence: 'Synthetic event source and workflow owner identified.',
      kind: 'trigger',
      label: 'Trigger received',
    },
    {
      detail: scenario.reads.join(' • '),
      evidence: 'Read scope limited to the listed synthetic records and policy.',
      kind: 'context',
      label: 'Context and records read',
    },
    {
      detail: scenario.plan.join(' '),
      evidence: `Proposed tool action: ${scenario.action}`,
      kind: 'plan',
      label: 'Tool and action plan',
    },
    policyStep(scenario, approvalRequired),
  ]

  if (approvalRequired) steps.push(approvalStep(decision))
  steps.push(writeStep(scenario, decision, approvalRequired))
  steps.push({
    detail: scenario.evaluation,
    evidence:
      decision === 'exception'
        ? 'No system write. Exception evidence and audit outcome complete.'
        : 'Evaluation result, policy result, action trace, and audit outcome complete.',
    kind: 'evaluation',
    label: 'Evaluation and audit output',
  })
  return steps
}

function canAdvance(state: AgentLabState, run: AgentLabStep[]) {
  const current = run[state.stepIndex]
  return current?.kind !== 'approval' || state.decision !== null
}

export function agentLabReducer(
  state: AgentLabState,
  action: AgentLabAction,
): AgentLabState {
  if (action.type === 'select-scenario') {
    return { ...initialAgentLabState, policy: state.policy, scenarioId: action.scenarioId }
  }
  if (action.type === 'set-policy') {
    return { ...initialAgentLabState, policy: action.policy, scenarioId: state.scenarioId }
  }
  if (action.type === 'decide') return { ...state, decision: action.decision }
  if (action.type === 'restart') {
    return { ...initialAgentLabState, policy: state.policy, scenarioId: state.scenarioId }
  }
  if (action.type === 'previous') {
    return { ...state, stepIndex: Math.max(0, state.stepIndex - 1) }
  }
  if (action.type === 'inspect-step') {
    return action.stepIndex <= state.highestStepIndex
      ? { ...state, stepIndex: action.stepIndex }
      : state
  }

  const run = buildAgentLabRun(scenarioById(state.scenarioId), state.policy, state.decision)
  if (!canAdvance(state, run)) return state
  const nextIndex = Math.min(run.length - 1, state.stepIndex + 1)
  return {
    ...state,
    highestStepIndex: Math.max(state.highestStepIndex, nextIndex),
    stepIndex: nextIndex,
  }
}

export function nextScenarioTabIndex(current: number, key: string, count: number) {
  if (count <= 0) return 0
  if (key === 'ArrowRight') return (current + 1) % count
  if (key === 'ArrowLeft') return (current - 1 + count) % count
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return current
}

export function traceTransition(reducedMotion: boolean) {
  return { duration: reducedMotion ? 0 : 0.22 }
}
