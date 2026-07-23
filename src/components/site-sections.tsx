import {
  BadgeCheck,
  Boxes,
  FileCheck2,
  Route,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import { siteContent, type OfferingContent } from '../content/site-content'
import { insetPhotos, sectionPhotos } from '../lib/site-assets'
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

function HeroReviewCard() {
  return (
    <GradientCard as="div" className="p-6 sm:p-7">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
        {siteContent.hero.reviewTitle}
      </div>
      <ProofList className="mt-5" items={siteContent.hero.reviewOutputs} />
    </GradientCard>
  )
}

export function HeroSection() {
  const reducedMotion = Boolean(useReducedMotion())
  const actions: CtaAction[] = [
    { ...siteContent.hero.ctas[0], icon: Route },
    { ...siteContent.hero.ctas[1], variant: 'outline' },
  ]

  return (
    <section className="arcade-hero relative flex min-h-[78svh] items-center border-b border-[var(--line)] px-5 pt-24 sm:px-8" id="top">
      <SectionPhoto {...sectionPhotos.hero} />
      <SignalField />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 py-16 lg:grid-cols-[minmax(0,1.28fr)_minmax(20rem,0.72fr)] lg:items-center">
        <div className="max-w-4xl">
          <Badge><BadgeCheck aria-hidden="true" className="h-4 w-4" />{siteContent.hero.badge}</Badge>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="arcade-title mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] text-[var(--foreground)] sm:text-7xl"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            transition={{ duration: reducedMotion ? 0 : 0.7, ease: 'easeOut' }}
          >
            {siteContent.hero.title}
          </motion.h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)] sm:text-xl">{siteContent.hero.body}</p>
          <CtaBlock actions={actions} className="mt-10" />
        </div>
        <HeroReviewCard />
      </div>
    </section>
  )
}

function OfferingDetail({ body, label }: { body: string; label: string }) {
  return (
    <div className="border-t border-[var(--line)] pt-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{body}</dd>
    </div>
  )
}

function OfferingCard({ offering }: { offering: OfferingContent }) {
  return (
    <GradientCard className="p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
        {offering.label}
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{offering.title}</h3>
      <dl className="mt-6 grid gap-4">
        <OfferingDetail body={offering.forWho} label="Who it is for" />
        <OfferingDetail body={offering.problem} label="Concrete problem" />
        <OfferingDetail body={offering.work} label="What Ahzi builds or does" />
        <OfferingDetail body={offering.systems} label="Systems and boundary" />
      </dl>
      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-muted)]">
          Tangible deliverables
        </div>
        <ProofList className="mt-3" items={offering.deliverables} />
      </div>
      <dl className="mt-5 grid gap-4">
        <OfferingDetail body={offering.controls} label="Human and release controls" />
        <OfferingDetail body={offering.nextDecision} label="Next buying decision" />
      </dl>
    </GradientCard>
  )
}

export function OfferingsSection() {
  return (
    <SectionShell id="offerings" photo={sectionPhotos.audiences}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={Boxes} {...siteContent.offerings.heading} />
        <CardGrid className="mt-12" columns={2}>
          {siteContent.offerings.items.map((offering) => (
            <OfferingCard key={offering.title} offering={offering} />
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

export function ProofSection() {
  return (
    <SectionShell id="proof" photo={sectionPhotos.why} surface="soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={ShieldCheck} {...siteContent.proof.heading} />
        <CardGrid className="mt-12" columns={4}>
          {siteContent.proof.claims.map(({ body, title }) => (
            <GradientCard className="min-h-48" key={title}>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{body}</p>
            </GradientCard>
          ))}
        </CardGrid>
        <GradientCard as="div" className="mt-6 p-6">
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            Controls included in the delivery boundary
          </h3>
          <ProofList className="mt-5" columns={2} items={siteContent.proof.controls} />
        </GradientCard>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InsetPhoto photo={sectionPhotos.platforms} />
          <InsetPhoto photo={sectionPhotos.outputs} />
        </div>
      </div>
    </SectionShell>
  )
}

export function EngagementSection() {
  const actions: CtaAction[] = [{ ...siteContent.engagement.cta, icon: Route }]

  return (
    <SectionShell id="engagement" photo={sectionPhotos.firstSprint}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading icon={Workflow} {...siteContent.engagement.heading} />
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          {siteContent.engagement.steps.map(({ body, title }) => (
            <GradientCard key={title}>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{body}</p>
            </GradientCard>
          ))}
        </div>
        <InsetPhoto className="mt-6" photo={insetPhotos.firstSprint} />
        <CtaBlock actions={actions} className="mt-6" />
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
