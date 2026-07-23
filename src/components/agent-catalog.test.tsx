import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { siteContent } from '../content/site-content'
import { AgentCatalog } from './agent-catalog'
import { filterAgentPatterns } from './agent-catalog-model'

describe('AgentCatalog', () => {
  it('renders every buildable pattern with accessible disclosure controls', () => {
    const markup = renderToStaticMarkup(<AgentCatalog />)

    expect(markup).toContain('Buildable agent pattern')
    expect(markup.match(/<details/g)).toHaveLength(siteContent.agentCatalog.items.length)
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).toContain('role="group"')
    expect(markup).toContain('aria-live="polite"')
    expect(markup).toContain('Trigger')
    expect(markup).toContain('Reads from')
    expect(markup).toContain('Human gate')
    expect(markup).toContain('Output and evidence')
  })

  it('filters patterns by a useful business function', () => {
    const revenuePatterns = filterAgentPatterns(siteContent.agentCatalog.items, 'Revenue')
    const allPatterns = filterAgentPatterns(siteContent.agentCatalog.items, 'All')

    expect(revenuePatterns.length).toBeGreaterThan(0)
    expect(revenuePatterns.every(({ businessFunction }) => businessFunction === 'Revenue')).toBe(true)
    expect(allPatterns).toHaveLength(siteContent.agentCatalog.items.length)
  })
})
