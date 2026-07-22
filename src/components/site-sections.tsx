import {
  BadgeCheck,
  Bot,
  FileCheck2,
  Gauge,
  Layers3,
  Route,
  ShieldCheck,
} from 'lucide-react'
import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
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
import { siteContent, type PlatformContent } from '../content/site-content'
import { insetPhotos, sectionPhotos } from '../lib/site-assets'
import { AiPipeline } from './ai-pipeline'
import { LeadIntakeForm } from './lead-intake-form'
import {
  CardGrid,
  CtaBlock,
  GradientCard,
  InsetPhoto,
  ProofList,
  SectionHeading,
  SectionPhoto,
  SectionShell,
  UseCaseFlow,
  type CtaAction,
} from './marketing-components'
import { Badge } from './ui/badge'

const platformLogos: Record<Exclude<PlatformContent['logo'], 'wordmark'>, IconType> = {
  anthropic: SiAnthropic,
  aws: FaAws,
  gemini: SiGooglegemini,
  meta: SiMeta,
  microsoft: FaMicrosoft,
  mistral: SiMistralai,
  openai: SiOpenai,
  perplexity: SiPerplexity,
  salesforce: SiSalesforce,
}

export function AhziWordmark() {
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
          <path d="M7 25 14.5 7h3L25 25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.25" />
          <path d="M11 19h10" stroke="currentColor" strokeLinecap="round" strokeWidth="3.25" />
          <path d="M16 7v-3" stroke="currentColor" strokeLinecap="round" strokeWidth="2.25" />
          <circle cx="16" cy="4" fill="currentColor" r="2" />
        </svg>
      </span>
      <span className="text-base font-semibold leading-none text-[var(--foreground)]">Ahzi</span>
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
    <div aria-label="AI consulting readiness signals" className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-2">
      {siteContent.hero.signals.map(([label, value]) => (
        <GradientCard
          as="div"
          className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 shadow-none"
          key={label}
        >
          <span className="text-sm text-[var(--foreground-muted)]">{label}</span>
          <span className="text-sm font-semibold text-[var(--accent-muted)]">{value}</span>
        </GradientCard>
      ))}
    </div>
  )
}

function HeroReviewCard() {
  return (
    <GradientCard as="div" className="hidden p-7 lg:block">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
        {siteContent.hero.reviewTitle}
      </div>
      <ProofList className="mt-5" items={siteContent.hero.reviewDecisions} />
      <div className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        {siteContent.hero.reviewResult}
      </div>
    </GradientCard>
  )
}

export function HeroSection() {
  const actions: CtaAction[] = [
    { ...siteContent.hero.ctas[0], icon: Route },
    { ...siteContent.hero.ctas[1], variant: 'outline' },
  ]

  return (
    <section className="arcade-hero relative flex min-h-[92svh] items-center border-b border-[var(--line)] px-5 pt-24 sm:px-8" id="top">
      <SectionPhoto {...sectionPhotos.hero} />
      <SignalField />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 py-16 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:items-center">
        <div className="max-w-4xl">
          <Badge><BadgeCheck aria-hidden="true" className="h-4 w-4" />{siteContent.hero.badge}</Badge>
          <motion.h1 animate={{ opacity: 1, y: 0 }} className="arcade-title mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] text-[var(--foreground)] sm:text-7xl lg:text-8xl" initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            {siteContent.hero.title}
          </motion.h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)] sm:text-xl">{siteContent.hero.body}</p>
          <CtaBlock actions={actions} className="mt-10" />
          <HeroSignals />
        </div>
        <HeroReviewCard />
      </div>
    </section>
  )
}

export function AudienceProblemSection() {
  return (
    <SectionShell id="audiences" photo={sectionPhotos.audiences} surface="soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={Gauge} {...siteContent.audience.heading} />
        <CardGrid className="mt-12" columns={3}>
          {siteContent.audience.cards.map(({ body, title }) => (
            <GradientCard className="min-h-48" key={title}>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{body}</p>
            </GradientCard>
          ))}
        </CardGrid>
      </div>
    </SectionShell>
  )
}

export function UseCasesSection() {
  return (
    <SectionShell id="use-cases" photo={sectionPhotos.benefits}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading align="center" icon={FileCheck2} {...siteContent.useCases.heading} />
        <div className="mt-12 grid gap-5">
          {siteContent.useCases.items.map((useCase) => (
            <UseCaseFlow key={useCase.title} useCase={useCase} />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

export function DeliverySection() {
  return (
    <SectionShell id="how" photo={sectionPhotos.approach} surface="ink">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <SectionHeading icon={Bot} tone="ink" {...siteContent.delivery.heading} />
        <div className="grid gap-3">
          {siteContent.delivery.stages.map(({ body, title }) => (
            <GradientCard as="div" className="grid items-start gap-4 sm:grid-cols-[9rem_1fr]" key={title} tone="ink">
              <h3 className="text-lg font-semibold leading-6 text-[var(--ink-foreground)]">{title}</h3>
              <p className="text-lg leading-7 text-[var(--ink-muted)]">{body}</p>
            </GradientCard>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-7xl">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          {siteContent.delivery.pipelineLabel}
        </p>
        <AiPipeline />
      </div>
    </SectionShell>
  )
}

function PlatformLogo({ accent, initials, logo, name }: PlatformContent) {
  const Logo = logo === 'wordmark' ? undefined : platformLogos[logo]

  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border bg-[rgb(255_255_255_/_92%)] text-[var(--ink)] shadow-[0_18px_32px_rgb(0_0_0_/_24%)]" data-platform-logo={name} style={{ borderColor: accent }}>
      {Logo ? <Logo aria-label={`${name} logo`} className="h-7 w-7" role="img" /> : <span aria-label={`${name} wordmark`} className="text-base font-semibold lowercase" role="img">{initials}</span>}
    </span>
  )
}

function PlatformGrid() {
  return (
    <div className="mt-14">
      <h3 className="text-xl font-semibold text-[var(--foreground)]">
        {siteContent.proof.platformHeading}
      </h3>
      <CardGrid className="mt-6" columns={5}>
        {siteContent.proof.platforms.map((platform) => (
          <GradientCard interactive key={platform.name}>
            <PlatformLogo {...platform} />
            <h4 className="mt-5 text-lg font-semibold leading-snug text-[var(--foreground)]">{platform.name}</h4>
            <span aria-hidden="true" className="mt-3 block h-1 w-10 rounded-full" style={{ backgroundColor: platform.accent }} />
            <p className="mt-5 text-sm leading-6 text-[var(--foreground-muted)]">{platform.focus}</p>
          </GradientCard>
        ))}
      </CardGrid>
      <p className="mt-6 text-sm leading-6 text-[var(--foreground-subtle)]">{siteContent.proof.platformNote}</p>
    </div>
  )
}

export function ProofSection() {
  return (
    <SectionShell id="proof" photo={sectionPhotos.why} surface="soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={ShieldCheck} {...siteContent.proof.heading} />
        <CardGrid className="mt-12" columns={3}>
          {siteContent.proof.claims.map(({ body, title }) => (
            <GradientCard className="min-h-48" key={title}>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{body}</p>
            </GradientCard>
          ))}
        </CardGrid>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InsetPhoto photo={sectionPhotos.platforms} />
          <InsetPhoto photo={sectionPhotos.outputs} />
        </div>
        <PlatformGrid />
      </div>
    </SectionShell>
  )
}

export function FirstEngagementSection() {
  const actions: CtaAction[] = [{ ...siteContent.engagement.cta, icon: Route }]

  return (
    <SectionShell id="first-sprint" photo={sectionPhotos.firstSprint}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <SectionHeading icon={Layers3} {...siteContent.engagement.heading} />
        <div className="grid gap-4">
          <InsetPhoto photo={insetPhotos.firstSprint} />
          <GradientCard as="div">
            <h3 className="text-sm uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
              {siteContent.engagement.startingPointTitle}
            </h3>
            <p className="mt-3 text-lg leading-7 text-[var(--foreground-muted)]">{siteContent.engagement.startingPoint}</p>
          </GradientCard>
          <GradientCard as="div">
            <h3 className="text-sm uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
              {siteContent.engagement.deliverablesTitle}
            </h3>
            <ProofList className="mt-4" items={siteContent.engagement.deliverables} />
          </GradientCard>
          <CtaBlock actions={actions} />
        </div>
      </div>
    </SectionShell>
  )
}

export function ConversionSection({
  contactNotice,
  onPrepareDraft,
}: {
  contactNotice: string
  onPrepareDraft: (mailTo: string) => boolean
}) {
  return (
    <SectionShell id="contact" photo={sectionPhotos.contact} surface="soft">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <SectionHeading icon={Route} {...siteContent.conversion.heading} />
          <GradientCard as="div" className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent-muted)]">
              {siteContent.conversion.replyTitle}
            </h3>
            <ProofList className="mt-4" items={siteContent.conversion.replyCovers} />
          </GradientCard>
        </div>
        <div>
          {contactNotice ? (
            <div
              className="mb-4 rounded-md border border-[var(--accent-border)] bg-[var(--accent-wash)] p-4 text-sm text-[var(--foreground)]"
              role="alert"
            >
              {contactNotice}
            </div>
          ) : null}
          <LeadIntakeForm
            formTitle={siteContent.conversion.formTitle}
            onPrepareDraft={onPrepareDraft}
          />
        </div>
      </div>
    </SectionShell>
  )
}
