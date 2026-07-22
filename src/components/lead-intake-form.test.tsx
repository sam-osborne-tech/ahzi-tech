import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LeadIntakeForm } from './lead-intake-form'

describe('LeadIntakeForm', () => {
  it('renders an accessible, low-friction qualification form', () => {
    const markup = renderToStaticMarkup(
      <LeadIntakeForm formTitle="Share the workflow context" onPrepareDraft={() => true} />,
    )

    expect(markup).toContain('<form')
    expect(markup).toContain('Share the workflow context')
    expect(markup).toContain('for="lead-name"')
    expect(markup).toContain('name="email"')
    expect(markup).toContain('name="system"')
    expect(markup).toContain('name="workflow"')
    expect(markup).toContain('name="timing"')
    expect(markup).toContain('type="submit"')
    expect(markup).toContain('no third-party form or analytics scripts')
  })
})
