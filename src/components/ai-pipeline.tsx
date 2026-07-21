import { useEffect, useRef, useState } from 'react'

type PipelineNode = {
  detail: string
  label: string
  stage: string
  width: number
  x: number
}

const nodes: PipelineNode[] = [
  { x: 30, width: 190, label: 'Data + context', detail: 'CRM, docs, operations', stage: 'Map' },
  { x: 300, width: 160, label: 'Model layer', detail: 'Accuracy on your records', stage: 'Build' },
  { x: 540, width: 200, label: 'Agents + workflow', detail: 'Humans in the loop', stage: 'Build' },
  { x: 820, width: 150, label: 'Production', detail: 'Gated, human reviewed', stage: 'Activate' },
]

const nodeY = 118
const nodeHeight = 66
const linkY = nodeY + nodeHeight / 2
const linkClass = 'ai-pipeline__link'

const links = [
  { from: nodes[0], to: nodes[1], range: [0.08, 0.38] },
  { from: nodes[1], to: nodes[2], range: [0.38, 0.66] },
  { from: nodes[2], to: nodes[3], range: [0.66, 0.92] },
] as const

const sourceInputs = [92, 152, 212]

function linkPath(from: PipelineNode, to: PipelineNode) {
  const startX = from.x + from.width

  return `M${startX} ${linkY} C ${startX + 40} ${linkY}, ${to.x - 40} ${linkY}, ${to.x} ${linkY}`
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function usePipelineProgress(ref: { current: HTMLElement | null }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [progress, setProgress] = useState(prefersReducedMotion ? 1 : 0)

  useEffect(() => {
    if (prefersReducedMotion) return

    let frameId: number | null = null

    const measure = () => {
      frameId = null
      const element = ref.current

      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight
      const traveled = viewport * 0.85 - rect.top
      const span = rect.height + viewport * 0.45

      setProgress(clamp01(traveled / span))
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
  }, [prefersReducedMotion, ref])

  return progress
}

function segmentProgress(progress: number, [start, end]: readonly [number, number]) {
  return clamp01((progress - start) / (end - start))
}

export function AiPipeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progress = usePipelineProgress(containerRef)

  return (
    <div aria-hidden="true" className="ai-pipeline" ref={containerRef}>
      <svg fill="none" viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg">
        {sourceInputs.map((y, index) => {
          const drawn = segmentProgress(progress, [0, 0.12])

          return (
            <g key={y} style={{ opacity: drawn }}>
              <circle className="ai-pipeline__source" cx="4" cy={y} r="3.5" />
              <path
                className={linkClass}
                d={`M8 ${y} C 20 ${y}, 18 ${linkY}, ${nodes[0].x} ${linkY + (index - 1) * 8}`}
                pathLength={1}
                style={{ strokeDashoffset: 1 - drawn }}
              />
            </g>
          )
        })}
        {links.map(({ from, to, range }) => {
          const drawn = segmentProgress(progress, range)

          return (
            <g key={`${from.label}-${to.label}`}>
              <path
                className={linkClass}
                d={linkPath(from, to)}
                pathLength={1}
                style={{ strokeDashoffset: 1 - drawn }}
              />
              {drawn >= 1 ? (
                <circle className="ai-pipeline__packet" r="3.2">
                  <animateMotion dur="2.6s" path={linkPath(from, to)} repeatCount="indefinite" />
                </circle>
              ) : null}
            </g>
          )
        })}
        {nodes.map(({ detail, label, stage, width, x }, index) => {
          const appearAt = index === 0 ? 0.05 : links[index - 1].range[1]
          const shown = segmentProgress(progress, [appearAt, appearAt + 0.08])

          return (
            <g
              key={label}
              style={{
                opacity: shown,
                transform: `translateY(${(1 - shown) * 14}px)`,
              }}
            >
              <rect
                className="ai-pipeline__node"
                height={nodeHeight}
                rx="8"
                width={width}
                x={x}
                y={nodeY}
              />
              <text className="ai-pipeline__label" x={x + width / 2} y={nodeY + 28}>
                {label}
              </text>
              <text className="ai-pipeline__detail" x={x + width / 2} y={nodeY + 48}>
                {detail}
              </text>
              <text className="ai-pipeline__stage" x={x + width / 2} y={nodeY - 16}>
                {stage}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
