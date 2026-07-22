const contactEmailParts = ['admin', 'ahzi.tech'] as const
const contactPhone = '+14702961095'

export const phoneTo = `tel:${contactPhone}`

export function buildMailTo(subject: string, body?: string) {
  const params = new URLSearchParams({ subject })

  if (body) params.set('body', body)

  return `mailto:${contactEmailParts.join('@')}?${params.toString()}`
}

export function openMailTo(subject = 'AI consulting conversation', body?: string) {
  window.location.href = buildMailTo(subject, body)
}
