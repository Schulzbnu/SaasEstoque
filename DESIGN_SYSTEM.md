# 🎨 Design System - Quick Reference

> **Guia Rápido** para consulta do Design System. Para documentação completa, veja [docs/03-development/design-system.md](./docs/03-development/design-system.md)

---

## 🎨 Cores Principais

### Primárias
- **Primary (Azul)**: `#2563EB` → `bg-primary text-primary-foreground`
- **Background**: `#FFFFFF` → `bg-background text-foreground`
- **Foreground**: `#0F172A` → `text-foreground`
- **Muted**: `#F3F4F6` → `bg-muted text-muted-foreground`

### Semânticas
- **Success**: `bg-success text-success-foreground` (#10B981)
- **Warning**: `bg-warning text-warning-foreground` (#F59E0B)
- **Error**: `bg-destructive text-destructive-foreground` (#EF4444)
- **Info**: `bg-info text-info-foreground` (#0EA5E9)

---

## ✏️ Tipografia

```tsx
// Tamanhos
text-xs   // 12px - Captions
text-sm   // 14px - Texto secundário
text-base // 16px - Padrão
text-lg   // 18px - Destaque
text-xl   // 20px - Subtítulo pequeno
text-2xl  // 24px - Subtítulo
text-3xl  // 30px - Título de card
text-4xl  // 36px - Título de seção
text-5xl  // 48px - Page heading

// Pesos
font-normal   // 400
font-medium   // 500
font-semibold // 600
font-bold     // 700
```

---

## 📐 Espaçamento

```tsx
// Padding
p-2  // 8px
p-4  // 16px - PADRÃO
p-6  // 24px - Cards
p-8  // 32px

// Margin
my-4  // 16px
my-6  // 24px
my-8  // 32px

// Grid gap
gap-4 // 16px
gap-6 // 24px
gap-8 // 32px
```

---

## 🔲 Border Radius

```tsx
rounded-sm    // 2px - Badges
rounded-md    // 6px - Buttons
rounded-lg    // 8px - Cards (PADRÃO)
rounded-xl    // 12px - Modals
rounded-full  // Pill buttons, avatar
```

---

## 🌑 Sombras

```tsx
shadow-sm   // Subtle
shadow-md   // Cards (PADRÃO)
shadow-lg   // Hover states
shadow-xl   // Dropdowns
shadow-2xl  // Modals
```

---

## 🎯 Componentes Prontos

### Botão
```tsx
import { button } from '@/lib/design-tokens'

<button className={button('md', 'primary')}>
  <Plus className="w-5 h-5 mr-2" />
  Novo Produto
</button>

// Tamanhos: 'sm' | 'md' | 'lg'
// Variantes: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
```

### Card
```tsx
import { card } from '@/lib/design-tokens'

<div className={card('md')}>
  <h3 className="text-lg font-semibold">Título</h3>
  <p className="text-sm text-muted-foreground">Conteúdo</p>
</div>
```

### Input
```tsx
import { input } from '@/lib/design-tokens'

<input
  type="text"
  placeholder="Digite aqui..."
  className={input()}
/>
```

### Status Badge
```tsx
<span className={statusBadgeColors.success}>
  <span className="w-1.5 h-1.5 rounded-full bg-current" />
  Ativo
</span>
```

### Metric Card (Dashboard)
```tsx
<div className={card('md', true)}>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-muted-foreground">Total</p>
      <p className="text-3xl font-bold mt-2">1,234</p>
      <p className="text-sm text-success mt-1">+12.5%</p>
    </div>
    <div className="p-3 bg-primary/10 rounded-lg">
      <Icon className="w-6 h-6 text-primary" />
    </div>
  </div>
</div>
```

---

## 🔧 Padrões Comuns

### Page Header
```tsx
<div className="mb-8">
  <h1 className="text-4xl font-bold text-foreground">Título da Página</h1>
  <p className="text-lg text-muted-foreground mt-2">
    Descrição ou subtítulo
  </p>
</div>
```

### Breadcrumb
```tsx
<nav className="flex items-center gap-2 text-sm">
  <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
  <ChevronRight className="w-4 h-4 text-muted-foreground" />
  <span className="text-foreground">Página Atual</span>
</nav>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
    <Inbox className="w-8 h-8 text-muted-foreground" />
  </div>
  <h3 className="text-xl font-semibold mt-4">Título</h3>
  <p className="text-muted-foreground mt-2 max-w-md">Descrição</p>
  <button className={button('md', 'primary')}>
    Ação Principal
  </button>
</div>
```

---

## ♿ Acessibilidade

### Focus States (OBRIGATÓRIO)
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
```

### ARIA Labels
```tsx
<button aria-label="Fechar modal">
  <X className="w-4 h-4" />
</button>
```

---

## 📱 Responsividade

```tsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Stack em mobile, row em desktop
<div className="flex flex-col md:flex-row gap-4">

// Sidebar responsiva
<aside className="hidden md:block w-64">
```

---

## 🎭 Transições

```tsx
// Hover effects
hover:bg-muted hover:shadow-lg
transition-colors duration-150

// Scale
hover:scale-105 transition-transform

// Combined
hover:shadow-lg hover:-translate-y-1 transition-all duration-200
```

---

## 📋 Documentação Completa

- **Design System Completo**: [docs/03-development/design-system.md](./docs/03-development/design-system.md)
- **Referência Visual**: `/design-system` (roda `npm run dev` primeiro)
- **Design Tokens**: `src/lib/design-tokens.ts`
- **Componente Showcase**: `src/components/examples/DesignSystemShowcase.tsx`

---

## ⚠️ O que NÃO Fazer

❌ **NUNCA use cores hardcoded**
```tsx
// ERRADO
<div style={{ backgroundColor: '#2563EB' }}>
<div className="bg-blue-600">

// CORRETO
<div className="bg-primary">
```

❌ **NUNCA use tamanhos hardcoded**
```tsx
// ERRADO
<div style={{ padding: '24px', fontSize: '18px' }}>
<div className="p-[24px] text-[18px]">

// CORRETO
<div className="p-6 text-lg">
```

❌ **NUNCA pule estados**
```tsx
// ERRADO
<button className="bg-primary">Salvar</button>

// CORRETO
<button className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary disabled:opacity-50">
  Salvar
</button>
```

---

**Última atualização**: 2026-03-23
**Baseado em**: [DashStack Admin Dashboard UI Kit](https://www.figma.com/design/dFDg9xUjAqkxJq2VokcEIq/DashStack---Free-Admin-Dashboard-UI-Kit---Admin---Dashboard-Ui-Kit---Admin-Dashboard--Community-?node-id=0-11556&p=f&t=vJZ8YjlsjvHXLSF2-0)
