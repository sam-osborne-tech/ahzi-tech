import {
  Bot,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import type {
  Dispatch,
  FormEvent,
  MouseEvent,
  RefObject,
  SetStateAction,
} from 'react'
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
  restoreFocusRef: RefObject<HTMLElement | null>
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const streamIntervalMs = 24
const streamCharsPerTick = 2
const intakeOptions = [
  'Map AI candidates in my CRM',
  'Build an agent or copilot',
  'Extract data from documents',
  'Automate a review workflow',
  'Evaluate models on my data',
  'Take a pilot to production',
]
const firstAgentMessage =
  'Scripted demo online. What workflow are you trying to automate, and what system does it live in today?'
const initialMessages: AgentMessage[] = [{ role: 'agent', text: firstAgentMessage }]
const agentReplies = {
  activation:
    'That points to activation. Define who uses the AI workflow, what changes in their work, and what proof earns trust.',
  data:
    'That points to data and CRM readiness. The AI workflow cannot depend on context the team cannot define, trust, or own.',
  evidence:
    'That needs launch evidence: evaluations, acceptance checks, and the operating proof required to move forward.',
  migration:
    'That needs a deployment map. Separate foundation work, technical blockers, release gates, and lower-risk launch steps.',
  moreContext: 'Add one more constraint and I can turn this into a cleaner AI project brief.',
  projectBrief:
    'That is enough to shape a project brief. The next useful detail is who owns the workflow and who must trust the result.',
  reporting:
    'Start with the decisions those reports should drive. Then trace the data, workflow, and ownership behind them.',
  strategy:
    'Start with the AI opportunity that has the clearest business value, then test whether the systems and workflow can support it.',
  workflow:
    'That belongs in workflow design. Map where people, automations, and AI pass responsibility before the system expands.',
} as const

function StreamedText({ text }: { text: string }) {
  const [visibleCount, setVisibleCount] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? text.length : 0,
  )

  useEffect(() => {
    if (visibleCount >= text.length) return
    const intervalId = window.setInterval(() => {
      setVisibleCount((count) => Math.min(count + streamCharsPerTick, text.length))
    }, streamIntervalMs)
    return () => window.clearInterval(intervalId)
  }, [text, visibleCount])

  return (
    <>
      {text.slice(0, visibleCount)}
      {visibleCount < text.length ? <span aria-hidden="true" className="stream-caret" /> : null}
    </>
  )
}

function includesAny(value: string, terms: readonly string[]) {
  return terms.some((term) => value.includes(term))
}

function getAgentReply(input: string, selectedNeeds: string[]) {
  const currentInput = input.toLowerCase()
  const fullContext = `${currentInput} ${selectedNeeds.join(' ')}`.toLowerCase()

  if (currentInput.includes('report')) return agentReplies.reporting
  if (includesAny(currentInput, ['data', 'crm'])) return agentReplies.data
  if (includesAny(currentInput, ['handoff', 'workflow', 'automation'])) return agentReplies.workflow
  if (includesAny(currentInput, ['qa', 'evidence', 'test'])) return agentReplies.evidence
  if (includesAny(currentInput, ['migration', 'risk'])) return agentReplies.migration
  if (includesAny(currentInput, ['adoption', 'enablement', 'rollout'])) return agentReplies.activation
  if (includesAny(currentInput, ['strategy', 'use case'])) return agentReplies.strategy
  if (selectedNeeds.length >= 3) return agentReplies.projectBrief
  if (fullContext.includes('report')) return agentReplies.reporting
  if (includesAny(fullContext, ['data', 'crm'])) return agentReplies.data
  if (includesAny(fullContext, ['adoption', 'enablement', 'rollout'])) return agentReplies.activation
  return agentReplies.moreContext
}

function summaryBody(messages: AgentMessage[], selectedNeeds: string[]) {
  const selected = selectedNeeds.length ? selectedNeeds.join(', ') : 'None selected yet'
  const conversation = messages
    .map(({ role, text }) => `${role === 'agent' ? 'Ahzi assistant' : 'Visitor'}: ${text}`)
    .join('\n')
  return `Needs selected: ${selected}\n\nConversation:\n${conversation}`
}

function useAgentConversation(
  inputRef: RefObject<HTMLInputElement | null>,
  openProtectedMailTo: ProtectedMailToHandler,
) {
  const [draft, setDraft] = useState('')
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [messages, setMessages] = useState<AgentMessage[]>(initialMessages)
  const emailBody = useMemo(() => summaryBody(messages, selectedNeeds), [messages, selectedNeeds])

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
    setMessages(initialMessages)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }
  const handleSummaryEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    openProtectedMailTo(event, 'AI consulting conversation', emailBody)
  }

  return {
    draft,
    handleOption,
    handleReset,
    handleSubmit,
    handleSummaryEmail,
    messages,
    selectedNeeds,
    setDraft,
  }
}

function useAgentDialog(
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  restoreFocusRef: RefObject<HTMLElement | null>,
  inputRef: RefObject<HTMLInputElement | null>,
  messagesLogRef: RefObject<HTMLDivElement | null>,
  messageCount: number,
) {
  const closeAgent = useCallback(() => {
    setIsOpen(false)
    window.requestAnimationFrame(() => {
      const restoreTarget = restoreFocusRef.current
      if (restoreTarget?.isConnected) restoreTarget.focus()
      else document.getElementById('agent')?.focus()
    })
  }, [restoreFocusRef, setIsOpen])

  useEffect(() => {
    if (!isOpen) return
    const animationFrameId = window.requestAnimationFrame(() => inputRef.current?.focus())
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAgent()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeAgent, inputRef, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const animationFrameId = window.requestAnimationFrame(() => {
      const log = messagesLogRef.current
      if (log) log.scrollTop = log.scrollHeight
    })
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [isOpen, messageCount, messagesLogRef])

  return closeAgent
}

function ChatLauncher({
  restoreFocusRef,
  setIsOpen,
}: Pick<AgentChatProps, 'restoreFocusRef' | 'setIsOpen'>) {
  return (
    <button
      aria-controls="ahzi-agent-panel"
      aria-expanded={false}
      aria-label="Open Ahzi assistant chat"
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

function ChatHeader({ closeAgent, handleReset }: {
  closeAgent: () => void
  handleReset: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--accent-wash)] text-[var(--accent)]"><Bot aria-hidden="true" className="h-5 w-5" /></span>
        <div>
          <div className="text-sm font-semibold text-[var(--foreground)]">Ahzi assistant</div>
          <div className="text-xs text-[var(--foreground-subtle)]">Scripted demo, not a live model</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Reset conversation" className={iconControlClass} onClick={handleReset} title="Reset conversation" type="button"><RotateCcw aria-hidden="true" className="h-4 w-4" /></button>
        <button aria-label="Close assistant chat" className={iconControlClass} onClick={closeAgent} type="button"><X aria-hidden="true" className="h-4 w-4" /></button>
      </div>
    </div>
  )
}

function ChatMessages({
  messages,
  messagesLogRef,
}: {
  messages: AgentMessage[]
  messagesLogRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div aria-label="Ahzi assistant conversation" aria-live="polite" className="max-h-[min(17rem,34svh)] space-y-3 overflow-y-auto p-4" ref={messagesLogRef} role="log">
      {messages.map(({ role, text }, index) => (
        <div className={`flex ${role === 'visitor' ? 'justify-end' : 'justify-start'}`} key={`${role}-${index}-${text}`}>
          <div className={`max-w-[85%] rounded-md border px-3 py-2 text-sm leading-6 ${role === 'visitor' ? 'border-[var(--accent-border)] bg-[var(--accent)] text-[var(--accent-foreground)]' : 'border-[var(--line)] bg-[rgb(255_255_255_/_6%)] text-[var(--foreground-muted)]'}`}>
            {role === 'agent' ? <StreamedText text={text} /> : text}
          </div>
        </div>
      ))}
    </div>
  )
}

function ChatOptions({
  handleOption,
  selectedNeeds,
}: {
  handleOption: (option: string) => void
  selectedNeeds: string[]
}) {
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-[var(--line)] p-3 sm:p-4">
      {intakeOptions.map((option) => {
        const isSelected = selectedNeeds.includes(option)
        return (
          <button
            aria-pressed={isSelected}
            className={`rounded-md border px-3 py-2 text-left text-xs leading-5 transition disabled:cursor-default disabled:opacity-100 ${isSelected ? 'border-[var(--accent-border)] bg-[var(--accent-wash)] text-[var(--accent)]' : `border-[var(--line)] text-[var(--foreground-muted)] ${foregroundHoverClass}`}`}
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
  )
}

function ChatComposer({
  draft,
  handleSubmit,
  inputRef,
  setDraft,
}: {
  draft: string
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  inputRef: RefObject<HTMLInputElement | null>
  setDraft: Dispatch<SetStateAction<string>>
}) {
  return (
    <form className="flex gap-2 border-t border-[var(--line)] p-3 sm:p-4" onSubmit={handleSubmit}>
      <input aria-label="Message the Ahzi assistant" className="min-w-0 flex-1 rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_6%)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-subtle)] focus:border-[var(--ring)]" onChange={(event) => setDraft(event.target.value)} placeholder="Describe your workflow" ref={inputRef} type="text" value={draft} />
      <button aria-label="Send message" className="grid h-11 w-11 place-items-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-45" disabled={!draft.trim()} type="submit">
        <Send aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  )
}

function ChatActions({
  handleSummaryEmail,
  phoneHref,
}: {
  handleSummaryEmail: (event: MouseEvent<HTMLAnchorElement>) => void
  phoneHref: string
}) {
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-[var(--line)] p-4 pt-0">
      <a className="inline-flex items-center justify-center gap-2 rounded-md bg-[rgb(255_255_255_/_8%)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[rgb(255_255_255_/_12%)]" href="#agent" onClick={handleSummaryEmail}><Sparkles aria-hidden="true" className="h-4 w-4" />Export brief</a>
      <a className={secondaryActionClass} href={phoneHref}><Phone aria-hidden="true" className="h-4 w-4" />Contact Ahzi</a>
    </div>
  )
}

export function AgentChat({
  isOpen,
  openProtectedMailTo,
  phoneHref,
  restoreFocusRef,
  setIsOpen,
}: AgentChatProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesLogRef = useRef<HTMLDivElement>(null)
  const conversation = useAgentConversation(inputRef, openProtectedMailTo)
  const closeAgent = useAgentDialog(isOpen, setIsOpen, restoreFocusRef, inputRef, messagesLogRef, conversation.messages.length)

  if (!isOpen) return <ChatLauncher restoreFocusRef={restoreFocusRef} setIsOpen={setIsOpen} />

  return (
    <aside aria-label="Ahzi assistant" className="fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] left-4 right-4 z-[70] max-h-[calc(100svh_-_2rem_-_env(safe-area-inset-bottom))] overflow-hidden rounded-md border border-[var(--line)] bg-[rgb(5_6_16_/_96%)] shadow-[0_24px_90px_rgb(0_0_0_/_50%)] backdrop-blur-xl sm:left-auto sm:w-[23rem]" id="ahzi-agent-panel">
      <ChatHeader closeAgent={closeAgent} handleReset={conversation.handleReset} />
      <ChatMessages messages={conversation.messages} messagesLogRef={messagesLogRef} />
      <ChatOptions handleOption={conversation.handleOption} selectedNeeds={conversation.selectedNeeds} />
      <ChatComposer draft={conversation.draft} handleSubmit={conversation.handleSubmit} inputRef={inputRef} setDraft={conversation.setDraft} />
      <ChatActions handleSummaryEmail={conversation.handleSummaryEmail} phoneHref={phoneHref} />
    </aside>
  )
}
