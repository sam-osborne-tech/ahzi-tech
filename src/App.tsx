import { Bot } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useRef, useState } from 'react'
import { AgentChat } from './components/agent-chat'
import { ScrollProgress } from './components/scroll-progress'
import {
  AhziWordmark,
  AudienceProblemSection,
  ConversionSection,
  DeliverySection,
  FirstEngagementSection,
  HeroSection,
  ProofSection,
  UseCasesSection,
} from './components/site-sections'
import { useProtectedContact } from './components/use-protected-contact'
import { useSectionReveals } from './components/use-section-reveals'
import { useStableHashNavigation } from './components/use-stable-hash-navigation'
import { Button } from './components/ui/button'
import { siteContent } from './content/site-content'
import { phoneTo } from './lib/contact'
import { footerLinkClass, foregroundHoverClass } from './lib/style-classes'

type SiteHeaderProps = {
  isAgentOpen: boolean
  openAgent: (event: MouseEvent<HTMLAnchorElement>) => void
}

function SiteHeader({ isAgentOpen, openAgent }: SiteHeaderProps) {
  return (
    <header className="arcade-header fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--background-glass)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a aria-label="Ahzi home" className="flex items-center gap-3" href="#top">
          <AhziWordmark />
        </a>
        <nav className="hidden items-center gap-6 text-sm text-[var(--foreground-muted)] md:flex">
          {siteContent.nav.map(({ label, target }) => (
            <a className={foregroundHoverClass} href={target} key={target}>
              {label}
            </a>
          ))}
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
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--foreground-subtle)] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span>{siteContent.footer.tagline}</span>
        <a className={footerLinkClass} href={siteContent.footer.cta.target}>
          {siteContent.footer.cta.label}
        </a>
      </div>
    </footer>
  )
}

function App() {
  const [isAgentOpen, setIsAgentOpen] = useState(false)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const { contactNotice, openProtectedMailTo, prepareLeadDraft } =
    useProtectedContact(setIsAgentOpen)

  useSectionReveals()
  useStableHashNavigation()

  const openAgent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    restoreFocusRef.current = event.currentTarget
    setIsAgentOpen(true)
  }

  return (
    <main className="arcade-shell min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <a className="skip-link" href="#top">Skip to main content</a>
      <SiteHeader isAgentOpen={isAgentOpen} openAgent={openAgent} />
      <HeroSection />
      <AudienceProblemSection />
      <UseCasesSection />
      <DeliverySection />
      <ProofSection />
      <FirstEngagementSection />
      <ConversionSection contactNotice={contactNotice} onPrepareDraft={prepareLeadDraft} />
      <SiteFooter />
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
