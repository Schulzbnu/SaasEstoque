#!/bin/bash

# Script para criar Pull Requests no GitHub
# Uso: ./scripts/create-pr.sh "Título do PR"

# Verificar se está em uma branch de feature
CURRENT_BRANCH=$(git branch --show-current)
MAIN_BRANCH="main"

if [[ "$CURRENT_BRANCH" == "$MAIN_BRANCH" ]]; then
    echo "❌ Erro: Você está na branch main. Crie uma branch de feature primeiro."
    echo "   Exemplo: git checkout -b feature/nova-feature"
    exit 1
fi

# Verificar se há commits para fazer PR
if git diff --quiet "$MAIN_BRANCH"..."$CURRENT_BRANCH"; then
    echo "❌ Erro: Não há commits diferentes entre $CURRENT_BRANCH e $MAIN_BRANCH"
    exit 1
fi

# Título do PR (primeiro argumento ou padrão)
PR_TITLE=${1:-"feat: $(echo $CURRENT_BRANCH | sed 's/feature\///' | sed 's/fix\///' | sed 's/-/ /g' | sed 's/\b\w/\u&/g')"}

# Abrir navegador para criar PR
echo "🔗 Abrindo navegador para criar PR..."
echo "Branch: $CURRENT_BRANCH -> $MAIN_BRANCH"

# Abrir no navegador
if command -v "C:\Program Files\GitHub CLI\gh.exe" &> /dev/null; then
    "C:\Program Files\GitHub CLI\gh.exe" pr create \
        --title "$PR_TITLE" \
        --base "$MAIN_BRANCH" \
        --head "$CURRENT_BRANCH" \
        --body-file .github/PULL_REQUEST_TEMPLATE.md \
        --web
else
    # Fallback: abrir URL diretamente
    REPO_URL=$(git config --get remote.origin.url | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/.git$//')
    PR_URL="$REPO_URL/compare/$MAIN_BRANCH...$CURRENT_BRANCH"
    echo "URL: $PR_URL"

    if command -v xdg-open &> /dev/null; then
        xdg-open "$PR_URL"
    elif command -v open &> /dev/null; then
        open "$PR_URL"
    else
        start "$PR_URL"
    fi
fi

echo "✅ PR criado com sucesso!"
