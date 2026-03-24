# Git Workflow - Pull Requests

## Estratégia de Branches

Este projeto utiliza **branch-based development** com Pull Requests obrigatórios.

### Branches Principais

- **`main`** - Branch de produção (protegida)
  - Apenas merges via Pull Request aprovados
  - Histórico limpo e estável

- **`develop`** - Branch de desenvolvimento (opcional)
  - Integração contínua das features
  - Próximo release

### Branches de Feature

Para cada nova funcionalidade:

```bash
# Criar branch de feature a partir de main
git checkout main
git pull
git checkout -b feature/nome-da-feature

# OU para bugs
git checkout -b fix/nome-do-bug

# OU para melhorias
git checkout -b chore/nome-da-refatoracao
```

## Convenção de Nomes

- `feature/` - Novas funcionalidades
- `fix/` - Correção de bugs
- `hotfix/` - Correções urgentes em produção
- `refactor/` - Refatoração de código
- `chore/` - Tarefas de manutenção
- `docs/` - Atualizações de documentação
- `test/` - Adição ou correção de testes

## Exemplos

```
feature/user-dashboard
feature/authentication-system
fix/login-error
hotfix/security-patch
refactor/optimize-database-queries
chore/update-dependencies
docs/api-documentation
```

## Workflow Completo

### 1. Criar Branch

```bash
git checkout main
git pull
git checkout -b feature/nome-da-feature
```

### 2. Desenvolver e Commitar

```bash
# Fazer as mudanças...

git add .
git commit -m "feat: describe what you did"
```

### 3. Push e Criar PR

```bash
git push -u origin feature/nome-da-feature
```

Depois vá no GitHub e crie o Pull Request.

### 4. Após Merge

```bash
# Voltar para main
git checkout main
git pull

# Deletar branch local
git branch -d feature/nome-da-feature

# Deletar branch remota
git push origin --delete feature/nome-da-feature
```

## Convenção de Commits

Use conventional commits:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, missing semicolons, etc.
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Atualização de tarefas

### Exemplos

```
feat: add user dashboard with metrics
fix: resolve authentication timeout issue
docs: update API documentation
refactor: optimize database queries
test: add unit tests for user service
```

## Template de Pull Request

Todo PR deve conter:

### Título
```
feat: User Dashboard
```

### Descrição

```markdown
## Summary
- Bullet point do que foi feito
- Outro bullet point

## Changes
- Listagem das mudanças principais

## Test plan
- [x] Testes unitários passando
- [x] Testes manuais realizados
- [ ] Testes E2E executados

## Screenshots (se aplicável)
[Anexar screenshots]

## Checklist
- [ ] Código segue o Design System
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Sem conflitos com main
```

## Proteção da Branch `main`

Configure no GitHub (Settings → Branches):

- ✅ Require pull request reviews before merging
  - Required approving reviews: 1
- ✅ Require status checks to pass before merging
- ✅ Do not allow bypassing the above settings

## Comandos Úteis

```bash
# Ver branches
git branch -a

# Ver branches remotas
git branch -r

# Ver diff com main
git diff main

# Ver commits não merged
git log main..HEAD

# Rebase em main (atualizar feature branch)
git checkout feature/nome-da-feature
git fetch
git rebase main
```

## Boas Práticas

1. **Commits pequenos e frequentes**
2. **Mensagens de commit claras**
3. **PRs descritivos com contexto**
4. **Code reviews obrigatórios**
5. **Testes antes de pedir review**
6. **Atualize feature branch com main frequentemente**
7. **Resolva conflitos antes do merge**
