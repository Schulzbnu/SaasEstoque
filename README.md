# SaasEstoque 📦

Sistema de controle de estoque SaaS construído com as melhores tecnologias do mercado.

## 🚀 Tecnologias

### Core Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL via [Supabase](https://supabase.com/)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime

### Infraestrutura
- **Hospedagem**: Vercel
- **Banco de Dados**: Supabase Cloud
- **CI/CD**: GitHub Actions

## 📋 Funcionalidades

### Planejado
- [ ] Gestão completa de estoque
- [ ] Multi-tenancy (múltiplos usuários/empresas)
- [ ] Dashboard com métricas em tempo real
- [ ] Alertas de estoque baixo
- [ ] Relatórios personalizados
- [ ] Integração com provedores de pagamento
- [ ] Exportação de dados (CSV, PDF)

## 🏗️ Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rotas autenticadas
│   ├── (public)/          # Rotas públicas
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── forms/            # Formulários
│   ├── layouts/          # Layouts reutilizáveis
│   └── features/         # Feature-specific
├── lib/                  # Utilitários e configs
│   ├── supabase/         # Client Supabase
│   └── design-tokens.ts  # Design System
├── types/                # Tipos TypeScript
├── hooks/                # Custom hooks
└── supabase/             # Migrations SQL
```

## 🎨 Design System

Este projeto segue um **Design System rigoroso** definido em `DESIGN_SYSTEM.md`.

### Princípios
- ✅ Cores semânticas (primary, success, warning, destructive)
- ✅ Componentes reutilizáveis
- ✅ Acessibilidade (WCAG 2.1 AA)
- ✅ Responsividade mobile-first

### Documentação
- **Quick Reference**: `DESIGN_SYSTEM.md`
- **Documentação Completa**: `docs/03-development/design-system.md`

## 👥 Sistema Multi-Agent

Este projeto utiliza um sistema de 5 agentes especializados para desenvolvimento eficiente:

1. **Database Architect** 🗄️ - Design de esquemas e migrations
2. **Backend Developer** ⚙️ - APIs e Server Actions
3. **Frontend Developer** 🎨 - Componentes UI e layouts
4. **Code Reviewer** 🔍 - Review de código e segurança
5. **QA Engineer** 🧪 - Testes e qualidade

Veja `CLAUDE.md` para mais detalhes.

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase

### Instalação

```bash
# Clonar repositório
git clone https://github.com/Schulzbnu/SaasEstoque.git
cd SaasEstoque

# Instalar dependências
npm install

# Configurar environment variables
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase

# Rodar migrations
npx supabase db push

# Executar em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📚 Git Workflow

Este projeto utiliza **branch-based development** com Pull Requests obrigatórios.

### Criar Nova Feature

```bash
# Atualizar main
git checkout main
git pull

# Criar branch de feature
git checkout -b feature/nome-da-feature

# Desenvolver...
git add .
git commit -m "feat: descrição"

# Push e criar PR
git push -u origin feature/nome-da-feature
```

Veja `GIT_WORKFLOW.md` para detalhes completos.

## 🧪 Testes

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📖 Documentação

- [Design System](./DESIGN_SYSTEM.md)
- [Git Workflow](./GIT_WORKFLOW.md)
- [Multi-Agent System](./CLAUDE.md)
- [Documentação Completa](./docs/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**Eduardo Schulz** - [@Schulzbnu](https://github.com/Schulzbnu)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
