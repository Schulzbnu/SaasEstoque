# Frontend Authentication UI Implementation

## Overview

Complete frontend authentication UI following the Design System with proper validation, error handling, and loading states.

---

## Architecture

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx (home)
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── forms/
│       ├── login-form.tsx
│       ├── signup-form.tsx
│       ├── forgot-password-form.tsx
│       └── reset-password-form.tsx
└── lib/
    └── design-tokens.ts
```

---

## Design System Tokens

All UI components use centralized design tokens from `src/lib/design-tokens.ts`:

### Buttons
- **Sizes**: `sm`, `md`, `lg`
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`
- **States**: `hover`, `focus` (ring-2 ring-primary), `disabled` (opacity-50)
- **Loading**: Spinner with "Carregando..." text

### Cards
- **Sizes**: `sm` (p-4), `md` (p-6), `lg` (p-8)
- **Style**: `bg-card rounded-lg shadow-md border`
- **Optional hover**: `hover:shadow-lg transition-shadow`

### Inputs
- **Sizes**: `sm`, `md`, `lg`
- **States**: `placeholder`, `focus` (ring-2 ring-primary), `error` (border-destructive)
- **Labels**: Block, text-sm font-medium
- **Error messages**: text-sm text-destructive

### Alerts
- **Variants**: `info`, `success`, `warning`, `destructive`
- **Style**: `p-4 rounded-lg border flex items-start gap-3`
- **Icons**: SVG icons for each variant

---

## Pages

### 1. Login (`/login`)

**Features:**
- Email and password inputs with validation
- "Remember me" checkbox
- "Forgot password?" link
- Link to sign up page
- Success message from password reset redirect
- Error alerts with special handling for unconfirmed email

**Validation:**
- Email: Valid format required
- Password: Required

**Error Handling:**
- Invalid credentials
- Email not confirmed (with resend link)

---

### 2. Sign Up (`/signup`)

**Features:**
- Full name, email, password, confirm password inputs
- Terms acceptance checkbox
- Link to login page
- Success state with resend confirmation option
- Pre-fills email from query param (for redirect from login)

**Validation:**
- Full name: min 2 characters
- Email: Valid format
- Password: min 8 chars, 1 letter, 1 number
- Confirm password: Must match
- Terms: Must be accepted

**Flow:**
1. User fills form and submits
2. Server creates user account
3. If email confirmation required: Show success message
4. If auto-confirmed (dev): Redirect to dashboard
5. User can resend confirmation email

---

### 3. Forgot Password (`/forgot-password`)

**Features:**
- Email input only
- Success state with confirmation
- "Send to another email" option
- Link back to login

**Validation:**
- Email: Valid format

**Security:**
- Always returns success (prevents email enumeration)

---

### 4. Reset Password (`/reset-password`)

**Features:**
- Accessed from email link
- New password and confirm inputs
- Info alert with password requirements
- Redirects to login on success

**Validation:**
- Password: min 8 chars, 1 letter, 1 number
- Confirm password: Must match

---

### 5. Auth Callback (`/auth/callback`)

**Features:**
- Handles email confirmation redirects
- Handles OAuth callbacks
- Exchange code for session
- Redirects to dashboard

---

### 6. Home (`/`)

**Features:**
- Landing page with CTA
- Feature cards (multi-tenancy, reports, alerts)
- Links to login and signup

---

### 7. Dashboard (`/dashboard`)

**Features:**
- Protected page (will add middleware later)
- Placeholder metrics
- Empty state for products
- Page header

---

## Components

### Alert Component

```tsx
<Alert variant="success" className="mb-6">
  Success message here
</Alert>
```

Variants: `info`, `success`, `warning`, `destructive`

### Button Component

```tsx
<Button variant="primary" size="md" isLoading={loading}>
  Submit
</Button>
```

Variants: `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`
Sizes: `sm`, `md`, `lg`

### Input Component

```tsx
<Input
  label="Email"
  type="email"
  name="email"
  placeholder="seu@email.com"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
/>
```

### Card Component

```tsx
<Card size="lg">
  Content here
</Card>
```

Sizes: `sm`, `md`, `lg`

---

## Styling

### Colors (Semantic)
- `bg-primary` (#2563EB) - Primary actions
- `bg-success` (#10B981) - Success states
- `bg-warning` (#F59E0B) - Warnings
- `bg-destructive` (#EF4444) - Errors
- `bg-info` (#0EA5E9) - Info
- `bg-muted` (#F3F4F6) - Backgrounds
- `bg-background` (#FFFFFF) - Cards
- `text-foreground` (#0F172A) - Primary text
- `text-muted-foreground` - Secondary text

### Typography
- `text-4xl font-bold` - Page heading
- `text-xl` - Card titles
- `text-base` - Body text
- `text-sm` - Secondary text, labels
- `text-xs` - Captions

### Spacing
- `p-6` - Card padding (md)
- `space-y-6` - Form field spacing
- `gap-6` - Grid gaps
- `mb-8` - Section spacing

---

## Responsive Design

All forms use:
- `w-full max-w-md` - Mobile full width, desktop centered
- `flex flex-col md:flex-row` - Stack on mobile, row on desktop
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` - Responsive grid

---

## Accessibility

### Focus States
All interactive elements have:
- `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`

### ARIA Labels
- Icons have semantic meaning from context
- Error messages are associated with inputs
- Loading states communicate purpose

### HTML Semantics
- `<form>` for forms
- `<label>` for inputs
- Proper heading hierarchy (h1, h2, etc.)
- `<button>` for actions

---

## Form Patterns

All forms follow this pattern:

1. **State Management**
   ```tsx
   const [formData, setFormData] = useState<Schema>(initialValues)
   const [errors, setErrors] = useState<Partial<Record<keyof Schema, string>>>({})
   const [isLoading, setIsLoading] = useState(false)
   const [submitError, setSubmitError] = useState<string | null>(null)
   ```

2. **Change Handler**
   ```tsx
   const handleChange = (e) => {
     setFormData(prev => ({ ...prev, [name]: value }))
     setErrors(prev => ({ ...prev, [name]: undefined }))
   }
   ```

3. **Validation**
   ```tsx
   const validateForm = () => {
     const result = schema.safeParse(formData)
     if (!result.success) {
       // Set errors
       return false
     }
     return true
   }
   ```

4. **Submit Handler**
   ```tsx
   const handleSubmit = async (e) => {
     e.preventDefault()
     if (!validateForm()) return
     setIsLoading(true)
     // Call action
     setIsLoading(false)
   }
   ```

---

## Next Steps (QA Engineer)

1. Test all authentication flows
2. Verify validation rules
3. Test error handling
4. Check responsive layouts
5. Verify accessibility
6. Test navigation between pages
7. Verify email confirmation flow
8. Test password reset flow
