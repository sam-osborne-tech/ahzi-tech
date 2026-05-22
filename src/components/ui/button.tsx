import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-strong)]',
        outline:
          'border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent-muted)] hover:text-[var(--accent-muted)]',
        ghost:
          'border-transparent bg-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ComponentProps<'a'> &
  VariantProps<typeof buttonVariants> & {
    disabled?: boolean
  }

export function Button({
  className,
  variant,
  size,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <a
      aria-disabled={disabled}
      className={cn(buttonVariants({ variant, size }), className)}
      data-slot="button"
      {...props}
    />
  )
}
