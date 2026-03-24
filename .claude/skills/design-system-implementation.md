# Design System Implementation Skill

Skill especializada em implementação de componentes seguindo o Design System do projeto.

## Capacidades

- Implementação de componentes UI seguindo DESIGN_SYSTEM.md
- Uso correto de design tokens (cores, tipografia, espaçamento)
- Componentes responsivos e acessíveis
- Padronização de estados (hover, focus, disabled)
- Implementação de variantes e tamanhos

## Design Tokens (OBRIGATÓRIO)

```typescript
import { button, card, input, statusBadgeColors } from '@/lib/design-tokens'

// Botão
<button className={button('md', 'primary')}>Salvar</button>

// Card
<div className={card('md')}>Conteúdo</div>

// Input
<input className={input()} />

// Status Badge
<span className={statusBadgeColors.success}>Ativo</span>
```

## Regras Obrigatórias

1. **NUNCA use valores hardcoded**
   - Cores: Use classes semânticas (`bg-primary`, `text-success`)
   - Tamanhos: Use escala do Tailwind (`p-4`, `text-lg`, `gap-6`)
   - Design Tokens: Use `@/lib/design-tokens`

2. **Acessibilidade é OBRIGATÓRIA**
   - Elementos interativos precisam de focus states
   - Botões apenas com ícones precisam de ARIA labels
   - Use HTML semântico

3. **Responsividade por Padrão**
   - Mobile-first approach
   - Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

## Stack

- React 18+
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Design Tokens

## Quando Usar

- Criar novos componentes UI
- Implementar páginas seguindo o Design System
- Garantir consistência visual
- Implementar acessibilidade

## Exemplo de Uso

/skill design-system-implementation --components metric-card,status-badge,empty-state --accessible true
