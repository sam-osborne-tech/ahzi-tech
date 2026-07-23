const contactEmailParts = ['admin', 'ahzi.tech'] as const

export function buildMailTo(subject: string, body?: string) {
  const params = new URLSearchParams({ subject })

  if (body) params.set('body', body)

  return `mailto:${contactEmailParts.join('@')}?${params.toString()}`
}
