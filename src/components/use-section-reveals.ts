import { useEffect } from 'react'

const revealSectionSelector = '.arcade-shell > section:not(.arcade-hero)'
const revealPendingClass = 'reveal-pending'
const revealInClass = 'reveal-in'
const revealFromAttr = 'revealFrom'

// The reveal boundary is pulled 15% in from both viewport edges so a section
// re-entering from EITHER direction only animates once it is meaningfully
// visible. The un-reveal boundary is the viewport EXPANDED by 15% on both
// sides, so a section is only reset once it is fully offscreen plus margin;
// a reset can never happen while any part of a section is visible, which is
// what previously piled mid-transition content into neighboring sections.
const enterRootMargin = '-15% 0px -15% 0px'
const exitRootMargin = '15% 0px 15% 0px'

function crossedEdge(entry: IntersectionObserverEntry) {
  return entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0) ? 'top' : 'bottom'
}

// Content is visible by default; the pending (hidden) state is only applied
// here, right before observing, so no browser or no-JS visitor can ever be
// stuck with hidden or blurred sections. Direction-aware: entering from
// below animates up, re-entering from above animates down.
export function useSectionReveals() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const sections = document.querySelectorAll<HTMLElement>(revealSectionSelector)

    const enterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement

            target.dataset[revealFromAttr] = crossedEdge(entry)
            target.classList.add(revealInClass)
          }
        }
      },
      { rootMargin: enterRootMargin, threshold: 0 },
    )

    const exitObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            const target = entry.target as HTMLElement

            target.dataset[revealFromAttr] = crossedEdge(entry)
            target.classList.remove(revealInClass)
          }
        }
      },
      { rootMargin: exitRootMargin, threshold: 0 },
    )

    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      const alreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0

      section.dataset[revealFromAttr] = rect.top < 0 ? 'top' : 'bottom'
      section.classList.add(revealPendingClass)

      if (alreadyVisible) {
        section.classList.add(revealInClass)
      }

      enterObserver.observe(section)
      exitObserver.observe(section)
    }

    return () => {
      enterObserver.disconnect()
      exitObserver.disconnect()

      for (const section of sections) {
        section.classList.remove(revealPendingClass, revealInClass)
        delete section.dataset[revealFromAttr]
      }
    }
  }, [])
}
