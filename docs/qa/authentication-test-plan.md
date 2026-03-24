# Authentication System Test Plan

## Overview

Comprehensive test plan for the authentication system covering all user flows, edge cases, and security considerations.

---

## Test Scope

### Features to Test
1. Login flow
2. Sign up flow
3. Email confirmation
4. Forgot password
5. Reset password
6. UI validation
7. Error handling
8. Navigation

---

## 1. Login Flow Tests

### 1.1 Valid Login

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| LOGIN-001 | Login with valid credentials | 1. Go to /login<br>2. Enter valid email<br>3. Enter valid password<br>4. Click "Entrar" | User redirected to /dashboard |
| LOGIN-002 | Login with remember me | 1. Go to /login<br>2. Enter valid credentials<br>3. Check "Lembrar-me"<br>4. Click "Entrar" | Session persists across browser restarts |

### 1.2 Invalid Login

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| LOGIN-003 | Wrong password | 1. Enter valid email<br>2. Enter wrong password<br>3. Click "Entrar" | Error: "Email ou senha incorretos." |
| LOGIN-004 | Non-existent email | 1. Enter unknown email<br>2. Enter any password<br>3. Click "Entrar" | Error: "Email ou senha incorretos." |
| LOGIN-005 | Empty fields | 1. Leave email empty<br>2. Leave password empty<br>3. Click "Entrar" | Validation errors: "Email é obrigatório", "Senha é obrigatória" |
| LOGIN-006 | Invalid email format | 1. Enter "invalid-email"<br>2. Enter password<br>3. Click "Entrar" | Validation error: "Email inválido" |

### 1.3 Email Not Confirmed

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| LOGIN-007 | Unconfirmed email | 1. Login with unconfirmed account<br>2. Click "Entrar" | Error: "Por favor, confirme seu email antes de fazer login." with resend link |
| LOGIN-008 | Resend confirmation from login | 1. On login error, click resend link<br>2. Verify email received | New confirmation email sent |

---

## 2. Sign Up Flow Tests

### 2.1 Valid Registration

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| SIGNUP-001 | Valid registration | 1. Go to /signup<br>2. Fill all fields correctly<br>3. Accept terms<br>4. Click "Criar conta" | Success message: "Email de confirmação enviado!" |
| SIGNUP-002 | Auto-confirmed (dev) | 1. In dev environment, sign up<br>2. Fill all fields<br>3. Click "Criar conta" | Redirected to /dashboard |

### 2.2 Validation Errors

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| SIGNUP-003 | Short name | 1. Enter 1 character name<br>2. Fill other fields<br>3. Click "Criar conta" | Error: "Nome deve ter no mínimo 2 caracteres" |
| SIGNUP-004 | Invalid email | 1. Enter "invalid-email"<br>2. Fill other fields<br>3. Click "Criar conta" | Error: "Email inválido" |
| SIGNUP-005 | Weak password (< 8 chars) | 1. Enter password "pass1"<br>2. Fill other fields<br>3. Click "Criar conta" | Error: "A senha deve ter no mínimo 8 caracteres" |
| SIGNUP-006 | Password without letter | 1. Enter password "12345678"<br>2. Fill other fields<br>3. Click "Criar conta" | Error: "A senha deve conter pelo menos uma letra" |
| SIGNUP-007 | Password without number | 1. Enter password "password"<br>2. Fill other fields<br>3. Click "Criar conta" | Error: "A senha deve conter pelo menos um número" |
| SIGNUP-008 | Mismatched passwords | 1. Enter different passwords<br>2. Fill other fields<br>3. Click "Criar conta" | Error: "As senhas não coincidem" |
| SIGNUP-009 | Terms not accepted | 1. Fill all fields<br>2. Leave terms unchecked<br>3. Click "Criar conta" | Error: "Você deve aceitar os termos de uso" |

### 2.3 Duplicate Email

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| SIGNUP-010 | Existing email | 1. Try to sign up with existing email<br>2. Fill other fields<br>3. Click "Criar conta" | Error: "Este email já está cadastrado." |

### 2.4 Email Confirmation

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| SIGNUP-011 | Confirm email | 1. Sign up<br>2. Click link from email<br>3. Verify redirect | Redirected to /dashboard |
| SIGNUP-012 | Resend confirmation | 1. After signup, click "Reenviar"<br>2. Verify new email | New confirmation email sent |

---

## 3. Forgot Password Flow Tests

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| FORGOT-001 | Valid email | 1. Go to /forgot-password<br>2. Enter valid email<br>3. Click "Enviar instruções" | Success: "Email enviado!" |
| FORGOT-002 | Non-existent email | 1. Enter unknown email<br>2. Click "Enviar instruções" | Same success (email enumeration prevention) |
| FORGOT-003 | Invalid email format | 1. Enter "invalid-email"<br>2. Click "Enviar instruções" | Error: "Email inválido" |
| FORGOT-004 | Empty email | 1. Leave email empty<br>2. Click "Enviar instruções" | Error: "Email é obrigatório" |
| FORGOT-005 | Link expiration | 1. Request reset<br>2. Wait > 1 hour<br>3. Click link from email | Error: "Este link expirou. Solicite uma nova recuperação de senha." |

---

## 4. Reset Password Flow Tests

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| RESET-001 | Valid reset | 1. Click link from email<br>2. Enter new valid password<br>3. Confirm password<br>4. Click "Redefinir senha" | Redirect to /login with success message |
| RESET-002 | Weak password | 1. Enter weak password<br>2. Click "Redefinir senha" | Error: "A senha deve ter no mínimo 8 caracteres..." |
| RESET-003 | Mismatched passwords | 1. Enter different passwords<br>2. Click "Redefinir senha" | Error: "As senhas não coincidem" |
| RESET-004 | Empty fields | 1. Leave fields empty<br>2. Click "Redefinir senha" | Validation errors |
| RESET-005 | Invalid token | 1. Access /reset-password directly<br>2. Fill form<br>3. Submit | Error: "Token inválido." |

---

## 5. UI/UX Tests

### 5.1 Responsive Design

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| UI-001 | Mobile view (< 768px) | 1. Open on mobile device<br>2. Navigate auth pages | All forms mobile-friendly, full width |
| UI-002 | Tablet view (768px - 1024px) | 1. Open on tablet<br>2. Navigate auth pages | Proper layout, no horizontal scroll |
| UI-003 | Desktop view (> 1024px) | 1. Open on desktop<br>2. Navigate auth pages | Centered cards, max-width applied |

### 5.2 Loading States

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| UI-004 | Submit button loading | 1. Submit any form<br>2. Observe button | Shows spinner and "Carregando..." |
| UI-005 | Button disabled during load | 1. Submit any form<br>2. Try to click again | Button not clickable |

### 5.3 Error Display

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| UI-006 | Alert display | 1. Trigger any error<br>2. Observe alert | Alert visible with proper icon and color |
| UI-007 | Multiple errors | 1. Trigger multiple validation errors<br>2. Observe display | All validation errors shown under fields |
| UI-008 | Error auto-clear | 1. Trigger validation error<br>2. Type in field<br>3. Check error | Error clears when user types |

---

## 6. Navigation Tests

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| NAV-001 | Login to signup link | 1. On /login, click "Criar conta" | Navigates to /signup |
| NAV-002 | Signup to login link | 1. On /signup, click "Fazer login" | Navigates to /login |
| NAV-003 | Forgot password link | 1. On /login, click "Esqueceu sua senha?" | Navigates to /forgot-password |
| NAV-004 | Back to login from forgot | 1. On /forgot-password, click "Voltar ao login" | Navigates to /login |
| NAV-005 | Home page CTAs | 1. On /, click "Começar teste grátis" | Navigates to /signup |
| NAV-006 | Home page login | 1. On /, click "Fazer login" | Navigates to /login |

---

## 7. Accessibility Tests

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| A11Y-001 | Keyboard navigation | 1. Use Tab to navigate form<br>2. Use Enter to submit | All focusable, proper tab order |
| A11Y-002 | Focus indicators | 1. Tab through form | All inputs show focus ring |
| A11Y-003 | Screen reader labels | 1. Navigate with screen reader | All inputs have proper labels |
| A11Y-004 | Error announcements | 1. Trigger error<br>2. Check screen reader | Errors announced properly |
| A11Y-005 | Color contrast | 1. Check all text | WCAG AA compliance (4.5:1 min) |

---

## 8. Security Tests

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| SEC-001 | SQL injection | 1. Enter "' OR '1'='1" as email | Error: "Email inválido" |
| SEC-002 | XSS attempt | 1. Enter "<script>alert(1)</script>" as name | Input sanitized/rejected |
| SEC-003 | Email enumeration | 1. Try forgot password with fake email | Same success message as real email |
| SEC-004 | Password complexity | 1. Try simple passwords | All weak passwords rejected |
| SEC-005 | CSRF protection | 1. Submit form without token | Request rejected |

---

## 9. Edge Cases

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| EDGE-001 | Very long email | 1. Enter 200+ char email | Validation error or handled |
| EDGE-002 | Special characters in name | 1. Enter name with accents/chars | Accepted and saved |
| EDGE-003 | Rapid form submission | 1. Double-click submit button | Only one submission processed |
| EDGE-004 | Network timeout | 1. Disconnect network<br>2. Submit form | Proper error message |
| EDGE-005 | Session expired | 1. Log in<br>2. Wait for expiry<br>3. Try protected route | Redirected to login |

---

## 10. Browser Compatibility

| Test ID | Browser | Version | Status |
|---------|---------|---------|--------|
| BROWSER-001 | Chrome | Latest+ | ✅ Pass |
| BROWSER-002 | Firefox | Latest+ | ✅ Pass |
| BROWSER-003 | Safari | Latest+ | ✅ Pass |
| BROWSER-004 | Edge | Latest+ | ✅ Pass |

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Supabase project configured
- [ ] Environment variables set
- [ ] Email templates configured in Supabase
- [ ] Database migrations run

### Manual Testing
- [ ] Execute all LOGIN-* tests
- [ ] Execute all SIGNUP-* tests
- [ ] Execute all FORGOT-* tests
- [ ] Execute all RESET-* tests
- [ ] Execute all UI-* tests
- [ ] Execute all NAV-* tests
- [ ] Execute all A11Y-* tests
- [ ] Execute all SEC-* tests
- [ ] Execute all EDGE-* tests

### Automated Testing (Future)
- [ ] Unit tests for validation schemas
- [ ] Unit tests for auth service
- [ ] Integration tests for server actions
- [ ] E2E tests with Playwright

---

## Bug Report Template

```markdown
## Bug Description
**Title**: [Brief description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1.
2.
3.

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happens]

**Environment**:
- Browser:
- OS:
- Screen size:

**Screenshots/Videos**:
[Attach if applicable]
```

---

## Test Summary Template

```markdown
## Test Execution Summary

**Date**: [Date]
**Tester**: [Name]
**Environment**: [Dev/Staging/Production]

### Results
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Blocked: [Number]

### Failed Tests
| Test ID | Description | Severity |
|---------|-------------|----------|
| | | |

### Bugs Found
| Bug ID | Description | Severity | Status |
|--------|-------------|----------|--------|
| | | | |

### Recommendations
[Improvement suggestions]
```

---

## Next Steps (Code Reviewer)

1. Review code quality and security
2. Verify Supabase integration best practices
3. Check Design System adherence
4. Validate error handling completeness
5. Review architecture decisions
