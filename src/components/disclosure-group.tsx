import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'

type DisclosureGroupProps<Item> = {
  ariaLabel: string
  className?: string
  getItemId: (item: Item) => string
  groupId: string
  itemClassName?: string
  items: readonly Item[]
  renderPanel: (item: Item) => ReactNode
  renderSummary: (item: Item) => ReactNode
}

function hashTarget() {
  if (typeof window === 'undefined') return ''
  const target = window.location.hash.slice(1)

  try {
    return decodeURIComponent(target)
  } catch {
    return target
  }
}

function linkedItemId(itemIds: readonly string[]) {
  const target = hashTarget()
  return itemIds.find((id) => target === id || target === `${id}-panel`) ?? null
}

function pushHash(target: string) {
  if (typeof window === 'undefined' || hashTarget() === target) return
  window.history.pushState(null, '', `#${target}`)
}

export function DisclosureGroup<Item>({
  ariaLabel,
  className,
  getItemId,
  groupId,
  itemClassName,
  items,
  renderPanel,
  renderSummary,
}: DisclosureGroupProps<Item>) {
  const itemIds = useMemo(() => items.map(getItemId), [getItemId, items])
  const [openId, setOpenId] = useState<string | null>(() => linkedItemId(itemIds))

  useEffect(() => {
    const revealLinkedItem = () => {
      const nextId = linkedItemId(itemIds)
      if (!nextId) {
        if (hashTarget() === groupId) setOpenId(null)
        return
      }

      setOpenId(nextId)
      window.requestAnimationFrame(() => {
        document.getElementById(`${nextId}-trigger`)?.focus({ preventScroll: true })
      })
    }

    revealLinkedItem()
    window.addEventListener('hashchange', revealLinkedItem)
    window.addEventListener('popstate', revealLinkedItem)
    return () => {
      window.removeEventListener('hashchange', revealLinkedItem)
      window.removeEventListener('popstate', revealLinkedItem)
    }
  }, [groupId, itemIds])

  const activeOpenId = openId && itemIds.includes(openId) ? openId : null

  const toggle = (itemId: string) => {
    const nextId = activeOpenId === itemId ? null : itemId
    setOpenId(nextId)
    pushHash(nextId ?? groupId)
  }

  return (
    <div aria-label={ariaLabel} className={cn('disclosure-group', className)} role="group">
      {items.map((item) => {
        const itemId = getItemId(item)
        const panelId = `${itemId}-panel`
        const triggerId = `${itemId}-trigger`
        const isOpen = activeOpenId === itemId

        return (
          <article
            className={cn('disclosure-item photo-card', itemClassName)}
            data-state={isOpen ? 'open' : 'closed'}
            id={itemId}
            key={itemId}
          >
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="disclosure-trigger"
              id={triggerId}
              onClick={() => toggle(itemId)}
              type="button"
            >
              <span className="min-w-0 flex-1">{renderSummary(item)}</span>
              <ChevronDown
                aria-hidden="true"
                className={cn('disclosure-chevron', isOpen && 'rotate-180')}
              />
            </button>
            <div
              aria-labelledby={triggerId}
              className="disclosure-panel"
              hidden={!isOpen}
              id={panelId}
              role="region"
            >
              {renderPanel(item)}
            </div>
          </article>
        )
      })}
    </div>
  )
}
