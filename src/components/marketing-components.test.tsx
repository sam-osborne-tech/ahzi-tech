import { Route, Sparkles } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { siteContent } from '../content/site-content'
import { sectionPhotos } from '../lib/site-assets'
import {
  CardGrid,
  CtaBlock,
  GradientCard,
  ProofList,
  SectionHeading,
  SectionShell,
  UseCaseFlow,
} from './marketing-components'

describe('marketing components', () => {
  it('renders a reusable photographed section with a focused heading and card grid', () => {
    const markup = renderToStaticMarkup(
      <SectionShell id="example" photo={sectionPhotos.audiences} surface="soft">
        <SectionHeading
          badge="Example"
          body="One section, one narrative job."
          icon={Sparkles}
          title="Focused section"
        />
        <CardGrid columns={3}>
          <GradientCard>
            <h3>First card</h3>
          </GradientCard>
          <GradientCard>
            <h3>Second card</h3>
          </GradientCard>
        </CardGrid>
      </SectionShell>,
    )

    expect(markup).toContain('<section')
    expect(markup).toContain('id="example"')
    expect(markup).toContain('bg-[var(--background-soft)]')
    expect(markup).toContain('class="section-photo"')
    expect(markup).toContain('lg:grid-cols-3')
    expect(markup.match(/class="photo-card/g)).toHaveLength(2)
  })

  it('renders every deep use-case field and its accessible workflow sequence', () => {
    const useCase = siteContent.useCases.items[0]
    const markup = renderToStaticMarkup(<UseCaseFlow useCase={useCase} />)

    expect(markup).toContain(useCase.startingState)
    expect(markup).toContain('System map')
    expect(markup).toContain('Agent behavior')
    expect(markup).toContain('Human controls')
    expect(markup).toContain('Exception path')
    expect(markup).toContain('Decision evidence')
    expect(markup).toContain('aria-label="Workflow sequence"')
    useCase.flow.forEach((step) => expect(markup).toContain(step))
  })

  it('shares proof-list and CTA treatments without flattening their meaning', () => {
    const markup = renderToStaticMarkup(
      <>
        <ProofList items={['One checked claim', 'A different checked claim']} />
        <CtaBlock
          actions={[
            { icon: Route, label: 'Review a specific workflow', target: '#contact' },
          ]}
        />
      </>,
    )

    expect(markup.match(/<li/g)).toHaveLength(2)
    expect(markup).toContain('One checked claim')
    expect(markup).toContain('Review a specific workflow')
  })
})
