import { useEffect } from 'react'

const revealSectionSelector = '.arcade-shell > section:not(.arcade-hero)'
const revealPendingClass = 'reveal-pending'
const revealInClass = 'reveal-in'

// Content is visible by default; the pending (hidden) state is only applied
// here, right before observing, so no browser or no-JS visitor can ever be
// stuck with hidden or blurred sections. Reveals re-fire: the class toggles
// on every enter and is removed once a section fully leaves the viewport,
// so scrolling back up and down animates again.
export function useSectionReveals() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const sections = document.querySelectorAll<HTMLElement>(revealSectionSelector)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle(revealInClass, entry.isIntersecting)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    )

    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      const alreadyVisible = rect.top < window.innerHeight * 0.88 && rect.bottom > 0

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
      }
    }
  }, [])
}
