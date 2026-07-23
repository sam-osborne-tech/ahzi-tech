import { useEffect } from 'react'

const headerOffsetPadding = 16
const layoutSettleDelayMs = 120

function headerOffset() {
  const header = document.querySelector('header')
  return (header?.getBoundingClientRect().height ?? 0) + headerOffsetPadding
}

function scrollCurrentHashIntoView() {
  const targetId = window.location.hash.slice(1)
  if (!targetId) return

  const target = document.getElementById(targetId)
  if (!target) return

  window.scrollTo({
    behavior: 'auto',
    top: Math.max(target.getBoundingClientRect().top + window.scrollY - headerOffset(), 0),
  })
}

export function useStableHashNavigation() {
  useEffect(() => {
    let animationFrameId: number | null = null
    let timeoutId: number | null = null
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const scrollToHashTarget = () => {
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
      if (timeoutId !== null) window.clearTimeout(timeoutId)

      animationFrameId = window.requestAnimationFrame(() => {
        scrollCurrentHashIntoView()
        animationFrameId = null
      })
      timeoutId = window.setTimeout(() => {
        scrollCurrentHashIntoView()
        timeoutId = null
      }, layoutSettleDelayMs)
    }

    scrollToHashTarget()
    window.addEventListener('hashchange', scrollToHashTarget)
    window.addEventListener('popstate', scrollToHashTarget)

    return () => {
      window.removeEventListener('hashchange', scrollToHashTarget)
      window.removeEventListener('popstate', scrollToHashTarget)
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])
}
