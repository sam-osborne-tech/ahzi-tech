import { buildMailTo } from './contact'

const minimumSubmissionTimeMs = 1_500
const maximumEmailLength = 254
const maximumNameLength = 80
const maximumCompanyLength = 120
const minimumWorkflowLength = 20
const maximumWorkflowLength = 1_500
const maximumAttributionLength = 160

export const systemOptions = [
  'Salesforce or another CRM',
  'Document or contract repository',
  'Internal operations system',
  'Customer-facing product',
  'Multiple systems',
  'Not sure yet',
] as const

export const timingOptions = [
  'Ready to scope now',
  'Planning this quarter',
  'Exploring a future initiative',
] as const

const campaignKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

type CampaignKey = (typeof campaignKeys)[number]

export type LeadIntakeValues = {
  company: string
  email: string
  name: string
  system: string
  timing: string
  website: string
  workflow: string
}

export type LeadIntakeField = keyof Omit<LeadIntakeValues, 'website'>

export type LeadAttribution = {
  campaign: Partial<Record<CampaignKey, string>>
  landingPage: string
  referrer?: string
}

export type LeadValidationResult = {
  errors: Partial<Record<LeadIntakeField, string>>
  isSpam: boolean
}

function cleanText(value: string, maximumLength: number) {
  const bounded = value.slice(0, maximumLength * 2)
  const safeCharacters = Array.from(bounded).filter((character) => {
    const code = character.charCodeAt(0)
    return code >= 32 || code === 9 || code === 10 || code === 13
  })

  return safeCharacters.join('').trim().slice(0, maximumLength)
}

function cleanSingleLine(value: string, maximumLength: number) {
  return cleanText(value, maximumLength)
    .split(/\s+/)
    .filter(Boolean)
    .join(' ')
}

function isValidEmail(value: string) {
  if (!value || value.length > maximumEmailLength || value.includes(' ')) return false

  const parts = value.split('@')
  if (parts.length !== 2) return false

  const [localPart, domain] = parts
  return Boolean(
    localPart &&
      domain &&
      domain.includes('.') &&
      !domain.startsWith('.') &&
      !domain.endsWith('.'),
  )
}

function isOneOf(value: string, options: readonly string[]) {
  return options.includes(value)
}

export function validateLeadIntake(
  values: LeadIntakeValues,
  startedAt: number,
  submittedAt: number,
): LeadValidationResult {
  const errors: LeadValidationResult['errors'] = {}
  const name = cleanSingleLine(values.name, maximumNameLength)
  const email = cleanSingleLine(values.email, maximumEmailLength)
  const workflow = cleanText(values.workflow, maximumWorkflowLength)
  const isSpam =
    Boolean(values.website.trim()) || submittedAt - startedAt < minimumSubmissionTimeMs

  if (values.name.length > maximumNameLength) {
    errors.name = 'Keep your name under 80 characters.'
  } else if (name.length < 2) {
    errors.name = 'Enter your name.'
  }
  if (values.email.length > maximumEmailLength) {
    errors.email = 'Keep the email under 254 characters.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid work email.'
  }
  if (values.company.length > maximumCompanyLength) {
    errors.company = 'Keep the company name under 120 characters.'
  }
  if (workflow.length < minimumWorkflowLength) {
    errors.workflow = 'Describe the workflow in at least 20 characters.'
  }
  if (values.workflow.length > maximumWorkflowLength) {
    errors.workflow = 'Keep the workflow description under 1,500 characters.'
  }
  if (!isOneOf(values.system, systemOptions)) errors.system = 'Select the current system.'
  if (!isOneOf(values.timing, timingOptions)) errors.timing = 'Select your timing.'

  return { errors, isSpam }
}

function safeUrl(value: string) {
  try {
    return new URL(value)
  } catch {
    return undefined
  }
}

function safePageReference(url: URL | undefined) {
  return url
    ? cleanSingleLine(`${url.origin}${url.pathname}`, maximumAttributionLength)
    : ''
}

export function collectLeadAttribution(locationHref: string, referrer: string): LeadAttribution {
  const campaign: LeadAttribution['campaign'] = {}
  const landingUrl = safeUrl(locationHref)
  const landingPage = safePageReference(landingUrl) || 'Unknown'

  if (landingUrl) {
    for (const key of campaignKeys) {
      const value = cleanSingleLine(
        landingUrl.searchParams.get(key) ?? '',
        maximumAttributionLength,
      )
      if (value) campaign[key] = value
    }
  }

  const referrerUrl = safeUrl(referrer)
  const referrerPage = safePageReference(referrerUrl)

  return {
    campaign,
    landingPage,
    referrer:
      referrerPage && referrerUrl?.origin !== landingUrl?.origin ? referrerPage : undefined,
  }
}

function attributionLines(attribution: LeadAttribution) {
  const lines = campaignKeys.flatMap((key) => {
    const value = attribution.campaign[key]
    return value ? [`${key}: ${value}`] : []
  })

  lines.push(`Landing page: ${attribution.landingPage}`)
  lines.push(`Referrer: ${attribution.referrer ?? 'Direct or unavailable'}`)
  return lines
}

export function buildLeadMailTo(values: LeadIntakeValues, attribution: LeadAttribution) {
  const name = cleanSingleLine(values.name, maximumNameLength)
  const company = cleanSingleLine(values.company, maximumCompanyLength)
  const email = cleanSingleLine(values.email, maximumEmailLength)
  const workflow = cleanText(values.workflow, maximumWorkflowLength)
  const system = cleanSingleLine(values.system, maximumAttributionLength)
  const timing = cleanSingleLine(values.timing, maximumAttributionLength)
  const subject = company
    ? `Workflow fit review request from ${company}`
    : 'Workflow fit review request'
  const body = [
    `Name: ${name}`,
    `Work email: ${email}`,
    `Company: ${company || 'Not provided'}`,
    `Current system: ${system}`,
    `Timing: ${timing}`,
    '',
    'Workflow to review:',
    workflow,
    '',
    'Source attribution:',
    ...attributionLines(attribution),
  ].join('\n')
  return buildMailTo(subject, body)
}
