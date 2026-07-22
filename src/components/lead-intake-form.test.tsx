import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LeadIntakeForm } from './lead-intake-form'

describe('LeadIntakeForm', () => {
  it('renders an accessible, low-friction qualification form', () => {
    const markup = renderToStaticMarkup(
      <LeadIntakeForm onPrepareDraft={() => true} />,
    )

    expect(markup).toContain('<form')
    expect(markup).toContain('Request a workflow fit review')
    expect(markup).toContain('for="lead-name"')
    expect(markup).toContain('name="email"')
    expect(markup).toContain('name="system"')
    expect(markup).toContain('name="workflow"')
    expect(markup).toContain('name="timing"')
    expect(markup).toContain('type="submit"')
    expect(markup).toContain('no third-party form or analytics scripts')
  })
})
