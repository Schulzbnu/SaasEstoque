# Agentes

Configuração e documentação dos agentes do projeto.

## Stack Tecnológica

Este projeto utiliza as seguintes tecnologias:

- **Runtime**: Node.js
- **Framework**: Next.js (App Router)
- **Banco de Dados**: PostgreSQL via Supabase
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **ORM/Client**: Supabase Client + Prisma ORM (opcional)
- **Linguagem**: TypeScript

## Sistema Multi-Agent para Desenvolvimento SaaS

Este projeto utiliza um sistema de 5 agentes especializados que trabalham em paralelo para desenvolvimento eficiente de aplicações SaaS. Cada agente tem responsabilidades específicas e skills dedicadas.

## Agentes Especializados

### 1. Database Architect 🗄️

**Responsabilidades:**
- Design de esquemas PostgreSQL escaláveis e eficientes via Supabase
- Criação e otimização de migrations Supabase
- Estratégias de indexação para performance
- Modelagem de dados para SaaS (multi-tenancy, assinaturas, etc.)
- Otimização de queries e análise de gargalos de performance
- Configuração de Row Level Security (RLS) do Supabase
- Design de triggers e functions do PostgreSQL
- Configuração de Supabase Realtime para subscriptions

**Skills Disponíveis:**
- `database-schema-design` - Design de esquemas PostgreSQL/Supabase para aplicações SaaS multi-tenant
- `query-optimization` - Otimização de queries PostgreSQL e análise de performance
- `migration-planning` - Planejamento e execução de migrations Supabase

**Quando Chamar:**
- Criar ou modificar esquemas de banco de dados
- Escrever ou otimizar migrations Supabase
- Configurar Row Level Security (RLS)
- Troubleshooting de issues de performance
- Planejar estratégias de escalabilidade
- Design de modelos de dados para novos features

### 2. Backend Developer ⚙️

**Responsabilidades:**
- Design e implementação de APIs usando Next.js API Routes / Route Handlers
- Implementação de autenticação usando Supabase Auth
- Desenvolvimento de Server Actions do Next.js
- Integração com processadores de pagamento (Stripe, PayPal, etc.)
- Implementação de serviços de email e notificações (Supabase Edge Functions)
- Criação de Edge Functions e Server Components
- Manipulação de uploads de arquivos via Supabase Storage
- Implementação de rate limiting e segurança de APIs
- Escrita de testes unitários e de integração abrangentes
- Otimização de performance com Server Components e caching

**Skills Disponíveis:**
- `api-design` - Design de APIs RESTful usando Next.js Route Handlers
- `authentication-setup` - Configuração de autenticação com Supabase Auth
- `payment-integration` - Integração com processadores de pagamento
- `server-actions` - Implementação de Server Actions do Next.js

**Quando Chamar:**
- Criar ou modificar API Routes / Route Handlers
- Implementar Server Actions
- Configurar autenticação/autorização com Supabase
- Integrar serviços de terceiros
- Criar Edge Functions
- Implementar processamento de pagamentos
- Troubleshooting de issues de backend

### 3. Frontend Developer 🎨

**Responsabilidades:**
- Construção de componentes UI reutilizáveis usando React/Next.js
- Implementação de Server e Client Components do Next.js App Router
- Implementação de designs responsivos que funcionam em diversos dispositivos
- Setup e gerenciamento de state (React Context, Zustand, etc.)
- Integração com Supabase Client para data fetching
- Implementação de roteamento com Next.js App Router
- Criação e otimização de formulários com validação
- Implementação de fluxos de autenticação (login, signup, password reset)
- Otimização de performance (Server Components, Suspense, lazy loading)
- Garantia de acessibilidade (WCAG 2.1 AA mínimo)
- Implementação de SEO com Next.js Metadata API
- **OBRIGATÓRIO: Seguir o Design System do projeto (DESIGN_SYSTEM.md)**

**Skills Disponíveis:**
- `design-system-implementation` - Implementação de componentes seguindo o Design System
- `component-architecture` - Design de arquitetura de componentes React/Next.js
- `state-management` - Setup de gerenciamento de estado
- `responsive-layouts` - Implementação de layouts responsivos
- `accessibility` - Implementação de features de acessibilidade

**Quando Chamar:**
- Criar novos componentes UI ou páginas
- Implementar Server/Client Components
- Implementar layouts responsivos
- Configurar gerenciamento de estado
- Integrar com Supabase
- Otimizar performance
- Implementar features de acessibilidade
- Construir fluxos de UI de autenticação

### 4. Code Reviewer 🔍

**Responsabilidades:**
- Review de mudanças de código para correção e eficiência
- Identificação de vulnerabilidades de segurança (OWASP Top 10)
- Avaliação de maintainability e legibilidade de código
- Verificação de aderência a padrões de codificação e convenções
- Identificação de gargalos de performance potenciais
- Sugestão de oportunidades de refatoração
- Verificação de tratamento adequado de erros e edge cases
- Garantia de cobertura de testes adequada
- Verificação de documentação apropriada
- Identificação de code smells e anti-padrões

**Skills Disponíveis:**
- `code-review` - Review abrangente focado em segurança, performance e melhores práticas
- `security-audit` - Auditoria de segurança e detecção de vulnerabilidades
- `performance-review` - Análise de performance e otimizações
- `architecture-review` - Avaliação de decisões de arquitetura

**Quando Chamar:**
- Review de pull requests ou mudanças de código
- Auditorias de segurança
- Avaliação de qualidade de código antes de releases
- Avaliação de decisões de arquitetura
- Identificação de dívida técnica

### 5. QA Engineer 🧪

**Responsabilidades:**
- Criação de planos de teste abrangentes e estratégias
- Escrita de testes unitários, de integração e E2E
- Setup de frameworks de automação de testes
- Execução de testes manuais exploratórios
- Condução de testes de regressão
- Testes de fluxos de usuários e caminhos críticos
- Testes de performance e carga
- Testes de acessibilidade
- Testes cross-browser e cross-device
- Tracking e verificação de bugs

**Skills Disponíveis:**
- `test-planning` - Criação de planos de teste abrangentes
- `test-automation` - Setup de automação de testes
- `e2e-testing` - Implementação de testes end-to-end
- `integration-testing` - Testes de integração entre serviços

**Quando Chamar:**
- Criar planos de teste para novos features
- Escrever testes automatizados
- Configurar infraestrutura de testes
- Investigar e reproduzir bugs
- Conduzir QA antes de releases
- Analisar cobertura de testes

## Trabalho em Paralelo

Os agentes devem trabalhar em paralelo sempre que possível para maximizar a eficiência:

### Exemplo de Fluxo de Trabalho Paralelo

**Feature: User Dashboard**

1. **Planning em Paralelo:**
   - Database Architect: Design de esquema para dashboard data
   - Backend Developer: Design de endpoints da API
   - Frontend Developer: Arquitetura de componentes do dashboard
   - QA Engineer: Criação de plano de testes
   - Code Reviewer: Review da arquitetura proposta

2. **Implementação em Paralelo:**
   - Database Architect: Executa migrations
   - Backend Developer: Implementa endpoints (após migrations)
   - Frontend Developer: Cria componentes (com mocks da API)
   - QA Engineer: Escreve testes automatizados

3. **Integração e Review:**
   - Code Reviewer: Review de todas as mudanças
   - QA Engineer: Executa testes E2E completos
   - Todos os agentes: Participam de review final

### Comunicação Entre Agentes

- **Documentação**: Mantenha documentação atualizada para outros agentes
- **Contratos**: Defina contratos claros (API contracts, data models)
- **Reviews**: Agents devem revisar o trabalho uns dos outros
- **Feedback**: Fornecer feedback construtivo e educacional

## Convenções do Projeto

### Estrutura de Diretórios

```
.claude/
├── agents/           # Configurações dos agentes
│   ├── database-architect.md
│   ├── backend-developer.md
│   ├── frontend-developer.md
│   ├── code-reviewer.md
│   └── qa-engineer.md
└── skills/           # Skills disponíveis
    ├── design-system-implementation.md
    ├── database-schema-design.md
    ├── api-design.md
    ├── component-architecture.md
    ├── code-review.md
    └── test-planning.md
```

### Como Usar os Agentes

1. **Identifique a tarefa**: Determine qual tipo de trabalho precisa ser feito
2. **Selecione o agente apropriado**: Escolha o agente com as responsabilidades correspondentes
3. **Use a skill relevante**: Invoque a skill específica para a tarefa
4. **Trabalhe em paralelo**: Quando possível, envolva múltiplos agentes simultaneamente

### Exemplo de Comandos

```bash
# Design de esquema de banco
/agent database-architect "Design schema for user management system"

# Design de API
/skill api-design --type REST --resources users,posts,comments

# Componente seguindo Design System
/skill design-system-implementation --components metric-card,status-badge,empty-state

# Review de código
/skill code-review --focus security,performance --severity critical

# Plano de testes
/skill test-planning --feature "User Authentication" --testType unit,integration,e2e
```

## Melhores Práticas

1. **Use o agente certo para a tarefa certa**: Cada agente é especializado
2. **Trabalhe em paralelo quando possível**: Múltiplos agentes podem trabalhar simultaneamente
3. **Mantenha comunicação clara**: Documente decisões e contratos
4. **Review é essencial**: Sempre faça review do código antes de merge
5. **Testes são obrigatórios**: Todo código precisa de testes adequados
6. **Segurança em primeiro lugar**: Sempre considere implicações de segurança
7. **Documente suas decisões**: Mantenha a documentação atualizada
8. **SIGA O DESIGN SYSTEM**: Componentes UI devem seguir `DESIGN_SYSTEM.md` rigorosamente

## Data de Atualização

**Última atualização**: 2026-03-24

## Stack Tecnológica Detalhada

### Next.js (App Router)
- **App Router**: Sistema de roteamento baseado em filesystem
- **Server Components**: Componentes renderizados no servidor por padrão
- **Client Components**: Componentes interativos com `"use client"`
- **Server Actions**: Funções server-side chamadas do frontend
- **Route Handlers**: API endpoints em `app/api/**/route.ts`
- **Middleware**: Interceptação de requisições
- **Metadata API**: SEO e metadados

### Supabase
- **PostgreSQL**: Banco de dados relacional
- **Auth**: Autenticação OAuth, Magic Link, Email/Senha
- **Storage**: Upload e gerenciamento de arquivos
- **Realtime**: Subscriptions em tempo real
- **Row Level Security (RLS)**: Segurança a nível de linha
- **Edge Functions**: Funções serverless em Deno
- **Migrations**: Versionamento do schema via SQL

### TypeScript
- **Type Safety**: Tipagem estática em todo o código
- **Interfaces**: Definição de contratos de dados
- **Generics**: Código reutilizável type-safe
- **Strict Mode**: Configuração estrita do TypeScript

### Estrutura de Diretórios Recomendada

```
app/
├── (auth)/              # Grupo de rotas autenticadas
│   ├── dashboard/
│   ├── settings/
│   └── layout.tsx
├── (public)/            # Rotas públicas
│   ├── login/
│   └── signup/
├── api/                 # API Routes
│   ├── webhooks/
│   └── trpc/            # Se usar tRPC
├── layout.tsx           # Root layout
└── page.tsx             # Home page

components/
├── ui/                  # Componentes base (shadcn/ui)
├── forms/               # Componentes de formulários
├── layouts/             # Layouts reutilizáveis
└── features/            # Feature-specific components

lib/
├── design-tokens.ts     # Design System Tokens (OBRIGATÓRIO)
├── supabase/            # Client Supabase
│   ├── client.ts        # Client browser
│   ├── server.ts        # Client server
│   └── admin.ts         # Client admin
├── utils.ts             # Utilitários
└── validations.ts       # Schemas Zod

types/
└── index.ts             # Tipos globais

hooks/
└── *.ts                 # Custom hooks

supabase/
└── migrations/          # Migrations SQL
```

## Design System (OBRIGATÓRIO)

Este projeto possui um **Design System bem definido** que deve ser seguido rigorosamente em todos os componentes UI.

### Princípios Fundamentais

1. **NUNCA use valores hardcoded**
   - Cores: Use classes semânticas (`bg-primary`, `text-success`, etc.)
   - Tamanhos: Use escala do Tailwind (`p-4`, `text-lg`, `gap-6`, etc.)
   - Design Tokens: Use `@/lib/design-tokens`

2. **Acessibilidade é OBRIGATÓRIA**
   - Todos os elementos interativos precisam de focus states
   - Botões apenas com ícones precisam de ARIA labels
   - Use HTML semântico

3. **Padrões Consistentes**
   - Page Header, Breadcrumb, Empty State, Metric Card
   - Veja `DESIGN_SYSTEM.md` para referência completa

4. **Responsividade por Padrão**
   - Mobile-first approach
   - Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Design Tokens

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

### Cores Semânticas

- `bg-primary` / `text-primary-foreground` - Primária (#2563EB)
- `bg-background` / `text-foreground` - Background/Foreground
- `bg-muted` / `text-muted-foreground` - Muted
- `bg-success` / `text-success-foreground` - Sucesso (#10B981)
- `bg-warning` / `text-warning-foreground` - Aviso (#F59E0B)
- `bg-destructive` / `text-destructive-foreground` - Erro (#EF4444)
- `bg-info` / `text-info-foreground` - Info (#0EA5E9)

### Tipografia

- `text-xs` (12px) - Captions
- `text-sm` (14px) - Texto secundário
- `text-base` (16px) - Padrão
- `text-lg` (18px) - Destaque
- `text-xl` (20px) - Subtítulo pequeno
- `text-2xl` (24px) - Subtítulo
- `text-3xl` (30px) - Título de card
- `text-4xl` (36px) - Título de seção
- `text-5xl` (48px) - Page heading

### Espaçamento

- `p-2` (8px), `p-4` (16px) - PADRÃO, `p-6` (24px) - Cards, `p-8` (32px)
- `my-4` (16px), `my-6` (24px), `my-8` (32px)
- `gap-4` (16px), `gap-6` (24px), `gap-8` (32px)

### Border Radius

- `rounded-sm` (2px) - Badges
- `rounded-md` (6px) - Buttons
- `rounded-lg` (8px) - Cards (PADRÃO)
- `rounded-xl` (12px) - Modals
- `rounded-full` - Pill buttons, avatar

### Sombras

- `shadow-sm` - Subtle
- `shadow-md` - Cards (PADRÃO)
- `shadow-lg` - Hover states
- `shadow-xl` - Dropdowns
- `shadow-2xl` - Modals

### Acessibilidade (OBRIGATÓRIO)

```tsx
// Focus state (OBRIGATÓRIO)
<button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">

// ARIA label (OBRIGATÓRIO para botões apenas com ícone)
<button aria-label="Fechar modal">
  <X className="w-4 h-4" />
</button>
```

### Referências

- **Quick Reference**: `DESIGN_SYSTEM.md`
- **Design Tokens**: `src/lib/design-tokens.ts`
- **Documentação Completa**: `docs/03-development/design-system.md`
- **Component Showcase**: `src/components/examples/DesignSystemShowcase.tsx`

## Padrões do Projeto

### Server vs Client Components
- Use **Server Components** por padrão (melhor performance)
- Use **Client Components** apenas quando necessário (interatividade)
- Minimize o uso de `"use client"` no topo de arquivos

### Data Fetching
- Server Components: Busque dados diretamente no componente
- Client Components: Use Server Actions ou API Routes
- Realtime: Use Supabase Realtime subscriptions

### Autenticação
- Use Supabase Auth para autenticação
- Implemente RLS no banco para segurança
- Use middleware para proteger rotas

### Tipagem
- Exporte tipos do Supabase com `supabase gen types typescript`
- Use Zod para validação de schemas
- Mantenha tipos sincronizados com o banco
