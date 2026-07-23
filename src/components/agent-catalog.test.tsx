// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import { siteContent } from '../content/site-content'
import { AgentCatalog } from './agent-catalog'
import { filterAgentPatterns } from './agent-catalog-model'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('AgentCatalog', () => {
  it('renders every buildable pattern with accessible disclosure controls', () => {
    const markup = renderToStaticMarkup(<AgentCatalog />)

    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(
      siteContent.agentCatalog.items.length,
    )
    expect(markup.match(/aria-controls="agent-[^"]+-panel"/g)).toHaveLength(
      siteContent.agentCatalog.items.length,
    )
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).toContain('role="group"')
    expect(markup).toContain('aria-live="polite"')
    expect(markup).toContain('Trigger')
    expect(markup).toContain('Reads')
    expect(markup).toContain('Actions')
    expect(markup).toContain('Writes')
    expect(markup).toContain('Human gate')
    expect(markup).toContain('Proof')
  })

  it('filters patterns by a useful business function', () => {
    const revenuePatterns = filterAgentPatterns(siteContent.agentCatalog.items, 'Revenue')
    const allPatterns = filterAgentPatterns(siteContent.agentCatalog.items, 'All')

    expect(revenuePatterns.length).toBeGreaterThan(0)
    expect(revenuePatterns.every(({ businessFunction }) => businessFunction === 'Revenue')).toBe(true)
    expect(allPatterns).toHaveLength(siteContent.agentCatalog.items.length)
  })

  it('keeps filter and one-open accordion state in sync', async () => {
    const user = userEvent.setup()
    render(<AgentCatalog />)
    const serviceAgent = siteContent.agentCatalog.items[0]

    await user.click(screen.getByRole('button', { name: new RegExp(serviceAgent.title, 'i') }))
    expect(screen.getByRole('button', { name: new RegExp(serviceAgent.title, 'i') }))
      .toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'Product' }))
    await waitFor(() =>
      expect(screen.queryByText(serviceAgent.title)).not.toBeInTheDocument(),
    )
    expect(window.location.hash).toBe('#agent-catalog')

    const productAgents = siteContent.agentCatalog.items.filter(
      ({ businessFunction }) => businessFunction === 'Product',
    )
    const first = screen.getByRole('button', { name: new RegExp(productAgents[0].title, 'i') })
    const second = screen.getByRole('button', { name: new RegExp(productAgents[1].title, 'i') })

    await user.click(first)
    await user.click(second)
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'true')
  })
})
