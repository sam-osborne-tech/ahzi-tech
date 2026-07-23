// @vitest-environment jsdom

import { readFileSync } from 'node:fs'
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DisclosureGroup } from './disclosure-group'

const items = [
  { detail: 'Alpha detail remains in the document.', id: 'sample-alpha', title: 'Alpha' },
  { detail: 'Beta detail remains in the document.', id: 'sample-beta', title: 'Beta' },
] as const

function renderGroup() {
  return render(
    <DisclosureGroup
      ariaLabel="Sample disclosures"
      getItemId={({ id }) => id}
      groupId="sample"
      items={items}
      renderPanel={({ detail }) => <p>{detail}</p>}
      renderSummary={({ title }) => <span>{title}</span>}
    />,
  )
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
  vi.restoreAllMocks()
})

describe('DisclosureGroup', () => {
  it('uses button accordion semantics with compact defaults and persistent content', () => {
    const { container } = renderGroup()
    const alpha = screen.getByRole('button', { name: 'Alpha' })
    const beta = screen.getByRole('button', { name: 'Beta' })

    expect(alpha).toHaveAttribute('aria-expanded', 'false')
    expect(beta).toHaveAttribute('aria-expanded', 'false')
    expect(alpha).toHaveAttribute('aria-controls', 'sample-alpha-panel')
    expect(beta).toHaveAttribute('aria-controls', 'sample-beta-panel')
    expect(container.textContent).toContain(items[0].detail)
    expect(container.textContent).toContain(items[1].detail)
    expect(document.getElementById('sample-alpha-panel')).toHaveAttribute('hidden')
    expect(document.getElementById('sample-beta-panel')).toHaveAttribute('hidden')
  })

  it('keeps exactly one item open', async () => {
    const user = userEvent.setup()
    renderGroup()
    const alpha = screen.getByRole('button', { name: 'Alpha' })
    const beta = screen.getByRole('button', { name: 'Beta' })

    await user.click(alpha)
    expect(alpha).toHaveAttribute('aria-expanded', 'true')
    expect(beta).toHaveAttribute('aria-expanded', 'false')

    await user.click(beta)
    expect(alpha).toHaveAttribute('aria-expanded', 'false')
    expect(beta).toHaveAttribute('aria-expanded', 'true')
  })

  it('supports native Enter and Space keyboard activation', async () => {
    const user = userEvent.setup()
    renderGroup()
    const alpha = screen.getByRole('button', { name: 'Alpha' })

    alpha.focus()
    await user.keyboard('{Enter}')
    expect(alpha).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard(' ')
    expect(alpha).toHaveAttribute('aria-expanded', 'false')
  })

  it('reveals and focuses a deep-linked item', async () => {
    window.history.replaceState(null, '', '#sample-beta')
    const focus = vi.spyOn(HTMLElement.prototype, 'focus')

    renderGroup()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Beta' })).toHaveAttribute(
        'aria-expanded',
        'true',
      ),
    )
    await waitFor(() => expect(focus).toHaveBeenCalled())
  })

  it('updates the hash and restores linked state on browser navigation', async () => {
    const user = userEvent.setup()
    renderGroup()

    await user.click(screen.getByRole('button', { name: 'Alpha' }))
    expect(window.location.hash).toBe('#sample-alpha')

    window.history.pushState(null, '', '#sample-beta')
    window.dispatchEvent(new PopStateEvent('popstate'))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Beta' })).toHaveAttribute(
        'aria-expanded',
        'true',
      ),
    )
  })

  it('disables disclosure motion when reduced motion is requested', () => {
    const styles = readFileSync('src/index.css', 'utf8')
    const reducedMotion = styles.slice(styles.indexOf('@media (prefers-reduced-motion: reduce)'))

    expect(reducedMotion).toContain('.disclosure-chevron')
    expect(reducedMotion).toContain('transition: none')
  })
})
