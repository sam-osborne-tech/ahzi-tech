import { useCallback, useEffect, useRef, useState } from 'react'

const trustedContactDelayMs = 900
const retryNotice = 'Give the page a moment, then use the contact button again.'

export function useProtectedContact() {
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

  return { contactNotice, prepareLeadDraft }
}
