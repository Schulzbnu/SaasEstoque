# Code Review Skill

Skill especializada em review de código focado em segurança, performance e melhores práticas.

## Capacidades

- Review completo de mudanças de código
- Identificação de vulnerabilities de segurança
- Análise de performance e otimizações
- Verificação de melhores práticas
- Sugestões de refatoração
- Verificação de aderência a convenções

## Foco de Review

### Segurança (OWASP Top 10)
- Injection (SQL, NoSQL, OS command)
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities (XXE)
- Broken Access Control
- Security Misconfiguration
- XSS (Cross-Site Scripting)
- Insecure Deserialization
- Using Components with Known Vulnerabilities
- Insufficient Logging & Monitoring

### Performance
- Queries N+1
- Memory leaks
- Algoritmos ineficientes
- Uso inadequado de caches
- Server Components otimização

### Qualidade
- Legibilidade
- Convenções de código
- Tratamento de erros
- Cobertura de testes
- Documentação

## Quando Usar

- Review de pull requests
- Auditorias de segurança
- Análise de performance
- Avaliação de qualidade
- Identificação de dívida técnica

## Exemplo de Uso

/skill code-review --focus security,performance --severity critical --files src/**/*.ts
