/**
 * Design System Tokens
 *
 * Centralized design tokens for consistent UI across the application.
 * Following the Design System defined in DESIGN_SYSTEM.md
 *
 * PRINCIPLE: NEVER use hardcoded values - always use these tokens!
 */

/**
 * Button tokens
 */
export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

export const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-muted hover:text-foreground',
  ghost: 'hover:bg-muted hover:text-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
} as const

export const buttonBase = 'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

export function button(size: keyof typeof buttonSizes = 'md', variant: keyof typeof buttonVariants = 'primary'): string {
  return `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]}`
}

/**
 * Card tokens
 */
export const cardSizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const

export const cardBase = 'bg-card text-card-foreground rounded-lg shadow-md border border-border'

export function card(size: keyof typeof cardSizes = 'md', withHover: boolean = false): string {
  const hover = withHover ? 'hover:shadow-lg transition-shadow duration-200' : ''
  return `${cardBase} ${cardSizes[size]} ${hover}`.trim()
}

/**
 * Input tokens
 */
export const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

export const inputStates = 'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
export const inputBase = 'flex w-full rounded-md border border-input bg-background text-foreground transition-colors'

export function input(size: keyof typeof inputSizes = 'md'): string {
  return `${inputBase} ${inputSizes[size]} ${inputStates}`
}

/**
 * Status badge colors
 */
export const statusBadgeColors = {
  success: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium bg-success text-success-foreground',
  warning: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium bg-warning text-warning-foreground',
  destructive: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium bg-destructive text-destructive-foreground',
  info: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium bg-info text-info-foreground',
  default: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium bg-muted text-muted-foreground',
} as const

/**
 * Alert tokens
 */
export const alertVariants = {
  info: 'bg-info/10 text-info border-info/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
} as const

export const alertBase = 'p-4 rounded-lg border flex items-start gap-3'

/**
 * Text styles
 */
export const textStyles = {
  'page-heading': 'text-4xl font-bold text-foreground',
  'section-heading': 'text-3xl font-semibold text-foreground',
  'card-title': 'text-xl font-semibold text-foreground',
  'subtitle': 'text-2xl font-medium text-foreground',
  'body': 'text-base text-foreground',
  'body-secondary': 'text-sm text-muted-foreground',
  'caption': 'text-xs text-muted-foreground',
} as const

/**
 * Spacing utilities
 */
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px - PADRÃO
  lg: '1.5rem',   // 24px - Cards
  xl: '2rem',     // 32px
} as const
