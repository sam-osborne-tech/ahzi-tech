import { AgentCatalog } from './components/agent-catalog'
import { AgentLab } from './components/agent-lab'
import { ScrollProgress } from './components/scroll-progress'
import {
  AhziWordmark,
  ConversionSection,
  EngagementSection,
  HeroSection,
  OfferingsSection,
  ProofSection,
  UseCasesSection,
} from './components/site-sections'
import { useProtectedContact } from './components/use-protected-contact'
import { useSectionReveals } from './components/use-section-reveals'
import { useStableHashNavigation } from './components/use-stable-hash-navigation'
import { Button } from './components/ui/button'
import { siteContent } from './content/site-content'
import { footerLinkClass, foregroundHoverClass } from './lib/style-classes'

function SiteHeader() {
  return (
    <header className="arcade-header fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--background-glass)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a aria-label="Ahzi home" className="flex items-center gap-3" href="#top">
          <AhziWordmark />
        </a>
        <nav className="hidden items-center gap-6 text-sm text-[var(--foreground-muted)] xl:flex">
          {siteContent.nav.map(({ label, target }) => (
            <a className={foregroundHoverClass} href={target} key={target}>
              {label}
            </a>
          ))}
        </nav>
        <Button
          href="#contact"
          size="sm"
          variant="outline"
        >
          Review a workflow
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
  const { contactNotice, prepareLeadDraft } = useProtectedContact()

  useSectionReveals()
  useStableHashNavigation()

  return (
    <main className="arcade-shell min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <a className="skip-link" href="#top">Skip to main content</a>
      <SiteHeader />
      <HeroSection />
      <AgentLab />
      <OfferingsSection />
      <AgentCatalog />
      <UseCasesSection />
      <ProofSection />
      <EngagementSection />
      <ConversionSection contactNotice={contactNotice} onPrepareDraft={prepareLeadDraft} />
      <SiteFooter />
      <ScrollProgress />
    </main>
  )
}

export default App
