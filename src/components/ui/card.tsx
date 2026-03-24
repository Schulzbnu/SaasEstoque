/**
 * Card Component
 *
 * Card container component following the Design System
 */

import { card, type cardSizes } from '@/lib/design-tokens'
import { type HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof cardSizes
  withHover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ size = 'md', withHover = false, className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${card(size, withHover)} ${className}`} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
