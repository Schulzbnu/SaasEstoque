---
name: component-architecture
description: Design scalable, reusable frontend component architecture with React/Next.js Server Components
triggers:
  - "component design"
  - "component architecture"
  - "UI components"
  - "design system"
parameters:
  framework:
    type: string
    description: "Frontend framework"
    allowed: ["Next.js", "React"]
    default: "Next.js"
  styling:
    type: string
    description: "Styling approach"
    allowed: ["Tailwind", "CSS Modules", "Styled Components", "Emotion", "SCSS"]
    default: "Tailwind"
  components:
    type: array
    description: "Components to design"
    required: true
---

# Frontend Component Architecture for Next.js

You are designing a component architecture for Next.js with {{styling}} styling.

## Tech Stack
- **Framework**: {{framework}} (App Router)
- **Language**: TypeScript
- **Styling**: {{styling}} + Project Design System
- **Design Tokens**: `@/lib/design-tokens` (REQUIRED for this project)
- **Components**: React Server Components + Client Components
- **Validation**: Zod schemas
- **Supabase**: Data fetching and auth

## ⚠️ Design System Compliance (REQUIRED)

This project has a **mandatory Design System** that must be followed:

1. **NEVER hardcode colors** - Use semantic classes (`bg-primary`, `text-success`, etc.)
2. **NEVER hardcode sizes** - Use Tailwind spacing scale (`p-4`, `text-lg`, `gap-6`, etc.)
3. **ALWAYS use design tokens** - Import from `@/lib/design-tokens`
4. **Accessibility is MANDATORY** - Focus states, ARIA labels, semantic HTML
5. **See `DESIGN_SYSTEM.md`** - Complete reference with examples

### Design Tokens
```typescript
import { button, card, input, statusBadgeColors } from '@/lib/design-tokens'

// Use these helpers instead of hardcoded values
<button className={button('md', 'primary')}>Save</button>
<div className={card('md')}>Content</div>
<input className={input()} />
```

### Semantic Colors (NEVER hardcode)
```tsx
// ✅ CORRECT
<div className="bg-primary text-primary-foreground">
<div className="bg-success text-success-foreground">

// ❌ WRONG
<div className="bg-blue-600">
<div style={{ backgroundColor: '#2563EB' }}>
```

## Components to Design
{% for component in components %}
- {{component}}
{% endfor %}

## Component Design Principles for Next.js

### 1. Server vs Client Components

**Server Components** (default):
- Fetch data directly in the component
- No useState, useEffect, or browser APIs
- Better performance (no client JS)
- Use for: data fetching, static content, layout

**Client Components** ("use client"):
- Required for: useState, useEffect, event handlers
- Use for: interactivity, forms, real-time updates
- Minimize usage for better performance

### 2. Component Composition

```typescript
// Server Component (default)
import { Button } from '@/components/ui/button'
import { UserCard } from '@/components/features/user-card'

export default async function UsersPage() {
  const supabase = createServerClient()
  const { data: users } = await supabase.from('users').select('*')

  return (
    <div className="container">
      <h1>Users</h1>
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

```typescript
// Client Component (interactive)
'use client'

import { useState } from 'react'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="card">
      <h3>{user.full_name}</h3>
      <Button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </Button>
      {isExpanded && <p>{user.email}</p>}
    </div>
  )
}
```

### 3. Component Structure

```
components/
  ui/                      # Base components (shadcn/ui)
    button.tsx
    input.tsx
    card.tsx
    dialog.tsx
    dropdown-menu.tsx

  features/                # Feature-specific components
    auth/
      login-form.tsx       # Client Component with form
    dashboard/
      stats-card.tsx       # Server Component
      user-list.tsx        # Server Component

  layouts/                 # Layout components
    dashboard-layout.tsx   # Server Component
    auth-layout.tsx        # Server Component
```

## Component Categories

### Atomic Design Pattern (adapted for Next.js)

```
ui/              # Base components (Server by default, Client when needed)
  - Button.tsx (Client)
  - Input.tsx (Client)
  - Card.tsx (Server)

features/        # Feature components
  - UserList.tsx (Server - fetches data)
  - LoginForm.tsx (Client - form handling)
  - UserProfile.tsx (Server/Client - depends on interactivity)

layouts/         # Page layouts (Server Components)
  - DashboardLayout.tsx
  - AuthLayout.tsx
```

## Best Practices

### Server Components

```typescript
// ✅ Good: Data fetching in Server Component
export default async function UsersPage() {
  const supabase = createServerClient()
  const { data: users } = await supabase
    .from('users')
    .select('*')

  return <UserList users={users} />
}

// ✅ Good: Server Component with async operations
export default async function DashboardPage() {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
  ])

  return (
    <div>
      <UserStats users={users} />
      <RecentPosts posts={posts} />
    </div>
  )
}
```

### Client Components

```typescript
// ✅ Good: Client Component for interactivity
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(c => c + 1)}>Increment</Button>
    </div>
  )
}

// ✅ Good: Client Component for forms
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // Server Action or API call
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### Performance Optimization

```typescript
// ✅ Use Suspense for loading states
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <UserStats />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <RecentPosts />
      </Suspense>
    </div>
  )
}

// ✅ Use dynamic imports for heavy client components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(
  () => import('@/components/features/heavy-chart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
```

### Accessibility

```typescript
// ✅ Use semantic HTML
export function UserCard({ user }: { user: User }) {
  return (
    <article className="card">
      <header>
        <h2>{user.full_name}</h2>
      </header>
      <p>{user.email}</p>
      <nav aria-label="User actions">
        <Button aria-label={`Edit ${user.full_name}`}>Edit</Button>
      </nav>
    </article>
  )
}

// ✅ Implement proper ARIA labels
'use client'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </Button>
      {isOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation">
          {/* Menu items */}
        </nav>
      )}
    </>
  )
}
```

### Error Handling

```typescript
// ✅ Error boundaries (app/error.tsx)
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

// ✅ Error boundaries for specific sections
'use client'

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
```

## Component Template

### Server Component Template

```typescript
import { createServerClient } from '@/lib/supabase/server'
import { UserCard } from '@/components/features/user-card'
import { Button } from '@/components/ui/button'

interface UsersPageProps {
  searchParams: { page?: string }
}

export default async function UsersPage({
  searchParams,
}: UsersPageProps) {
  const page = parseInt(searchParams.page || '1')
  const supabase = createServerClient()

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .range((page - 1) * 10, page * 10 - 1)

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button href="/users/new">Add User</Button>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
```

### Client Component Template

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
```

## Design System Best Practices

### Use Design Tokens (REQUIRED for this project)
```typescript
// ✅ CORRECT - Use design tokens from @/lib/design-tokens
import { button, card, input, statusBadgeColors } from '@/lib/design-tokens'

export function MyButton() {
  return <button className={button('md', 'primary')}>Click me</button>
}

export function MyCard() {
  return <div className={card('md')}>Content</div>
}

export function MyInput() {
  return <input className={input()} />
}
```

### NEVER Hardcode Values
```typescript
// ❌ WRONG - Hardcoded colors
<button className="bg-blue-500 text-white hover:bg-blue-600">

// ✅ CORRECT - Semantic colors from design system
<button className="bg-primary text-primary-foreground hover:bg-primary/90">

// ❌ WRONG - Hardcoded sizes
<div className="p-[24px] text-[18px]">

// ✅ CORRECT - Tailwind spacing scale
<div className="p-6 text-lg">
```

### Accessibility is MANDATORY
```typescript
// ❌ WRONG - No focus state
<button className="bg-primary">Click</button>

// ✅ CORRECT - Proper focus ring
<button className="bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Click
</button>

// ❌ WRONG - No ARIA label
<button><X className="w-4 h-4" /></button>

// ✅ CORRECT - Proper ARIA label
<button aria-label="Close"><X className="w-4 h-4" /></button>
```

## Output Requirements

For each component, provide:
1. **Component Code** - Full implementation with TypeScript
2. **Server vs Client** - Specify if it's a Server or Client Component
3. **Props Interface** - Complete type definitions
4. **Styling** - Complete styling with Tailwind CSS
5. **Accessibility** - ARIA attributes and keyboard support
6. **Loading States** - Suspense boundaries and skeletons
7. **Error Handling** - Error boundaries where appropriate

Now design the component architecture with complete implementations following these Next.js and React best practices.
