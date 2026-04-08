import type { ButtonHTMLAttributes, ReactNode } from 'react'

const baseClassName =
  'inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-6 py-3 font-body text-sm font-semibold text-bg-primary shadow-sm transition hover:border-accent-hover hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:pointer-events-none disabled:opacity-40'

export type ButtonProps = {
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={className ? `${baseClassName} ${className}` : baseClassName}
      {...props}
    >
      {children}
    </button>
  )
}
