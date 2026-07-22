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

  it('renders every required use-case field and a contextual review route', () => {
    const useCase = siteContent.useCases.items[0]
    const markup = renderToStaticMarkup(<UseCaseFlow useCase={useCase} />)

    expect(markup).toContain(useCase.label)
    expect(markup).toContain(useCase.startingProblem)
    expect(markup).toContain('Systems involved')
    expect(markup).toContain('What the AI handles')
    expect(markup).toContain('What humans control')
    expect(markup).toContain('Decision evidence')
    expect(markup).toContain('href="#contact"')
    expect(markup).toContain(useCase.cta.label)
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
