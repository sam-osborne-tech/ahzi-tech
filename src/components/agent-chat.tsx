import {
  Bot,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import type { Dispatch, FormEvent, MouseEvent, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  foregroundHoverClass,
  iconControlClass,
  secondaryActionClass,
} from '../lib/style-classes'

export type ProtectedMailToHandler = (
  event: MouseEvent<HTMLAnchorElement>,
  subject?: string,
  body?: string,
) => void

type AgentMessage = {
  role: 'agent' | 'visitor'
  text: string
}

type AgentChatProps = {
  isOpen: boolean
  openProtectedMailTo: ProtectedMailToHandler
  phoneHref: string
  restoreFocusRef: {
    current: HTMLElement | null
  }
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const intakeOptions = [
  'Find an AI opportunity',
  'Build an AI product',
  'Fix CRM readiness',
  'Automate a workflow',
  'Evaluate a model',
  'Scale a pilot',
]

const firstAgentMessage =
  'MISSION CONTROL ONLINE. What business result are you trying to unlock with AI?'

function getAgentReply(input: string, selectedNeeds: string[]) {
  const currentInput = input.toLowerCase()
  const fullContext = `${currentInput} ${selectedNeeds.join(' ')}`.toLowerCase()

  if (currentInput.includes('report')) {
    return 'Start with the decisions those reports should drive. Then trace the data, workflow, and ownership behind them.'
  }

  if (currentInput.includes('data') || currentInput.includes('crm')) {
    return 'That points to data and CRM readiness. The AI workflow cannot depend on context the team cannot define, trust, or own.'
  }

  if (
    currentInput.includes('handoff') ||
    currentInput.includes('workflow') ||
    currentInput.includes('automation')
  ) {
    return 'That belongs in workflow design. Map where people, automations, and AI pass responsibility before the system expands.'
  }

  if (
    currentInput.includes('qa') ||
    currentInput.includes('evidence') ||
    currentInput.includes('test')
  ) {
    return 'The mission needs launch evidence: evaluations, acceptance checks, and the operating proof required to move forward.'
  }

  if (currentInput.includes('migration') || currentInput.includes('risk')) {
    return 'That needs a deployment map. Separate foundation work, technical blockers, release gates, and lower-risk launch steps.'
  }

  if (
    currentInput.includes('adoption') ||
    currentInput.includes('enablement') ||
    currentInput.includes('rollout')
  ) {
    return 'That points to activation. Define who uses the AI workflow, what changes in their work, and what proof earns trust.'
  }

  if (currentInput.includes('strategy') || currentInput.includes('use case')) {
    return 'Start with the AI opportunity that has the clearest business value, then test whether the systems and workflow can support it.'
  }

  if (selectedNeeds.length >= 3) {
    return 'That is enough to shape a mission brief. The next useful detail is who owns the workflow and who must trust the result.'
  }

  if (fullContext.includes('report')) {
    return 'Start with the decisions those reports should drive. Then trace the data, workflow, and ownership behind them.'
  }

  if (fullContext.includes('data') || fullContext.includes('crm')) {
    return 'That points to data and CRM readiness. The AI workflow cannot depend on context the team cannot define, trust, or own.'
  }

  if (
    fullContext.includes('adoption') ||
    fullContext.includes('enablement') ||
    fullContext.includes('rollout')
  ) {
    return 'That points to activation. Define who uses the AI workflow, what changes in their work, and what proof earns trust.'
  }

  return 'Add one more constraint and I can turn this into a cleaner AI mission brief.'
}

export function AgentChat({
  isOpen,
  openProtectedMailTo,
  phoneHref,
  restoreFocusRef,
  setIsOpen,
}: AgentChatProps) {
  const [draft, setDraft] = useState('')
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [messages, setMessages] = useState<AgentMessage[]>([
    { role: 'agent', text: firstAgentMessage },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesLogRef = useRef<HTMLDivElement>(null)

  const closeAgent = useCallback(() => {
    setIsOpen(false)

    window.requestAnimationFrame(() => {
      const restoreTarget = restoreFocusRef.current

      if (restoreTarget?.isConnected) {
        restoreTarget.focus()
        return
      }

      document.getElementById('agent')?.focus()
    })
  }, [restoreFocusRef, setIsOpen])

  useEffect(() => {
    if (!isOpen) return

    const animationFrameId = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAgent()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeAgent, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const animationFrameId = window.requestAnimationFrame(() => {
      const log = messagesLogRef.current
      if (log) log.scrollTop = log.scrollHeight
    })

    return () => window.cancelAnimationFrame(animationFrameId)
  }, [isOpen, messages])

  const summaryEmailBody = useMemo(() => {
    const selected = selectedNeeds.length ? selectedNeeds.join(', ') : 'None selected yet'
    const conversation = messages
      .map(({ role, text }) => `${role === 'agent' ? 'Ahzi mission control' : 'Visitor'}: ${text}`)
      .join('\n')

    return `Needs selected: ${selected}\n\nConversation:\n${conversation}`
  }, [messages, selectedNeeds])

  const addVisitorMessage = (text: string, needs = selectedNeeds) => {
    setMessages((current) => [
      ...current,
      { role: 'visitor', text },
      { role: 'agent', text: getAgentReply(text, needs) },
    ])
  }

  const handleOption = (option: string) => {
    if (selectedNeeds.includes(option)) return

    const nextNeeds = [...selectedNeeds, option]
    setSelectedNeeds(nextNeeds)
    addVisitorMessage(option, nextNeeds)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setDraft('')
    addVisitorMessage(text)
  }

  const handleReset = () => {
    setDraft('')
    setSelectedNeeds([])
    setMessages([{ role: 'agent', text: firstAgentMessage }])
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  const handleSummaryEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    openProtectedMailTo(event, 'AI consulting conversation', summaryEmailBody)
  }

  if (!isOpen) {
    return (
      <button
        aria-controls="ahzi-agent-panel"
        aria-expanded={false}
        aria-label="Open Ahzi mission control"
        className="fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] right-4 z-[70] inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[var(--panel-shadow)] transition hover:bg-[var(--accent-strong)] md:right-5 md:h-12 md:w-12"
        id="agent"
        onClick={(event) => {
          restoreFocusRef.current = event.currentTarget
          setIsOpen(true)
        }}
        type="button"
      >
        <MessageCircle aria-hidden="true" className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    )
  }

  return (
    <aside
      aria-label="Ahzi mission control"
      className="fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] left-4 right-4 z-[70] max-h-[calc(100svh_-_2rem_-_env(safe-area-inset-bottom))] overflow-hidden rounded-md border border-[var(--line)] bg-[rgb(5_6_16_/_96%)] shadow-[0_24px_90px_rgb(0_0_0_/_50%)] backdrop-blur-xl sm:left-auto sm:w-[23rem]"
      id="ahzi-agent-panel"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[rgb(53_243_255_/_14%)] text-[var(--accent)]">
            <Bot aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-[var(--foreground)]">Mission control</div>
            <div className="text-xs text-[var(--foreground-subtle)]">Project intake // online</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Reset mission control conversation"
            className={iconControlClass}
            onClick={handleReset}
            title="Reset conversation"
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            aria-label="Close mission control"
            className={iconControlClass}
            onClick={closeAgent}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        aria-label="Ahzi mission control conversation"
        aria-live="polite"
        className="max-h-[min(17rem,34svh)] space-y-3 overflow-y-auto p-4"
        ref={messagesLogRef}
        role="log"
      >
        {messages.map(({ role, text }, index) => (
          <div
            className={`flex ${role === 'visitor' ? 'justify-end' : 'justify-start'}`}
            key={`${role}-${index}-${text}`}
          >
            <div
              className={`max-w-[85%] rounded-md border px-3 py-2 text-sm leading-6 ${
                role === 'visitor'
                  ? 'border-[rgb(53_243_255_/_50%)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'border-[var(--line)] bg-[rgb(255_255_255_/_6%)] text-[var(--foreground-muted)]'
              }`}
            >
              {text}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-[var(--line)] p-3 sm:p-4">
        {intakeOptions.map((option) => {
          const isSelected = selectedNeeds.includes(option)

          return (
            <button
              aria-pressed={isSelected}
              className={`rounded-md border px-3 py-2 text-left text-xs leading-5 transition disabled:cursor-default disabled:opacity-100 ${
                isSelected
                  ? 'border-[rgb(140_255_90_/_60%)] bg-[rgb(140_255_90_/_12%)] text-[var(--pixel-green)]'
                  : `border-[var(--line)] text-[var(--foreground-muted)] ${foregroundHoverClass}`
              }`}
              disabled={isSelected}
              key={option}
              onClick={() => handleOption(option)}
              type="button"
            >
              {option}
            </button>
          )
        })}
      </div>

      <form className="flex gap-2 border-t border-[var(--line)] p-3 sm:p-4" onSubmit={handleSubmit}>
        <input
          aria-label="Message Ahzi mission control"
          className="min-w-0 flex-1 rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_6%)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-subtle)] focus:border-[var(--ring)]"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Enter your mission"
          ref={inputRef}
          type="text"
          value={draft}
        />
        <button
          aria-label="Send message"
          className="grid h-11 w-11 place-items-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!draft.trim()}
          type="submit"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>

      <div className="grid grid-cols-2 gap-2 border-t border-[var(--line)] p-4 pt-0">
        <a className="inline-flex items-center justify-center gap-2 rounded-md bg-[rgb(255_255_255_/_8%)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[rgb(255_255_255_/_12%)]" href="#agent" onClick={handleSummaryEmail}>
          <Sparkles aria-hidden="true" className="h-4 w-4" />
          Export brief
        </a>
        <a className={secondaryActionClass} href={phoneHref}>
          <Phone aria-hidden="true" className="h-4 w-4" />
          Contact Ahzi
        </a>
      </div>
    </aside>
  )
}
