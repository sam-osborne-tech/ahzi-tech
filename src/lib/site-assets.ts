export type SitePhoto = {
  file: string
  height: number
  src: string
  width: number
}

function photo(file: string, width: number, height: number): SitePhoto {
  return {
    file,
    height,
    src: `${import.meta.env.BASE_URL}${file}`,
    width,
  }
}

export const sectionPhotos = {
  hero: photo('photos/hero-san-francisco.webp', 936, 1024),
  audiences: photo('photos/operations-containers.webp', 1600, 1067),
  benefits: photo('photos/document-archive.webp', 1600, 1034),
  platforms: photo('photos/platform-patch-panel.webp', 1024, 865),
  approach: photo('photos/pipeline-circuit.webp', 1024, 684),
  why: photo('photos/enterprise-racks.webp', 1600, 1067),
  outputs: photo('photos/outputs-linotype.webp', 1024, 683),
  firstSprint: photo('photos/first-sprint-blueprints.webp', 1024, 685),
  contact: photo('photos/contact-cranes.webp', 1024, 679),
} as const

export const insetPhotos = {
  firstSprint: photo('photos/build-terminal.webp', 1600, 1112),
} as const

export const metadataImageFiles = [
  'favicon.svg',
  'ahzi-logo.png',
  'ahzi-social.png',
] as const

export const siteImageFiles = [
  ...metadataImageFiles,
  ...Object.values(sectionPhotos).map(({ file }) => file),
  ...Object.values(insetPhotos).map(({ file }) => file),
]
