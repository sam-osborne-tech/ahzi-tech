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
  ['agent-lab', sectionPhotos.approach],
  ['offerings', sectionPhotos.audiences],
  ['agent-catalog', sectionPhotos.outputs],
  ['use-cases', sectionPhotos.benefits],
  ['proof', sectionPhotos.why],
  ['engagement', sectionPhotos.firstSprint],
  ['contact', sectionPhotos.contact],
] as const

const expectedPhotoCardCounts = [
  ['top', 1],
  ['agent-lab', 1],
  ['offerings', 5],
  ['agent-catalog', 7],
  ['use-cases', 3],
  ['proof', 5],
  ['engagement', 3],
  ['contact', 2],
] as const

const minimumPhotoCardOpacity = 1
const minimumTextContrast = 4.5

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

function customProperty(name: string) {
  const match = styles.match(new RegExp(`--${name}:\\s*([^;]+);`))

  expect(match, `Missing --${name}`).not.toBeNull()
  return match?.[1].trim() ?? ''
}

function colorOpacity(value: string) {
  if (/^#[\da-f]{3,8}$/i.test(value)) {
    return value.length === 5 || value.length === 9
      ? Number.parseInt(value.slice(-2), 16) / 255
      : 1
  }

  const alpha = value.match(/\/\s*([\d.]+)(%)?\s*\)/)
  if (!alpha) return 1

  const parsed = Number(alpha[1])
  return alpha[2] ? parsed / 100 : parsed
}

function finalLinearGradient(value: string) {
  const start = value.lastIndexOf('linear-gradient(')

  expect(start, 'Missing opaque base linear gradient').toBeGreaterThanOrEqual(0)
  if (start < 0) return ''

  const openingParenthesis = value.indexOf('(', start)
  let depth = 0
  for (let index = openingParenthesis; index < value.length; index += 1) {
    if (value[index] === '(') depth += 1
    if (value[index] === ')') depth -= 1
    if (depth === 0) return value.slice(start, index + 1)
  }

  throw new Error('Unclosed base linear gradient')
}

function gradientBaseOpacity(value: string) {
  const gradient = finalLinearGradient(value)
  const referencedTokens = [...gradient.matchAll(/var\(--([^)]+)\)/g)].map(
    (match) => match[1],
  )

  expect(gradient).not.toContain('transparent')
  expect(gradient).not.toMatch(/(?:rgba|hsla)\(/)
  expect(gradient.match(/color-mix\(/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
  expect(new Set(referencedTokens).size).toBeGreaterThanOrEqual(3)

  return Math.min(...referencedTokens.map((token) => colorOpacity(customProperty(token))))
}

type Rgb = [number, number, number]

function tokenRgb(name: string): Rgb {
  const value = customProperty(name)

  expect(value, `--${name} must be an opaque six-digit color`).toMatch(/^#[\da-f]{6}$/i)
  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ]
}

function mixRgb(first: Rgb, firstPercent: number, second: Rgb): Rgb {
  const firstWeight = firstPercent / 100

  return first.map((channel, index) =>
    channel * firstWeight + second[index] * (1 - firstWeight),
  ) as Rgb
}

function luminance([red, green, blue]: Rgb) {
  const linear = [red, green, blue].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })

  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

function contrastRatio(first: Rgb, second: Rgb) {
  const lighter = Math.max(luminance(first), luminance(second))
  const darker = Math.min(luminance(first), luminance(second))
  return (lighter + 0.05) / (darker + 0.05)
}

function gradientBaseColors(value: string) {
  const gradient = finalLinearGradient(value)
  const mixPattern =
    /color-mix\(in srgb,\s*var\(--([^)]+)\)\s*([\d.]+)%,\s*var\(--([^)]+)\)\)/g
  const mixedColors = [...gradient.matchAll(mixPattern)].map((match) =>
    mixRgb(tokenRgb(match[1]), Number(match[2]), tokenRgb(match[3])),
  )
  const directColors = [
    ...gradient
      .replace(mixPattern, '')
      .matchAll(/var\(--([^)]+)\)/g),
  ].map((match) => tokenRgb(match[1]))

  return [...mixedColors, ...directColors]
}

function cssRule(selector: string) {
  const start = styles.indexOf(`${selector} {`)
  const end = styles.indexOf('}', start)

  expect(start, `Missing CSS rule for ${selector}`).toBeGreaterThanOrEqual(0)
  expect(end, `Unclosed CSS rule for ${selector}`).toBeGreaterThan(start)
  return styles.slice(start, end + 1)
}

function photoCardClassNames(section: string) {
  return [...section.matchAll(/<(?:article|div|form)\b[^>]*class="([^"]*)"/g)]
    .map((match) => match[1])
    .filter((className) => className.split(/\s+/).includes('photo-card'))
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

    const proof = renderedSection(markup, 'proof')
    const engagement = renderedSection(markup, 'engagement')

    expect(proof.match(/class="inset-photo"/g)).toHaveLength(2)
    expect(proof).toContain(`src="${sectionPhotos.platforms.src}"`)
    expect(proof).toContain(`src="${sectionPhotos.outputs.src}"`)
    expect(engagement).toContain('class="inset-photo')
    expect(engagement).toContain(`src="${insetPhotos.firstSprint.src}"`)
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

  it('keeps every content card over photography opaque with layered palette gradients', () => {
    const markup = renderToStaticMarkup(createElement(App))

    for (const [sectionId, expectedCount] of expectedPhotoCardCounts) {
      const classNames = photoCardClassNames(renderedSection(markup, sectionId))

      expect(classNames, `${sectionId} photo card inventory`).toHaveLength(expectedCount)
      for (const className of classNames) {
        expect(className, `${sectionId} must not override the solid card surface`).not.toMatch(
          /(?:^|\s)(?:bg-|hover:bg-|focus(?:-within)?:bg-)/,
        )
      }
    }

    for (const token of [
      'photo-card-surface',
      'photo-card-hover-surface',
      'photo-card-ink-surface',
    ]) {
      const gradient = customProperty(token)

      expect(gradient.match(/(?:radial|linear)-gradient\(/g)?.length ?? 0).toBeGreaterThanOrEqual(
        2,
      )
      expect(gradientBaseOpacity(gradient), `--${token} base opacity`).toBeGreaterThanOrEqual(
        minimumPhotoCardOpacity,
      )

      const textColor = token === 'photo-card-ink-surface'
        ? tokenRgb('ink-muted')
        : tokenRgb('foreground-muted')
      for (const backgroundColor of gradientBaseColors(gradient)) {
        expect(contrastRatio(textColor, backgroundColor), `--${token} text contrast`)
          .toBeGreaterThanOrEqual(minimumTextContrast)
      }
    }

    expect(cssRule('.photo-card')).toContain('background: var(--photo-card-surface)')
    expect(cssRule('#agent-lab .photo-card')).toContain(
      'background: var(--photo-card-ink-surface)',
    )
    expect(cssRule('.photo-card-interactive:is(:hover, :focus-within)')).toContain(
      'background: var(--photo-card-hover-surface)',
    )
  })
})
