/// <reference types="node" />

import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import App from '../App'
import {
  insetPhotos,
  metadataImageFiles,
  sectionPhotos,
  siteImageFiles,
} from './site-assets'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const styles = readFileSync(join(repoRoot, 'src/index.css'), 'utf8')
const publicDirectory = join(repoRoot, 'public')
const buildDirectory = mkdtempSync(join(tmpdir(), 'ahzi-assets-'))

const expectedBackgrounds = [
  ['top', sectionPhotos.hero],
  ['audiences', sectionPhotos.audiences],
  ['benefits', sectionPhotos.benefits],
  ['platforms', sectionPhotos.platforms],
  ['how', sectionPhotos.approach],
  ['why', sectionPhotos.why],
  ['outputs', sectionPhotos.outputs],
  ['first-sprint', sectionPhotos.firstSprint],
  ['contact', sectionPhotos.contact],
] as const

beforeAll(async () => {
  await build({
    build: { outDir: buildDirectory },
    configFile: join(repoRoot, 'vite.config.ts'),
    logLevel: 'silent',
  })
})

afterAll(() => {
  rmSync(buildDirectory, { force: true, recursive: true })
})

function renderedSection(markup: string, id: string) {
  const marker = `id="${id}"`
  const markerIndex = markup.indexOf(marker)
  const sectionStart = markup.lastIndexOf('<section', markerIndex)
  const sectionEnd = markup.indexOf('</section>', markerIndex)

  expect(markerIndex, `Missing rendered section ${id}`).toBeGreaterThanOrEqual(0)
  expect(sectionStart, `Missing start for rendered section ${id}`).toBeGreaterThanOrEqual(0)
  expect(sectionEnd, `Missing end for rendered section ${id}`).toBeGreaterThan(sectionStart)
  return markup.slice(sectionStart, sectionEnd)
}

function webpDimensions(bytes: Buffer) {
  expect(bytes.subarray(0, 4).toString()).toBe('RIFF')
  expect(bytes.subarray(8, 12).toString()).toBe('WEBP')
  expect(bytes.subarray(12, 16).toString()).toBe('VP8 ')

  return {
    height: bytes.readUInt16LE(28) & 0x3fff,
    width: bytes.readUInt16LE(26) & 0x3fff,
  }
}

function treatmentContribution(scope: string) {
  const value = (name: string, suffix = '') => {
    const match = scope.match(new RegExp(`--${name}:\\s*([\\d.]+)${suffix}`))
    return Number(match?.[1])
  }

  const brightness = value('section-photo-brightness')
  const opacity = value('section-photo-opacity')
  const overlayAlpha = value('section-photo-overlay-alpha', '%') / 100

  return brightness * opacity * (1 - overlayAlpha)
}

describe('stock image backgrounds', () => {
  it('renders every intended background from an exact local WebP', () => {
    const markup = renderToStaticMarkup(createElement(App))

    for (const [sectionId, image] of expectedBackgrounds) {
      const bytes = readFileSync(join(publicDirectory, image.file))
      const section = renderedSection(markup, sectionId)

      expect(bytes.length, `${image.file} must not be empty`).toBeGreaterThan(1024)
      expect(webpDimensions(bytes)).toEqual({ height: image.height, width: image.width })
      expect(section).toContain('class="section-photo"')
      expect(section).toContain(`src="${image.src}"`)
      expect(section).toContain(`height="${image.height}"`)
      expect(section).toContain(`width="${image.width}"`)
    }

    const firstSprint = renderedSection(markup, 'first-sprint')
    expect(firstSprint).toContain('class="inset-photo"')
    expect(firstSprint).toContain(`src="${insetPhotos.firstSprint.src}"`)
  })

  it('copies every image to the production build with relative Pages paths', () => {
    const builtIndex = readFileSync(join(buildDirectory, 'index.html'), 'utf8')
    const builtJavaScript = readdirSync(join(buildDirectory, 'assets'))
      .filter((file) => file.endsWith('.js'))
      .map((file) => readFileSync(join(buildDirectory, 'assets', file), 'utf8'))
      .join('\n')

    for (const file of siteImageFiles) {
      expect(readFileSync(join(publicDirectory, file)).length).toBeGreaterThan(0)
      expect(readFileSync(join(buildDirectory, file)).length).toBeGreaterThan(0)
    }

    for (const image of [
      ...Object.values(sectionPhotos),
      ...Object.values(insetPhotos),
    ]) {
      expect(builtJavaScript).toContain(image.file)
    }

    expect(builtJavaScript).toMatch(/src:`\.\/\$\{[^}]+\}`/)
    expect(builtJavaScript).not.toMatch(/["']\/photos\//)
    expect(builtIndex).toContain('href="./favicon.svg"')
    for (const file of metadataImageFiles) {
      expect(builtIndex).toContain(file)
    }
  })

  it('keeps backdrop pixels visible on desktop and mobile', () => {
    const desktopStart = styles.indexOf('.section-photo {')
    const mobileStart = styles.indexOf('@media (max-width: 639px)')
    const desktopTreatment = styles.slice(desktopStart, styles.indexOf('}', desktopStart) + 1)
    const mobileTreatment = styles.slice(mobileStart)

    expect(treatmentContribution(desktopTreatment)).toBeGreaterThanOrEqual(0.14)
    expect(treatmentContribution(mobileTreatment)).toBeGreaterThanOrEqual(0.09)
    expect(styles).toContain('brightness(var(--section-photo-brightness))')
    expect(styles).toContain('opacity: var(--section-photo-opacity)')
    expect(styles).toContain('rgb(5 6 16 / var(--section-photo-overlay-alpha))')
    expect(styles).toContain('object-fit: cover')
  })
})
