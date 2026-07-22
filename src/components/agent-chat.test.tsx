import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { AgentChat } from './agent-chat'

const originalWindow = globalThis.window

beforeAll(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      matchMedia: () => ({ matches: true }),
    },
  })
})

afterAll(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: originalWindow,
  })
})

describe('AgentChat', () => {
  it('preserves the scripted label and both real handoff paths', () => {
    const markup = renderToStaticMarkup(
      <AgentChat
        isOpen
        openProtectedMailTo={() => undefined}
        phoneHref="tel:+14702961095"
        restoreFocusRef={{ current: null }}
        setIsOpen={() => undefined}
      />,
    )

    expect(markup).toContain('Scripted demo, not a live model')
    expect(markup).toContain('Export brief')
    expect(markup).toContain('href="#agent"')
    expect(markup).toContain('href="tel:+14702961095"')
  })
})
