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
  Workflow,
  Zap,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'

const contactEmail = 'welcome@ahzi.tech'
const contactPhone = '+14702961095'
const contactPhoneDisplay = '(470) 296-1095'
const mailTo = `mailto:${contactEmail}?subject=AI%20readiness%20sprint`
const phoneTo = `tel:${contactPhone}`

const signals = [
  ['Data context', 'Mapped'],
  ['Agent boundaries', 'Governed'],
  ['Workflow risk', 'Visible'],
  ['Launch gate', 'Evidence ready'],
]

const offers = [
  {
    icon: Route,
    title: 'Readiness sprint',
    duration: '2 weeks',
    text: 'Map the org, data, handoffs, automations, reporting gaps, and launch risks before AI agents enter the workflow.',
  },
  {
    icon: Zap,
    title: 'Delivery sprint',
    duration: '4 to 6 weeks',
    text: 'Fix the CRM foundation, accelerate migration and QA work, and leave the team with proof instead of loose notes.',
  },
  {
    icon: ShieldCheck,
    title: 'Verification layer',
    duration: 'Ongoing',
    text: 'Keep agent behavior, reporting, tests, and rollout evidence aligned as the system changes.',
  },
]

const sequence = [
  ['Map', 'Find where the org, data, reporting, and process shape will limit AI work.'],
  ['Fix', 'Clean the parts that create risk before a pilot turns into production pressure.'],
  ['Prove', 'Create evidence the team can inspect, reuse, and defend.'],
  ['Launch', 'Move in contained releases with clear handoffs and rollback points.'],
]

const proof = [
  { icon: Database, label: 'Data model and field logic traced' },
  { icon: Workflow, label: 'Automations and handoffs made visible' },
  { icon: FileCheck2, label: 'Tests and acceptance evidence produced' },
  { icon: BarChart3, label: 'Reports tied back to operating decisions' },
]

function SignalField() {
  return (
    <div aria-hidden="true" className="signal-field">
      <div className="signal-grid" />
      <div className="signal-radar">
        {signals.map(([label, value], index) => (
          <motion.div
            animate={{ opacity: [0.46, 0.9, 0.46], y: [0, -5, 0] }}
            className="signal-chip"
            key={label}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              delay: index * 0.35,
              ease: 'easeInOut',
            }}
          >
            <span>{label}</span>
            <strong>{value}</strong>
          </motion.div>
        ))}
      </div>
      <div className="signal-lines">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--background-glass)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="Ahzi home">
            <img className="h-9 w-9 rounded-md" src="./ahzi-logo.png" alt="" />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              AHZI
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[var(--foreground-muted)] md:flex">
            <a className="hover:text-[var(--foreground)]" href="#work">
              Work
            </a>
            <a className="hover:text-[var(--foreground)]" href="#offers">
              Offers
            </a>
            <a className="hover:text-[var(--foreground)]" href="#contact">
              Contact
            </a>
          </nav>
          <Button href={mailTo} size="sm" variant="outline">
            <Mail aria-hidden="true" className="h-4 w-4" />
            Start
          </Button>
        </div>
      </header>

      <section
        className="relative flex min-h-[88svh] items-center border-b border-[var(--line)] px-5 pt-24 sm:px-8"
        id="top"
      >
        <SignalField />
        <div className="relative z-10 mx-auto w-full max-w-7xl py-16">
          <div className="max-w-4xl">
            <Badge>
              <BadgeCheck aria-hidden="true" className="h-4 w-4" />
              CRM AI readiness and delivery
            </Badge>
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.96] text-[var(--foreground)] sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              Get your CRM ready for agents that do real work.
            </motion.h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)] sm:text-xl">
              Ahzi helps teams turn messy data, workflows, reports, tests, and
              rollout plans into a system AI agents can safely use.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={mailTo} size="lg">
                <Mail aria-hidden="true" className="h-5 w-5" />
                Start a readiness sprint
              </Button>
              <Button href="#offers" size="lg" variant="outline">
                See the offer
                <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-b border-[var(--line)] bg-[var(--background-soft)] px-5 py-20 sm:px-8"
        id="work"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <Badge>
              <Gauge aria-hidden="true" className="h-4 w-4" />
              Built for the messy middle
            </Badge>
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
              Most teams are not blocked by AI ideas. They are blocked by the
              condition of the system underneath.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {proof.map(({ icon: Icon, label }) => (
              <div
                className="rounded-md border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--panel-shadow)]"
                key={label}
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-[var(--accent-muted)]" />
                <p className="mt-6 text-lg leading-7 text-[var(--foreground)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8" id="offers">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Badge>
                <Layers3 aria-hidden="true" className="h-4 w-4" />
                Offers
              </Badge>
              <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
                Start narrow, prove value, then move the production path.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[var(--foreground-muted)]">
              The first engagement should produce a decision, a work plan, and evidence
              the team can inspect. No vague transformation deck.
            </p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {offers.map(({ duration, icon: Icon, text, title }) => (
              <article
                className="rounded-md border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[var(--panel-shadow)]"
                key={title}
              >
                <div className="flex items-center justify-between gap-6">
                  <Icon aria-hidden="true" className="h-7 w-7 text-[var(--accent-muted)]" />
                  <span className="rounded-md border border-[var(--line)] px-3 py-1 text-sm text-[var(--foreground-muted)]">
                    {duration}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="mt-4 leading-7 text-[var(--foreground-muted)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--ink)] px-5 py-20 text-[var(--ink-foreground)] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Badge className="border-[var(--ink-line)] bg-transparent text-[var(--accent-soft)]">
              <Bot aria-hidden="true" className="h-4 w-4" />
              How work moves
            </Badge>
            <h2 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Judgment stays human. High-volume work gets compressed.
            </h2>
          </div>
          <div className="grid gap-3">
            {sequence.map(([step, text], index) => (
              <div
                className="grid gap-4 rounded-md border border-[var(--ink-line)] bg-white/[0.035] p-5 sm:grid-cols-[120px_1fr]"
                key={step}
              >
                <div className="text-sm font-medium uppercase text-[var(--accent-soft)]">
                  {String(index + 1).padStart(2, '0')} {step}
                </div>
                <p className="text-lg leading-7 text-[var(--ink-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8" id="contact">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 rounded-md border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] sm:p-10 lg:flex-row lg:items-center">
          <div>
            <Badge>
              <Mail aria-hidden="true" className="h-4 w-4" />
              First pilot
            </Badge>
            <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
              Run one readiness sprint before building a bigger agency motion.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)]">
              Best first buyer: a CRM team with AI pressure, messy foundations,
              and a leader who needs proof before production.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:min-w-80">
            <Button className="w-full justify-center" href={mailTo} size="lg">
              <Mail aria-hidden="true" className="h-5 w-5" />
              Email Ahzi
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </Button>
            <Button className="w-full justify-center" href={phoneTo} size="lg" variant="outline">
              <Phone aria-hidden="true" className="h-5 w-5" />
              Call {contactPhoneDisplay}
            </Button>
            <div className="grid gap-2 text-sm text-[var(--foreground-muted)]">
              <a className="transition hover:text-[var(--foreground)]" href={mailTo}>
                {contactEmail}
              </a>
              <a className="transition hover:text-[var(--foreground)]" href={phoneTo}>
                {contactPhoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--foreground-subtle)] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>Ahzi. CRM AI readiness and delivery acceleration.</span>
          <a className="transition hover:text-[var(--foreground)]" href={mailTo}>
            {contactEmail}
          </a>
        </div>
      </footer>
    </main>
  )
}

export default App
