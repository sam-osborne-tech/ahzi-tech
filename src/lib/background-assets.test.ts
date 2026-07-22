/// <reference types="node" />

import { readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const appSource = readFileSync(join(repoRoot, 'src/App.tsx'), 'utf8')
const styles = readFileSync(join(repoRoot, 'src/index.css'), 'utf8')
const photosDirectory = join(repoRoot, 'public/photos')

const intendedStockImages = [
  {
    height: 1067,
    sectionMarker: 'aria-label="Who Ahzi helps"',
    source: '/photos/operations-containers.webp',
    width: 1600,
  },
  {
    height: 1034,
    sectionMarker: 'id="benefits"',
    source: '/photos/document-archive.webp',
    width: 1600,
  },
  {
    height: 1067,
    sectionMarker: 'id="why"',
    source: '/photos/enterprise-racks.webp',
    width: 1600,
  },
  {
    height: 1112,
    sectionMarker: 'id="first-sprint"',
    source: '/photos/build-terminal.webp',
    width: 1600,
  },
] as const

function sectionSource(marker: string) {
  const sectionStart = appSource.indexOf(marker)
  const sectionEnd = appSource.indexOf('</section>', sectionStart)

  expect(sectionStart, `Missing section marker ${marker}`).toBeGreaterThanOrEqual(0)
  expect(sectionEnd, `Missing section end for ${marker}`).toBeGreaterThan(sectionStart)
  return appSource.slice(sectionStart, sectionEnd)
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
  it('tracks every intended image with exact case, nonzero WebP content, and dimensions', () => {
    const exactFilenames = new Set(readdirSync(photosDirectory))
    const referencedPhotos = [...appSource.matchAll(/src="(\/photos\/[^"]+)"/g)]
      .map((match) => match[1])
      .sort()

    expect(referencedPhotos).toEqual(intendedStockImages.map(({ source }) => source).sort())

    for (const image of intendedStockImages) {
      const filename = basename(image.source)
      const bytes = readFileSync(join(photosDirectory, filename))
      const source = sectionSource(image.sectionMarker)

      expect(exactFilenames.has(filename), `${filename} must match its source reference`).toBe(true)
      expect(bytes.length, `${filename} must not be empty`).toBeGreaterThan(1024)
      expect(bytes.subarray(0, 4).toString()).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString()).toBe('WEBP')
      expect(source).toContain(`height={${image.height}}`)
      expect(source).toContain(`src="${image.source}"`)
      expect(source).toContain(`width={${image.width}}`)
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
  })
})
