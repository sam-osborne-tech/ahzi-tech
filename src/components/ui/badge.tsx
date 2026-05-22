import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase text-[var(--accent-muted)]',
        className,
      )}
      data-slot="badge"
      {...props}
    />
  )
}
