import { ArrowUpRight, BadgeCheck, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type {
  CallToActionContent,
  SectionHeadingContent,
  UseCaseContent,
} from '../content/site-content'
import type { SitePhoto } from '../lib/site-assets'
import { cn } from '../lib/utils'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const sectionSurfaceClasses = {
  default: 'border-b border-[var(--line)]',
  ink: 'border-y border-[var(--line)] bg-[var(--ink)] text-[var(--ink-foreground)]',
  soft: 'border-y border-[var(--line)] bg-[var(--background-soft)]',
} as const

const gridColumnClasses = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
} as const

const proofColumnClasses = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
} as const

type SectionShellProps = {
  ariaLabel?: string
  children: ReactNode
  className?: string
  id: string
  photo: SitePhoto
  surface?: keyof typeof sectionSurfaceClasses
}

export function SectionPhoto({ height, src, width }: SitePhoto) {
  return (
    <figure aria-hidden="true" className="section-photo">
      <img alt="" decoding="async" height={height} loading="lazy" src={src} width={width} />
    </figure>
  )
}

export function SectionShell({
  ariaLabel,
  children,
  className,
  id,
  photo,
  surface = 'default',
}: SectionShellProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'relative px-5 py-28 sm:px-8 lg:py-44',
        sectionSurfaceClasses[surface],
        className,
      )}
      id={id}
    >
      <SectionPhoto {...photo} />
      {children}
    </section>
  )
}

type SectionHeadingProps = SectionHeadingContent & {
  align?: 'center' | 'left'
  className?: string
  icon: LucideIcon
  tone?: 'default' | 'ink'
}

export function SectionHeading({
  align = 'left',
  badge,
  body,
  className,
  icon: Icon,
  title,
  tone = 'default',
}: SectionHeadingProps) {
  const centered = align === 'center'
  const bodyColor = tone === 'ink' ? 'text-[var(--ink-muted)]' : 'text-[var(--foreground-muted)]'

  return (
    <div className={cn(centered && 'mx-auto max-w-4xl text-center', className)}>
      <Badge className={tone === 'ink' ? 'border-[var(--ink-line)] bg-transparent text-[var(--accent-soft)]' : undefined}>
        <Icon aria-hidden="true" className="h-4 w-4" />
        {badge}
      </Badge>
      <h2 className="arcade-section-title mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
        {title}
      </h2>
      <p className={cn('mt-5 max-w-2xl text-lg leading-8', bodyColor, centered && 'mx-auto')}>
        {body}
      </p>
    </div>
  )
}

type CardGridProps = {
  children: ReactNode
  className?: string
  columns: keyof typeof gridColumnClasses
}

export function CardGrid({ children, className, columns }: CardGridProps) {
  return (
    <div className={cn('grid gap-4', gridColumnClasses[columns], className)}>
      {children}
    </div>
  )
}

type GradientCardProps = {
  as?: 'article' | 'div'
  children: ReactNode
  className?: string
  interactive?: boolean
  tone?: 'default' | 'ink'
}

export function GradientCard({
  as = 'article',
  children,
  className,
  interactive = false,
  tone = 'default',
}: GradientCardProps) {
  const Tag = as

  return (
    <Tag
      className={cn(
        'photo-card rounded-md border p-5 shadow-[var(--panel-shadow)]',
        tone === 'ink' ? 'border-[var(--ink-line)]' : 'border-[var(--line)]',
        interactive && 'photo-card-interactive transition hover:border-[var(--accent-border)]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

type ProofListProps = {
  className?: string
  columns?: keyof typeof proofColumnClasses
  items: readonly string[]
  tone?: 'default' | 'ink'
}

export function ProofList({
  className,
  columns = 1,
  items,
  tone = 'default',
}: ProofListProps) {
  const textColor = tone === 'ink' ? 'text-[var(--ink-muted)]' : 'text-[var(--foreground-muted)]'
  const borderColor = tone === 'ink' ? 'border-[var(--ink-line)]' : 'border-[var(--line)]'

  return (
    <ul className={cn('grid gap-3', proofColumnClasses[columns], className)}>
      {items.map((item) => (
        <li
          className={cn('flex items-start gap-3 rounded-md border px-4 py-3 text-sm leading-6', borderColor, textColor)}
          key={item}
        >
          <BadgeCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-muted)]" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export type CtaAction = CallToActionContent & {
  icon?: LucideIcon
  variant?: 'default' | 'outline'
}

type CtaBlockProps = {
  actions: readonly CtaAction[]
  align?: 'center' | 'left'
  className?: string
}

export function CtaBlock({ actions, align = 'left', className }: CtaBlockProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      {actions.map(({ icon: Icon, label, target, variant }) => (
        <Button href={target} key={label} size="lg" variant={variant}>
          {Icon ? <Icon aria-hidden="true" className="h-5 w-5" /> : null}
          {label}
          {!Icon && variant === 'outline' ? (
            <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
          ) : null}
        </Button>
      ))}
    </div>
  )
}

function UseCaseDetail({
  body,
  label,
}: {
  body: string
  label: string
}) {
  return (
    <div className="rounded-md border border-[var(--line)] px-4 py-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-muted)]">
        {label}
      </dt>
      <dd className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{body}</dd>
    </div>
  )
}

export function StepFlow({ items }: { items: readonly string[] }) {
  return (
    <ol aria-label="Workflow sequence" className="grid gap-2 lg:grid-cols-5">
      {items.map((item) => (
        <li
          className="relative rounded-md border border-[var(--line)] px-3 py-3 text-sm leading-5 text-[var(--foreground-muted)]"
          key={item}
        >
          {item}
        </li>
      ))}
    </ol>
  )
}

export function UseCaseFlow({ useCase }: { useCase: UseCaseContent }) {
  return (
    <GradientCard className="p-6 sm:p-7">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
        {useCase.label}
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{useCase.title}</h3>
      <div className="mt-6">
        <StepFlow items={useCase.flow} />
      </div>
      <dl className="mt-6 grid gap-3 lg:grid-cols-2">
        <UseCaseDetail body={useCase.startingState} label="Starting state" />
        <UseCaseDetail body={useCase.systemMap} label="System map" />
        <UseCaseDetail body={useCase.agentBehavior} label="Agent behavior" />
        <UseCaseDetail body={useCase.humanControls} label="Human controls" />
        <UseCaseDetail body={useCase.exceptionPath} label="Exception path" />
        <UseCaseDetail body={useCase.decisionEvidence} label="Decision evidence" />
      </dl>
    </GradientCard>
  )
}

export function InsetPhoto({
  className,
  photo,
}: {
  className?: string
  photo: SitePhoto
}) {
  return (
    <figure aria-hidden="true" className={cn('inset-photo', className)}>
      <img
        alt=""
        decoding="async"
        height={photo.height}
        loading="lazy"
        src={photo.src}
        width={photo.width}
      />
    </figure>
  )
}
