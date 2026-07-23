import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from '../App'
import {
  siteContent,
  type AgentPatternContent,
  type OfferingContent,
  type UseCaseContent,
} from './site-content'

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

function pageHeadings() {
  return [
    siteContent.hero.title,
    siteContent.agentLab.heading.title,
    siteContent.offerings.heading.title,
    ...siteContent.offerings.items.map(({ title }) => title),
    siteContent.agentCatalog.heading.title,
    ...siteContent.agentCatalog.items.map(({ title }) => title),
    siteContent.useCases.heading.title,
    ...siteContent.useCases.items.map(({ title }) => title),
    siteContent.proof.heading.title,
    ...siteContent.proof.claims.map(({ title }) => title),
    siteContent.engagement.heading.title,
    siteContent.conversion.heading.title,
    siteContent.conversion.formTitle,
  ]
}

function offeringCopy(offering: OfferingContent) {
  return [
    offering.summary,
    offering.forWho,
    offering.problem,
    offering.work,
    offering.systems,
    ...offering.deliverables,
    offering.controls,
    offering.nextDecision,
  ]
}

function agentCopy(agent: AgentPatternContent) {
  return [
    agent.outcome,
    agent.trigger,
    agent.readsFrom,
    agent.actions,
    agent.writes,
    agent.humanGate,
    agent.evidence,
  ]
}

function useCaseCopy(useCase: UseCaseContent) {
  return [
    useCase.summary,
    useCase.startingState,
    useCase.systemMap,
    useCase.agentBehavior,
    useCase.humanControls,
    useCase.exceptionPath,
    useCase.decisionEvidence,
    ...useCase.flow,
  ]
}

function bodyCopy() {
  return [
    siteContent.hero.body,
    ...siteContent.hero.reviewOutputs,
    siteContent.agentLab.heading.body,
    ...siteContent.agentLab.policies.flatMap(({ body, label }) => [label, body]),
    ...siteContent.agentLab.scenarios.flatMap((scenario) => [
      scenario.summary,
      scenario.trigger,
      ...scenario.reads,
      ...scenario.plan,
      scenario.action,
      scenario.write,
      scenario.evaluation,
    ]),
    siteContent.offerings.heading.body,
    ...siteContent.offerings.items.flatMap(offeringCopy),
    siteContent.agentCatalog.heading.body,
    ...siteContent.agentCatalog.items.flatMap(agentCopy),
    siteContent.useCases.heading.body,
    ...siteContent.useCases.items.flatMap(useCaseCopy),
    siteContent.proof.heading.body,
    ...siteContent.proof.claims.map(({ body }) => body),
    ...siteContent.proof.controls,
    siteContent.engagement.heading.body,
    ...siteContent.engagement.steps.flatMap(({ body, title }) => [title, body]),
    siteContent.conversion.heading.body,
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

function tokenSet(value: string) {
  return new Set(
    normalize(value)
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((token) => token.length > 3),
  )
}

function similarity(first: string, second: string) {
  const firstTokens = tokenSet(first)
  const secondTokens = tokenSet(second)
  const intersection = [...firstTokens].filter((token) => secondTokens.has(token)).length
  const union = new Set([...firstTokens, ...secondTokens]).size
  return union ? intersection / union : 0
}

function assertCompleteOffering(offering: OfferingContent) {
  expect(offering.id).toBeTruthy()
  expect(offering.label).toBeTruthy()
  expect(offering.title).toBeTruthy()
  expect(offering.summary).toBeTruthy()
  expect(offering.forWho).toBeTruthy()
  expect(offering.problem).toBeTruthy()
  expect(offering.work).toBeTruthy()
  expect(offering.systems).toBeTruthy()
  expect(offering.deliverables.length).toBeGreaterThanOrEqual(3)
  expect(offering.controls).toBeTruthy()
  expect(offering.nextDecision).toBeTruthy()
}

function assertCompleteAgent(agent: AgentPatternContent) {
  expect(agent.id).toBeTruthy()
  expect(agent.businessFunction).toBeTruthy()
  expect(agent.outcome).toBeTruthy()
  expect(agent.trigger).toBeTruthy()
  expect(agent.readsFrom).toBeTruthy()
  expect(agent.actions).toBeTruthy()
  expect(agent.writes).toBeTruthy()
  expect(agent.humanGate).toBeTruthy()
  expect(agent.evidence).toBeTruthy()
}

function assertCompleteUseCase(useCase: UseCaseContent) {
  expect(useCase.id).toBeTruthy()
  expect(useCase.label).toBeTruthy()
  expect(useCase.title).toBeTruthy()
  expect(useCase.summary).toBeTruthy()
  expect(useCase.startingState).toBeTruthy()
  expect(useCase.systemMap).toBeTruthy()
  expect(useCase.agentBehavior).toBeTruthy()
  expect(useCase.humanControls).toBeTruthy()
  expect(useCase.exceptionPath).toBeTruthy()
  expect(useCase.decisionEvidence).toBeTruthy()
  expect(useCase.flow.length).toBeGreaterThanOrEqual(4)
}

describe('site content', () => {
  it('uses one distinct heading for every narrative job', () => {
    const headings = pageHeadings().map(normalize)
    expect(new Set(headings).size).toBe(headings.length)
  })

  it('does not repeat or closely paraphrase long body copy', () => {
    const pageSentences = sentences()
    const longBlocks = bodyCopy().filter((copy) => copy.length >= 80)

    expect(new Set(pageSentences).size).toBe(pageSentences.length)
    for (let first = 0; first < longBlocks.length; first += 1) {
      for (let second = first + 1; second < longBlocks.length; second += 1) {
        expect(
          similarity(longBlocks[first], longBlocks[second]),
          `Copy is too similar:\n${longBlocks[first]}\n${longBlocks[second]}`,
        ).toBeLessThan(0.72)
      }
    }
  })

  it('defines complete productized offerings with tangible decisions', () => {
    expect(siteContent.offerings.items.length).toBeGreaterThanOrEqual(4)
    expect(siteContent.offerings.items.length).toBeLessThanOrEqual(5)
    siteContent.offerings.items.forEach(assertCompleteOffering)
  })

  it('defines at least six complete agents', () => {
    expect(siteContent.agentCatalog.items.length).toBeGreaterThanOrEqual(6)
    siteContent.agentCatalog.items.forEach(assertCompleteAgent)
  })

  it('defines three sample Agent Lab scenarios with full run evidence', () => {
    expect(siteContent.agentLab.scenarios).toHaveLength(3)
    for (const scenario of siteContent.agentLab.scenarios) {
      expect(scenario.trigger).toBeTruthy()
      expect(scenario.reads.length).toBeGreaterThanOrEqual(3)
      expect(scenario.plan.length).toBeGreaterThanOrEqual(2)
      expect(scenario.action).toBeTruthy()
      expect(scenario.write).toBeTruthy()
      expect(scenario.evaluation).toBeTruthy()
    }
  })

  it('deepens exactly three use cases with controls and exception paths', () => {
    expect(siteContent.useCases.items).toHaveLength(3)
    siteContent.useCases.items.forEach(assertCompleteUseCase)
  })

  it('keeps disclosure groups compact while retaining every detail in the HTML', () => {
    const markup = renderToStaticMarkup(createElement(App))
    const disclosureIds = [
      ...siteContent.offerings.items.map(({ id }) => id),
      ...siteContent.agentCatalog.items.map(({ id }) => `agent-${id}`),
      ...siteContent.useCases.items.map(({ id }) => id),
    ]

    expect(new Set(disclosureIds).size).toBe(disclosureIds.length)
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(disclosureIds.length)
    expect(markup).not.toContain('aria-expanded="true"')
    disclosureIds.forEach((id) => {
      expect(markup).toContain(`id="${id}"`)
      expect(markup).toContain(`id="${id}-panel"`)
    })
    siteContent.useCases.items.forEach(({ decisionEvidence }) =>
      expect(markup).toContain(decisionEvidence),
    )
  })

  it('limits quantitative proof to the verified agreement population', () => {
    const quantitativeClaims = bodyCopy().filter((copy) => /\d/.test(copy))
    expect(quantitativeClaims).toEqual([
      expect.stringMatching(/more than 5,000 agreements/i),
    ])
  })

  it('excludes unsupported claims and disallowed punctuation', () => {
    const copy = [...pageHeadings(), ...bodyCopy()].join('\n')

    expect(copy).not.toMatch(/[–—]/)
    expect(copy).not.toMatch(
      /\b(?:certified partner|guaranteed|industry-leading|best-in-class|cost savings|roi|accuracy rate)\b/i,
    )
    expect(copy).not.toMatch(/\$\s?\d|\d+\s?%/)
  })

  it('removes hedging and defensive AI meta-copy from public content', () => {
    const copy = [...pageHeadings(), ...bodyCopy()].join('\n')

    expect(copy).not.toMatch(
      /\b(?:synthetic walkthrough|no model|not a live model|illustrative|example only|could|may|designed to|can help)\b/i,
    )
    expect(copy).not.toMatch(/\b(?:not claims? of|production execution|what the ui is not)\b/i)
  })

  it('renders the new information architecture in the intended order', () => {
    const markup = renderToStaticMarkup(createElement(App))
    const renderedInventory = [
      ...pageHeadings(),
      ...siteContent.agentLab.scenarios.map(({ label }) => label),
      ...siteContent.offerings.items.map(({ title }) => title),
      ...siteContent.agentCatalog.items.map(({ title }) => title),
      ...siteContent.useCases.items.map(({ title }) => title),
      ...siteContent.callsToAction.map(({ label }) => label),
    ]
    const sectionIndexes = siteContent.narrativeOrder.map((id) => markup.indexOf(`id="${id}"`))

    renderedInventory.forEach((value) => expect(markup).toContain(value))
    expect(sectionIndexes.every((index) => index >= 0)).toBe(true)
    expect(sectionIndexes).toEqual([...sectionIndexes].sort((first, second) => first - second))
  })
})
