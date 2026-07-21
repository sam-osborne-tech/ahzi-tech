import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Database,
  FileCheck2,
  Gauge,
  Layers3,
  Mail,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { FaAws, FaMicrosoft } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import {
  SiAnthropic,
  SiGooglegemini,
  SiMeta,
  SiMistralai,
  SiOpenai,
  SiPerplexity,
  SiSalesforce,
} from 'react-icons/si'
import type { CSSProperties, MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { AgentChat, type ProtectedMailToHandler } from './components/agent-chat'
import { AiPipeline } from './components/ai-pipeline'
import { ScrollProgress } from './components/scroll-progress'
import { useSectionReveals } from './components/use-section-reveals'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import {
  footerLinkClass,
  foregroundHoverClass,
} from './lib/style-classes'

const contactEmailParts = ['admin', 'ahzi.tech'] as const
const contactPhone = '+14702961095'
const contactPhoneDisplay = '(470) 296-1095'
const phoneTo = `tel:${contactPhone}`
const trustedContactDelayMs = 900

const getContactEmail = () => contactEmailParts.join('@')

const buildMailTo = (subject: string, body?: string) => {
  const params = new URLSearchParams({ subject })

  if (body) {
    params.set('body', body)
  }

  return `mailto:${getContactEmail()}?${params.toString()}`
}

const openMailTo = (subject = 'AI consulting conversation', body?: string) => {
  window.location.href = buildMailTo(subject, body)
}

const signals = [
  ['Opportunity', 'Mapped'],
  ['Data layer', 'Ready'],
  ['Workflow', 'Designed'],
  ['Launch path', 'Clear'],
]

const audiences = [
  {
    title: 'Business operators',
    text: 'Replace a manual, high-volume workflow like intake, review, or data entry with an AI system your team supervises.',
  },
  {
    title: 'Product teams',
    text: 'Ship an AI feature with an evaluation harness that proves accuracy on your data before customers see it.',
  },
  {
    title: 'CRM leaders',
    text: 'Get Salesforce data, ownership, and process clean enough for agents to read and write it safely.',
  },
  {
    title: 'AI teams',
    text: 'Add delivery capacity: MCP tools, agent harnesses, and verification pipelines around your models.',
  },
]

const stackLayers = [
  {
    icon: Sparkles,
    number: '01',
    title: 'Opportunity mapping',
    text: 'Score your CRM and operations workflows by volume, error cost, and data readiness to pick the first build.',
  },
  {
    icon: Bot,
    number: '02',
    title: 'Agents and copilots',
    text: 'Build agents that read and write your real systems: Salesforce, document stores, and internal APIs.',
  },
  {
    icon: Gauge,
    number: '03',
    title: 'Extraction pipelines',
    text: 'Turn contracts, forms, and documents into structured records, verified across the whole population, not spot checks.',
  },
  {
    icon: Database,
    number: '04',
    title: 'Evaluation and gates',
    text: 'Measure model accuracy on your records, set release gates, and give security the audit trail to sign off.',
  },
  {
    icon: Workflow,
    number: '05',
    title: 'Team activation',
    text: 'Train the owners of the workflow, wire human review into the loop, and track production accuracy after launch.',
  },
]

const sequence = [
  [
    'Map',
    'Inventory the candidate workflows, pull real samples of the data behind them, and score each by volume, error cost, and feasibility.',
  ],
  [
    'Build',
    'Develop against your sandbox and real records. Every prototype ships with an accuracy report on your data, not a demo dataset.',
  ],
  [
    'Activate',
    'Put humans in the review loop, set the release gates, and hand your team the dashboards and runbooks to operate the system.',
  ],
]

const outcomes = [
  {
    icon: Sparkles,
    code: 'P01',
    title: 'Opportunity map',
    items: ['Business value', 'Feasibility', 'Deployment path'],
  },
  {
    icon: Bot,
    code: 'P02',
    title: 'Production AI workflow',
    items: ['Working software', 'Human controls', 'System integration'],
  },
  {
    icon: Database,
    code: 'P03',
    title: 'Data and CRM foundation',
    items: ['Trusted context', 'Ownership model', 'Workflow state'],
  },
  {
    icon: BarChart3,
    code: 'P04',
    title: 'Evaluation and launch proof',
    items: ['Quality checks', 'Operating signals', 'Release gates'],
  },
  {
    icon: Workflow,
    code: 'P05',
    title: 'Adoption system',
    items: ['Team enablement', 'Workflow change', 'Iteration loop'],
  },
]

type IntegrationPlatform = {
  accent: string
  focus: string
  initials?: string
  logo?: IconType
  name: string
}

const integrationPlatforms: IntegrationPlatform[] = [
  {
    name: 'OpenAI',
    focus: 'Assistants, agents, and workflow copilots',
    logo: SiOpenai,
    accent: '#74aa9c',
  },
  {
    name: 'Anthropic',
    focus: 'Claude workflows, review loops, and knowledge work',
    logo: SiAnthropic,
    accent: '#d4b896',
  },
  {
    name: 'Salesforce Agentforce',
    focus: 'CRM agents, service handoffs, and customer data',
    logo: SiSalesforce,
    accent: '#00a1e0',
  },
  {
    name: 'Google Gemini',
    focus: 'Workspace, search, and customer operations',
    logo: SiGooglegemini,
    accent: '#8e75b2',
  },
  {
    name: 'Microsoft Copilot',
    focus: 'Microsoft 365, Teams, and business process support',
    logo: FaMicrosoft,
    accent: '#f25022',
  },
  {
    name: 'AWS Bedrock',
    focus: 'Model access, data boundaries, and cloud deployment',
    logo: FaAws,
    accent: '#ff9900',
  },
  {
    name: 'Meta Llama',
    focus: 'Open model strategy and private deployment paths',
    logo: SiMeta,
    accent: '#0668e1',
  },
  {
    name: 'Mistral AI',
    focus: 'Lightweight model workflows and private use cases',
    logo: SiMistralai,
    accent: '#fa520f',
  },
  {
    name: 'Cohere',
    focus: 'Search, retrieval, and enterprise knowledge flows',
    initials: 'co',
    accent: '#39594d',
  },
  {
    name: 'Perplexity',
    focus: 'Research workflows and answer surfaces',
    logo: SiPerplexity,
    accent: '#20b8a7',
  },
]

function PlatformLogo({ accent, initials, logo: Logo, name }: IntegrationPlatform) {
  return (
    <span
      className="grid h-12 w-12 shrink-0 place-items-center rounded-md border bg-[rgb(255_255_255_/_92%)] text-[var(--ink)] shadow-[0_18px_32px_rgb(0_0_0_/_24%)]"
      data-platform-logo={name}
      style={{ borderColor: accent } as CSSProperties}
    >
      {Logo ? (
        <Logo aria-label={`${name} logo`} className="h-7 w-7" role="img" />
      ) : (
        <span
          aria-label={`${name} wordmark`}
          className="text-base font-semibold lowercase leading-none tracking-normal"
          role="img"
        >
          {initials}
        </span>
      )}
    </span>
  )
}

function AhziWordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-wash)] text-[var(--accent-muted)] shadow-[0_10px_30px_rgb(0_0_0_/_22%)]">
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 25 14.5 7h3L25 25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.25"
          />
          <path
            d="M11 19h10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3.25"
          />
          <path
            d="M16 7v-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.25"
          />
          <circle cx="16" cy="4" fill="currentColor" r="2" />
        </svg>
      </span>
      <span className="text-base font-semibold leading-none text-[var(--foreground)]">
        Ahzi
      </span>
    </span>
  )
}

function SignalField() {
  return (
    <div aria-hidden="true" className="signal-field">
      <div className="signal-grid" />
      <div className="signal-lines">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
    </div>
  )
}

function HeroSignals() {
  return (
    <div
      aria-label="AI consulting readiness signals"
      className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-2"
    >
      {signals.map(([label, value]) => (
        <div
          className="flex min-h-14 items-center justify-between gap-3 rounded-md border border-[var(--line)] bg-[rgb(7_11_16_/_70%)] px-4 py-3 backdrop-blur"
          key={label}
        >
          <span className="text-sm text-[var(--foreground-muted)]">{label}</span>
          <span className="text-sm font-semibold text-[var(--accent-muted)]">{value}</span>
        </div>
      ))}
    </div>
  )
}

const firstEngagementOutcomes = [
  'A scored map of AI candidates in your workflows',
  'A working prototype built against your real systems',
  'An accuracy report measured on your records',
  'Release gates your team can run without us',
]

function HeroOutcomes() {
  return (
    <div className="hidden rounded-md border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[var(--panel-shadow)] lg:block">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
        Your first engagement delivers
      </div>
      <ul className="mt-5 grid gap-3">
        {firstEngagementOutcomes.map((item) => (
          <li
            className="flex items-start gap-3 rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_4%)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]"
            key={item}
          >
            <BadgeCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        From prototype to production
      </div>
    </div>
  )
}

function App() {
  const [isAgentOpen, setIsAgentOpen] = useState(false)
  const [contactNotice, setContactNotice] = useState('')

  useSectionReveals()
  const humanInteractionRef = useRef(false)
  const pageReadyAtRef = useRef(0)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    pageReadyAtRef.current = window.performance.now()

    const markHumanInteraction = (event: Event) => {
      if (!event.isTrusted) return

      humanInteractionRef.current = true
    }

    window.addEventListener('pointerdown', markHumanInteraction, { passive: true })
    window.addEventListener('keydown', markHumanInteraction)

    return () => {
      window.removeEventListener('pointerdown', markHumanInteraction)
      window.removeEventListener('keydown', markHumanInteraction)
    }
  }, [])

  useEffect(() => {
    let animationFrameId: number | null = null
    let timeoutId: number | null = null
    const previousScrollRestoration = window.history.scrollRestoration

    window.history.scrollRestoration = 'manual'

    const getHeaderOffset = () => {
      const header = document.querySelector('header')

      return (header?.getBoundingClientRect().height ?? 0) + 16
    }

    const scrollCurrentHashIntoView = () => {
      const targetId = window.location.hash.slice(1)

      if (targetId) {
        const target = document.getElementById(targetId)

        if (!target) return

        window.scrollTo({
          top: Math.max(target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(), 0),
          behavior: 'auto',
        })
      }
    }

    const scrollToHashTarget = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }

      animationFrameId = window.requestAnimationFrame(() => {
        scrollCurrentHashIntoView()
        animationFrameId = null
      })

      timeoutId = window.setTimeout(() => {
        scrollCurrentHashIntoView()
        timeoutId = null
      }, 120)
    }

    scrollToHashTarget()
    window.addEventListener('hashchange', scrollToHashTarget)

    return () => {
      window.removeEventListener('hashchange', scrollToHashTarget)

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }

      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  const openAgent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    restoreFocusRef.current = event.currentTarget
    setIsAgentOpen(true)
  }

  const openProtectedMailTo = useCallback<ProtectedMailToHandler>((event, subject, body) => {
    event.preventDefault()

    const pageHasSettled =
      window.performance.now() - pageReadyAtRef.current >= trustedContactDelayMs
    const hasTrustedClick = event.nativeEvent.isTrusted && humanInteractionRef.current

    if (!hasTrustedClick || !pageHasSettled) {
      setContactNotice('Give the page a moment, then use the contact button again.')
      return
    }

    setContactNotice('')
    openMailTo(subject, body)
  }, [])

  const openEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    openProtectedMailTo(event)
  }

  return (
    <main className="arcade-shell min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <a className="skip-link" href="#top">
        Skip to main content
      </a>
      <header className="arcade-header fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--background-glass)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="Ahzi home">
            <AhziWordmark />
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[var(--foreground-muted)] md:flex">
            <a className={foregroundHoverClass} href="#benefits">
              Services
            </a>
            <a className={foregroundHoverClass} href="#how">
              Approach
            </a>
            <a className={foregroundHoverClass} href="#platforms">
              Platforms
            </a>
            <a className={foregroundHoverClass} href="#why">
              Why Ahzi
            </a>
            <a className={foregroundHoverClass} href="#contact">
              Contact
            </a>
          </nav>
          <Button
            aria-controls="ahzi-agent-panel"
            aria-expanded={isAgentOpen}
            href="#agent"
            onClick={openAgent}
            size="sm"
            variant="outline"
          >
            <Bot aria-hidden="true" className="h-4 w-4" />
            Chat
          </Button>
        </div>
      </header>

      <section
        className="arcade-hero relative flex min-h-[92svh] items-center border-b border-[var(--line)] px-5 pt-24 sm:px-8"
        id="top"
      >
        <SignalField />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 py-16 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:items-center">
          <div className="max-w-4xl">
            <Badge>
              <BadgeCheck aria-hidden="true" className="h-4 w-4" />
              Forward-deployed AI // CRM native
            </Badge>
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="arcade-title mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] text-[var(--foreground)] sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              Enterprise AI that makes it into production.
            </motion.h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)] sm:text-xl">
              Ahzi builds agents, copilots, and document extraction pipelines inside your CRM and operations stack, and ships them with the evaluation evidence to clear production review.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                aria-controls="ahzi-agent-panel"
                aria-expanded={isAgentOpen}
                href="#agent"
                onClick={openAgent}
                size="lg"
              >
                <Bot aria-hidden="true" className="h-5 w-5" />
                Start a conversation
              </Button>
              <Button href="#benefits" size="lg" variant="outline">
                See the approach
                <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
              </Button>
            </div>
            <HeroSignals />
          </div>
          <HeroOutcomes />
        </div>
      </section>

      <section
        aria-label="Who Ahzi helps"
        className="border-b border-[var(--line)] bg-[var(--background-soft)] px-5 py-16 lg:py-24 sm:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
            Ahzi works beside the people who own the result.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(({ text, title }) => (
              <article
                className="min-h-36 rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_5%)] p-4"
                key={title}
              >
                <div className="text-base font-semibold text-[var(--foreground)]">{title}</div>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-28 lg:py-44 sm:px-8" id="benefits">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <Badge>
              <Gauge aria-hidden="true" className="h-4 w-4" />
              The deployment gap
            </Badge>
            <h2 className="arcade-section-title mt-6 text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
              Most companies have the AI tools, not the results.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)]">
              The difference is deployment. Ahzi has shipped a contract-intelligence run over 5,000+ agreements with population-level verification, agents wired into Salesforce, and the MCP tooling engineering teams use daily.
            </p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-5">
            {stackLayers.map(({ icon: Icon, number, text, title }) => (
              <article
                className="rounded-md border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--panel-shadow)]"
                key={title}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[var(--accent-muted)]">
                    {number}
                  </span>
                  <Icon aria-hidden="true" className="h-6 w-6 text-[var(--accent-muted)]" />
                </div>
                <h3 className="mt-8 text-lg font-semibold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              aria-controls="ahzi-agent-panel"
              aria-expanded={isAgentOpen}
              href="#agent"
              onClick={openAgent}
              size="lg"
            >
              <Bot aria-hidden="true" className="h-5 w-5" />
              Discuss your workflow
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-label="AI platform integration targets"
        className="border-y border-[var(--line)] bg-[var(--background-soft)] px-5 py-28 lg:py-44 sm:px-8"
        id="platforms"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <Badge>
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Vendor neutral // platform fluent
              </Badge>
              <h2 className="arcade-section-title mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
                Work at the frontier. Ship inside your stack.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[var(--foreground-muted)] lg:justify-self-end">
              Ahzi helps teams select and connect the model, agent, data, CRM, and workflow layers without turning a platform choice into a strategy.
            </p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {integrationPlatforms.map((platform) => (
              <article
                className="group rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_5%)] p-5 shadow-[var(--panel-shadow)] transition hover:border-[var(--accent-border)] hover:bg-[rgb(255_255_255_/_7%)]"
                key={platform.name}
              >
                <div className="flex min-h-28 flex-col justify-between">
                  <PlatformLogo {...platform} />
                  <div>
                    <div className="mt-5 text-lg font-semibold leading-snug tracking-normal text-[var(--foreground)]">
                      {platform.name}
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-3 block h-1 w-10 rounded-full"
                      style={{ backgroundColor: platform.accent } as CSSProperties}
                    />
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-[var(--foreground-muted)]">
                  {platform.focus}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-[var(--foreground-subtle)]">
            Platform names describe implementation experience and integration targets, not formal partner claims.
          </p>
        </div>
      </section>

      <section
        className="border-y border-[var(--line)] bg-[var(--ink)] px-5 py-28 lg:py-44 text-[var(--ink-foreground)] sm:px-8"
        id="how"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Badge className="border-[var(--ink-line)] bg-transparent text-[var(--accent-soft)]">
              <Bot aria-hidden="true" className="h-4 w-4" />
              Three-stage approach
            </Badge>
            <h2 className="arcade-section-title mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Map. Build. Activate.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--ink-muted)]">
              Strategy, engineering, and adoption stay in one loop so the system reaches production and keeps getting better.
            </p>
          </div>
          <div className="grid gap-3">
            {sequence.map(([step, text], index) => (
              <div
                className="grid items-start gap-4 rounded-md border border-[var(--ink-line)] bg-white/[0.035] p-5 sm:grid-cols-[9rem_1fr]"
                key={step}
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">
                    Stage 0{index + 1}
                  </div>
                  <h3 className="text-lg font-semibold leading-6 text-[var(--ink-foreground)]">
                    {step}
                  </h3>
                </div>
                <p className="text-lg leading-7 text-[var(--ink-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-7xl">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            How an Ahzi system comes together as you scroll
          </p>
          <AiPipeline />
        </div>
      </section>

      <section className="px-5 py-28 lg:py-44 sm:px-8" id="why">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-md border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[var(--panel-shadow)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(91_157_217_/_12%),transparent_34%),radial-gradient(circle_at_90%_30%,rgb(73_94_158_/_16%),transparent_32%)]" />
            <div className="relative grid gap-4">
              <div className="rounded-md border border-[var(--line)] bg-[rgb(7_11_16_/_72%)] p-5">
                <div className="flex items-center justify-between text-sm text-[var(--foreground-subtle)]">
                  <span>Priority map</span>
                  <span>CRM readiness</span>
                </div>
                <div className="mt-5 grid gap-3">
                  {['Business gaps', 'System layers', 'Roadmap work', 'Launch gates'].map(
                    (item, index) => (
                      <div
                        className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_5%)] px-4 py-3"
                        key={item}
                      >
                        <span className="text-sm text-[var(--foreground-muted)]">{item}</span>
                        <span className="text-sm text-[var(--accent-muted)]">
                          {index === 0 ? 'Identify' : index === 1 ? 'Map' : index === 2 ? 'Prioritize' : 'Gate'}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {['Scope', 'Validate', 'Launch'].map((item) => (
                  <div
                    className="rounded-md border border-[var(--line)] bg-[rgb(7_11_16_/_62%)] p-4"
                    key={item}
                  >
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
                      {item}
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[var(--accent-muted)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Badge>
              <Layers3 aria-hidden="true" className="h-4 w-4" />
              Why Ahzi
            </Badge>
            <h2 className="arcade-section-title mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
              Forward-deployed. Business aware. CRM deep.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)]">
              Ahzi has run AI delivery inside a utility-scale enterprise, shipped Salesforce engineering for agencies and studios, and built the internal agent tooling an engineering organization uses every day.
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)]">
              One engineer-led thread runs from the opportunity map to the release gate. No handoff between a strategy deck and a delivery team.
            </p>
            <div className="mt-10">
              <Button href="#contact" onClick={openEmail} size="lg">
                <Mail aria-hidden="true" className="h-5 w-5" />
                Start a conversation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-[var(--line)] bg-[var(--background-soft)] px-5 py-28 lg:py-44 sm:px-8"
        id="outputs"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <Badge>
              <FileCheck2 aria-hidden="true" className="h-4 w-4" />
              Working output
            </Badge>
            <h2 className="arcade-section-title mt-6 max-w-2xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
              Working software and operating proof, not another slide deck.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)]">
              Every engagement leaves the team with something it can run, inspect, measure, and improve.
            </p>
          </div>
          <div className="grid gap-4">
            {outcomes.map(({ code, icon: Icon, items, title }) => (
              <article
                className="min-h-44 rounded-md border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--panel-shadow)]"
                key={title}
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[var(--line)] text-[var(--accent-muted)]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
                      {code}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">{title}</h3>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                      {items.map((item) => (
                        <li
                          className="flex min-h-10 items-center gap-2 rounded-md border border-[var(--line)] px-3 py-2 text-sm leading-5 text-[var(--foreground-muted)]"
                          key={item}
                        >
                          <BadgeCheck
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-[var(--accent-muted)]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] px-5 py-28 lg:py-44 sm:px-8" id="first-sprint">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Badge>
              <Route aria-hidden="true" className="h-4 w-4" />
              First engagement
            </Badge>
            <h2 className="arcade-section-title mt-6 text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
              Start with one valuable workflow.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--foreground-muted)]">
              The first engagement finds the value, proves the hard parts, and creates a production path before the scope expands.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_5%)] p-5">
              <div className="text-sm uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
                Starting point
              </div>
              <p className="mt-3 text-lg leading-7 text-[var(--foreground-muted)]">
                A business-critical workflow has clear upside, but the data, systems, controls, and ownership are not ready to ship.
              </p>
            </div>
            <div className="rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_5%)] p-5">
              <div className="text-sm uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
                What you leave with
              </div>
              <p className="mt-3 text-lg leading-7 text-[var(--foreground-muted)]">
                The team gets a validated opportunity, working prototype, implementation map, evaluation plan, and clear production gates.
              </p>
            </div>
            <Button
              aria-controls="ahzi-agent-panel"
              aria-expanded={isAgentOpen}
              className="w-full justify-center sm:w-fit"
              href="#agent"
              onClick={openAgent}
              size="lg"
            >
              <Bot aria-hidden="true" className="h-5 w-5" />
              Chat with Ahzi
            </Button>
          </div>
        </div>
      </section>

      <section
        className="border-b border-[var(--line)] bg-[var(--background-soft)] px-5 py-28 lg:py-44 sm:px-8"
        id="contact"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge>
              <Mail aria-hidden="true" className="h-4 w-4" />
              Next step
            </Badge>
            <h2 className="arcade-section-title mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
              Bring the workflow. Leave with a path to production.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)]">
              Start a chat or contact Ahzi directly. The first reply will focus on the business result, the system underneath it, and what should happen next.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:min-w-80">
            <Button className="w-full justify-center" href="#contact" onClick={openEmail} size="lg">
              <Mail aria-hidden="true" className="h-5 w-5" />
              Email Ahzi
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </Button>
            <Button className="w-full justify-center" href={phoneTo} size="lg" variant="outline">
              <Phone aria-hidden="true" className="h-5 w-5" />
              Call {contactPhoneDisplay}
            </Button>
            <div className="grid gap-2 text-sm text-[var(--foreground-muted)]">
              <span>
                {contactNotice ||
                  'Send the workflow, owner, and timing so the first reply can be specific.'}
              </span>
              <a className={footerLinkClass} href={phoneTo}>
                {contactPhoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--foreground-subtle)] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>Ahzi // Enterprise AI that ships.</span>
          <a className={footerLinkClass} href="#contact">
            Contact Ahzi
          </a>
        </div>
      </footer>
      <ScrollProgress />
      <AgentChat
        isOpen={isAgentOpen}
        openProtectedMailTo={openProtectedMailTo}
        phoneHref={phoneTo}
        restoreFocusRef={restoreFocusRef}
        setIsOpen={setIsAgentOpen}
      />
    </main>
  )
}

export default App
