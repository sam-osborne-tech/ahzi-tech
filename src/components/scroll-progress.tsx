import { useEffect, useRef, useState } from 'react'
import { siteContent } from '../content/site-content'

type SectionLink = {
  id: string
  label: string
}

const sections: SectionLink[] = siteContent.nav.map(({ label, target }) => ({
  id: target.slice(1),
  label,
}))

const activeSectionRatio = 0.35

function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frameId: number | null = null

    const measure = () => {
      frameId = null
      const scrollable = document.documentElement.scrollHeight - window.innerHeight

      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0)
    }

    const requestMeasure = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)

    return () => {
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return progress
}

function useVisitedSections() {
  const [visited, setVisited] = useState<ReadonlySet<string>>(new Set())
  const visitedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false

        for (const entry of entries) {
          if (entry.isIntersecting && !visitedRef.current.has(entry.target.id)) {
            visitedRef.current.add(entry.target.id)
            changed = true
          }
        }

        if (changed) {
          setVisited(new Set(visitedRef.current))
        }
      },
      { threshold: activeSectionRatio },
    )

    for (const { id } of sections) {
      const section = document.getElementById(id)

      if (section) {
        observer.observe(section)
      }
    }

    return () => observer.disconnect()
  }, [])

  return visited
}

export function ScrollProgress() {
  const progress = useScrollProgress()
  const visited = useVisitedSections()

  return (
    <>
      <div
        aria-label="Page scroll progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progress * 100)}
        className="scroll-progress"
        role="progressbar"
      >
        <span
          className="scroll-progress__fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <nav aria-label="Section navigation" className="scroll-dots">
        {sections.map(({ id, label }) => (
          <a
            aria-label={label}
            className="scroll-dots__dot"
            data-visited={visited.has(id) || undefined}
            href={`#${id}`}
            key={id}
            title={label}
          >
            <span aria-hidden="true" />
          </a>
        ))}
      </nav>
    </>
  )
}
