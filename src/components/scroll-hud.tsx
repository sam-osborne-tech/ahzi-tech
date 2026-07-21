import { useEffect, useRef, useState } from 'react'

type Checkpoint = {
  id: string
  label: string
}

const checkpoints: Checkpoint[] = [
  { id: 'benefits', label: 'Missions' },
  { id: 'platforms', label: 'Arsenal' },
  { id: 'how', label: 'Campaign' },
  { id: 'why', label: 'Why Ahzi' },
  { id: 'outputs', label: 'Loot' },
  { id: 'first-sprint', label: 'Insert coin' },
  { id: 'contact', label: 'Continue' },
]

const clearedSectionRatio = 0.35
const xpPerCheckpoint = 100

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

function useClearedCheckpoints() {
  const [cleared, setCleared] = useState<ReadonlySet<string>>(new Set())
  const clearedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false

        for (const entry of entries) {
          if (entry.isIntersecting && !clearedRef.current.has(entry.target.id)) {
            clearedRef.current.add(entry.target.id)
            changed = true
          }
        }

        if (changed) {
          setCleared(new Set(clearedRef.current))
        }
      },
      { threshold: clearedSectionRatio },
    )

    for (const { id } of checkpoints) {
      const section = document.getElementById(id)

      if (section) {
        observer.observe(section)
      }
    }

    return () => observer.disconnect()
  }, [])

  return cleared
}

export function ScrollHud() {
  const progress = useScrollProgress()
  const cleared = useClearedCheckpoints()
  const allClear = cleared.size === checkpoints.length
  const score = cleared.size * xpPerCheckpoint + Math.round(progress * xpPerCheckpoint)

  return (
    <div aria-hidden={false} className="scroll-hud" data-all-clear={allClear || undefined}>
      <div
        aria-label="Page scroll progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progress * 100)}
        className="scroll-hud__bar"
        role="progressbar"
      >
        <span className="scroll-hud__fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="scroll-hud__readout">
        <span className="scroll-hud__score">
          {allClear ? 'ALL CLEAR // BONUS ROUND' : `SCORE ${String(score).padStart(4, '0')}`}
        </span>
        <span className="scroll-hud__levels">
          LV {cleared.size}/{checkpoints.length}
        </span>
        <span className="scroll-hud__chips">
          {checkpoints.map(({ id, label }) => (
            <a
              className="scroll-hud__chip"
              data-cleared={cleared.has(id) || undefined}
              href={`#${id}`}
              key={id}
            >
              <span aria-hidden="true">{cleared.has(id) ? '■' : '□'}</span>
              {label}
            </a>
          ))}
        </span>
      </div>
    </div>
  )
}
