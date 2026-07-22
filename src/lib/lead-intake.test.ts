import { describe, expect, it } from 'vitest'
import {
  buildLeadMailTo,
  collectLeadAttribution,
  validateLeadIntake,
  type LeadIntakeValues,
} from './lead-intake'

const validValues: LeadIntakeValues = {
  company: 'Northstar Operations',
  email: 'alex@northstar.example',
  name: 'Alex Morgan',
  system: 'Salesforce or another CRM',
  timing: 'Planning this quarter',
  website: '',
  workflow:
    'Our team manually reviews account intake records before assigning them to an owner.',
}

describe('validateLeadIntake', () => {
  it('accepts a complete human submission', () => {
    const result = validateLeadIntake(validValues, 1_000, 3_000)

    expect(result).toEqual({ errors: {}, isSpam: false })
  })

  it('reports every missing required field', () => {
    const result = validateLeadIntake(
      {
        company: '',
        email: '',
        name: '',
        system: '',
        timing: '',
        website: '',
        workflow: '',
      },
      1_000,
      3_000,
    )

    expect(result.errors).toEqual({
      email: 'Enter a valid work email.',
      name: 'Enter your name.',
      system: 'Select the current system.',
      timing: 'Select your timing.',
      workflow: 'Describe the workflow in at least 20 characters.',
    })
  })

  it('rejects invalid values and unsupported select options', () => {
    const result = validateLeadIntake(
      {
        ...validValues,
        email: 'not-an-email',
        system: 'A made-up system',
        timing: 'Eventually',
        workflow: 'Too short',
      },
      1_000,
      3_000,
    )

    expect(result.errors).toEqual({
      email: 'Enter a valid work email.',
      system: 'Select the current system.',
      timing: 'Select your timing.',
      workflow: 'Describe the workflow in at least 20 characters.',
    })
  })

  it('rejects overlong user-controlled values', () => {
    const result = validateLeadIntake(
      {
        ...validValues,
        company: 'C'.repeat(121),
        email: `${'a'.repeat(245)}@example.com`,
        name: 'N'.repeat(81),
        workflow: 'W'.repeat(1_501),
      },
      1_000,
      3_000,
    )

    expect(result.errors).toEqual({
      company: 'Keep the company name under 120 characters.',
      email: 'Keep the email under 254 characters.',
      name: 'Keep your name under 80 characters.',
      workflow: 'Keep the workflow description under 1,500 characters.',
    })
  })

  it('blocks honeypot and too-fast submissions', () => {
    expect(
      validateLeadIntake({ ...validValues, website: 'https://spam.example' }, 1_000, 3_000)
        .isSpam,
    ).toBe(true)
    expect(validateLeadIntake(validValues, 1_000, 2_499).isSpam).toBe(true)
  })
})

describe('collectLeadAttribution', () => {
  it('preserves campaign values while stripping private URL details', () => {
    const attribution = collectLeadAttribution(
      'https://ahzi.tech/?utm_source=linkedin&utm_medium=profile&utm_campaign=crm-review&ignored=value',
      'https://partner.example/referrals/list?account=private#record',
    )

    expect(attribution).toEqual({
      campaign: {
        utm_campaign: 'crm-review',
        utm_medium: 'profile',
        utm_source: 'linkedin',
      },
      landingPage: 'https://ahzi.tech/',
      referrer: 'https://partner.example/referrals/list',
    })
  })

  it('omits same-site and invalid referrers', () => {
    expect(
      collectLeadAttribution('https://ahzi.tech/?utm_source=direct', 'https://ahzi.tech/#how'),
    ).toEqual({
      campaign: { utm_source: 'direct' },
      landingPage: 'https://ahzi.tech/',
      referrer: undefined,
    })
    expect(collectLeadAttribution('not a URL', 'also not a URL')).toEqual({
      campaign: {},
      landingPage: 'Unknown',
      referrer: undefined,
    })
  })
})

describe('buildLeadMailTo', () => {
  it('creates an encoded, attributable workflow review draft', () => {
    const mailTo = buildLeadMailTo(validValues, {
      campaign: { utm_campaign: 'crm-review', utm_source: 'linkedin' },
      landingPage: 'https://ahzi.tech/',
      referrer: 'https://partner.example/referral',
    })
    const url = new URL(mailTo)
    const body = url.searchParams.get('body')

    expect(url.protocol).toBe('mailto:')
    expect(url.pathname).toBe('admin@ahzi.tech')
    expect(url.searchParams.get('subject')).toBe(
      'Workflow fit review request from Northstar Operations',
    )
    expect(body).toContain('Work email: alex@northstar.example')
    expect(body).toContain('Current system: Salesforce or another CRM')
    expect(body).toContain('utm_source: linkedin')
    expect(body).toContain('utm_campaign: crm-review')
    expect(body).toContain('Referrer: https://partner.example/referral')
  })
})
