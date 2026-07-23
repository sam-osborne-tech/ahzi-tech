/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const scriptStart = '<script type="application/ld+json">'
const scriptEnd = '</script>'

function structuredDataFromIndex() {
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
  const start = html.indexOf(scriptStart)
  const end = html.indexOf(scriptEnd, start)

  if (start < 0 || end < 0) throw new Error('Structured data script is missing')

  return JSON.parse(html.slice(start + scriptStart.length, end))
}

describe('SEO metadata', () => {
  it('publishes valid structured data for the workflow selection offering', () => {
    const data = structuredDataFromIndex()
    const service = data['@graph'].find((entry: { '@type': string }) => entry['@type'] === 'Service')

    expect(service).toMatchObject({
      '@id': 'https://ahzi.tech/#workflow-selection-review',
      name: 'Workflow Selection Review',
      provider: { '@id': 'https://ahzi.tech/#organization' },
      url: 'https://ahzi.tech/#contact',
    })
  })
})
