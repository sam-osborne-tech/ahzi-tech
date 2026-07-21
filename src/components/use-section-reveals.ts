import { useEffect } from 'react'

const revealSectionSelector = '.arcade-shell > section:not(.arcade-hero)'
const revealPendingClass = 'reveal-pending'
const revealInClass = 'reveal-in'
const revealFromAttr = 'revealFrom'

// Content is visible by default; the pending (hidden) state is only applied
// here, right before observing, so no browser or no-JS visitor can ever be
// stuck with hidden, blurred, or overlapped sections. Reveals re-fire on
// every enter and are direction-aware: a section records which viewport edge
// it entered or exited through, so re-entering from above animates down and
// entering from below animates up. Reduced motion gets a fade-only variant
// via CSS.
export function useSectionReveals() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const sections = document.querySelectorAll<HTMLElement>(revealSectionSelector)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement
          const rootTop = entry.rootBounds?.top ?? 0
          const crossedEdge = entry.boundingClientRect.top < rootTop ? 'top' : 'bottom'

          target.dataset[revealFromAttr] = crossedEdge
          target.classList.toggle(revealInClass, entry.isIntersecting)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    )

    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      const alreadyVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0

      section.dataset[revealFromAttr] = rect.top < 0 ? 'top' : 'bottom'
      section.classList.add(revealPendingClass)

      if (alreadyVisible) {
        section.classList.add(revealInClass)
      }

      observer.observe(section)
    }

    return () => {
      observer.disconnect()

      for (const section of sections) {
        section.classList.remove(revealPendingClass, revealInClass)
        delete section.dataset[revealFromAttr]
      }
    }
  }, [])
}
