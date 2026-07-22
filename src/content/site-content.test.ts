import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { siteContent, type UseCaseContent } from './site-content'

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

function pageHeadings() {
  return [
    siteContent.hero.title,
    siteContent.hero.reviewTitle,
    siteContent.audience.heading.title,
    ...siteContent.audience.cards.map(({ title }) => title),
    siteContent.useCases.heading.title,
    ...siteContent.useCases.items.map(({ title }) => title),
    siteContent.delivery.heading.title,
    ...siteContent.delivery.stages.map(({ title }) => title),
    siteContent.proof.heading.title,
    ...siteContent.proof.claims.map(({ title }) => title),
    siteContent.proof.platformHeading,
    ...siteContent.proof.platforms.map(({ name }) => name),
    siteContent.engagement.heading.title,
    siteContent.engagement.startingPointTitle,
    siteContent.engagement.deliverablesTitle,
    siteContent.conversion.heading.title,
    siteContent.conversion.replyTitle,
    siteContent.conversion.formTitle,
  ]
}

function bodyCopy() {
  return [
    siteContent.hero.body,
    ...siteContent.hero.reviewDecisions,
    siteContent.hero.reviewResult,
    siteContent.audience.heading.body,
    ...siteContent.audience.cards.map(({ body }) => body),
    siteContent.useCases.heading.body,
    ...siteContent.useCases.items.flatMap((useCase) => [
      useCase.startingProblem,
      useCase.systemsInvolved,
      useCase.aiHandles,
      useCase.humanControls,
      useCase.decisionEvidence,
      useCase.publicProof ?? '',
    ]),
    siteContent.delivery.heading.body,
    ...siteContent.delivery.stages.map(({ body }) => body),
    siteContent.delivery.pipelineLabel,
    siteContent.proof.heading.body,
    ...siteContent.proof.claims.map(({ body }) => body),
    ...siteContent.proof.platforms.map(({ focus }) => focus),
    siteContent.proof.platformNote,
    siteContent.engagement.heading.body,
    siteContent.engagement.startingPoint,
    ...siteContent.engagement.deliverables,
    siteContent.conversion.heading.body,
    ...siteContent.conversion.replyCovers,
  ].filter(Boolean)
}

function sentences() {
  return bodyCopy().flatMap((copy) =>
    copy
      .split(/(?<=[.!?])\s+/)
      .map(normalize)
      .filter(Boolean),
  )
}

function assertCompleteUseCase(useCase: UseCaseContent) {
  expect(useCase.label).toBeTruthy()
  expect(useCase.title).toBeTruthy()
  expect(useCase.startingProblem).toBeTruthy()
  expect(useCase.systemsInvolved).toBeTruthy()
  expect(useCase.aiHandles).toBeTruthy()
  expect(useCase.humanControls).toBeTruthy()
  expect(useCase.decisionEvidence).toBeTruthy()
  expect(useCase.cta.label).toBeTruthy()
  expect(useCase.cta.target).toBe('#contact')
}

describe('site content', () => {
  it('uses one distinct heading for every narrative job', () => {
    const headings = pageHeadings().map(normalize)

    expect(new Set(headings).size).toBe(headings.length)
  })

  it('does not repeat body sentences across sections', () => {
    const pageSentences = sentences()

    expect(new Set(pageSentences).size).toBe(pageSentences.length)
  })

  it('limits quantitative proof to the verified agreement population', () => {
    const quantitativeClaims = bodyCopy().filter((copy) => /\d/.test(copy))

    expect(quantitativeClaims).toEqual([
      expect.stringMatching(/more than 5,000 agreements/i),
    ])
  })

  it('defines every production-decision field for exactly three use cases', () => {
    expect(siteContent.useCases.items).toHaveLength(3)
    siteContent.useCases.items.forEach(assertCompleteUseCase)
  })

  it('uses unique CTA language while preserving the workflow review route', () => {
    const ctas = siteContent.callsToAction
    const labels = ctas.map(({ label }) => normalize(label))

    expect(new Set(labels).size).toBe(labels.length)
    expect(siteContent.useCases.items.every(({ cta }) => cta.target === '#contact')).toBe(true)
    expect(ctas.filter(({ target }) => target === '#contact').length).toBeGreaterThanOrEqual(4)
  })

  it('renders every audited copy field in the intended narrative order', () => {
    const markup = renderToStaticMarkup(createElement(App))
    const copy = [
      ...pageHeadings(),
      ...bodyCopy(),
      ...siteContent.callsToAction.map(({ label }) => label),
    ]
    const sectionIndexes = siteContent.narrativeOrder.map((id) => markup.indexOf(`id="${id}"`))

    copy.forEach((value) => expect(markup).toContain(value))
    expect(sectionIndexes.every((index) => index >= 0)).toBe(true)
    expect(sectionIndexes).toEqual([...sectionIndexes].sort((first, second) => first - second))
  })
})
