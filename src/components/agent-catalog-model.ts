import type {
  AgentBusinessFunction,
  AgentPatternContent,
} from '../content/site-content'

export type AgentFilter = 'All' | AgentBusinessFunction

export function filterAgentPatterns(
  patterns: readonly AgentPatternContent[],
  filter: AgentFilter,
) {
  return filter === 'All'
    ? patterns
    : patterns.filter(({ businessFunction }) => businessFunction === filter)
}
