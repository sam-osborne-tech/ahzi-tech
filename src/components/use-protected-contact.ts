import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { openMailTo } from '../lib/contact'
import type { ProtectedMailToHandler } from './agent-chat'

const trustedContactDelayMs = 900
const retryNotice = 'Give the page a moment, then use the contact button again.'

export function useProtectedContact(
  setIsAgentOpen: Dispatch<SetStateAction<boolean>>,
) {
  const [contactNotice, setContactNotice] = useState('')
  const humanInteractionRef = useRef(false)
  const pageReadyAtRef = useRef(0)

  useEffect(() => {
    pageReadyAtRef.current = window.performance.now()

    const markHumanInteraction = (event: Event) => {
      if (event.isTrusted) humanInteractionRef.current = true
    }

    window.addEventListener('pointerdown', markHumanInteraction, { passive: true })
    window.addEventListener('keydown', markHumanInteraction)

    return () => {
      window.removeEventListener('pointerdown', markHumanInteraction)
      window.removeEventListener('keydown', markHumanInteraction)
    }
  }, [])

  const contactIsReady = useCallback(
    () =>
      humanInteractionRef.current &&
      window.performance.now() - pageReadyAtRef.current >= trustedContactDelayMs,
    [],
  )

  const openProtectedMailTo = useCallback<ProtectedMailToHandler>(
    (event, subject, body) => {
      event.preventDefault()
      if (!event.nativeEvent.isTrusted || !contactIsReady()) {
        setContactNotice(retryNotice)
        setIsAgentOpen(false)
        window.location.hash = 'contact'
        return
      }

      setContactNotice('')
      openMailTo(subject, body)
    },
    [contactIsReady, setIsAgentOpen],
  )

  const prepareLeadDraft = useCallback(
    (mailTo: string) => {
      if (!contactIsReady()) {
        setContactNotice(retryNotice)
        return false
      }

      setContactNotice('')
      window.location.href = mailTo
      return true
    },
    [contactIsReady],
  )

  return { contactNotice, openProtectedMailTo, prepareLeadDraft }
}
