# Guia de Contribuição

Obrigado por considerar contribuir com o **Brasil API Client**! 🇧🇷

## Como contribuir

### 1. Reportar bugs
- Use o template de [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)
- Verifique se o bug já não foi reportado
- Inclua passos claros para reproduzir

### 2. Sugerir features
- Use o template de [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml)
- Explique o problema que a feature resolve
- Considere se é algo que beneficia a maioria dos usuários

### 3. Pull Requests
- Fork o repositório
- Crie uma branch: `git checkout -b feature/minha-feature`
- Faça suas alterações
- Execute os testes: `npm test`
- Execute o build: `npm run build`
- Execute o lint: `npm run lint`
- Abra o PR usando o [template](.github/PULL_REQUEST_TEMPLATE/pull_request_template.md)

## Padrões de código

### TypeScript
- Use `strict: true` (já configurado)
- Prefira `interface` sobre `type` para objetos
- Evite `any` — use `unknown` se necessário
- Tipos explícitos em funções públicas

### Commits
Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona suporte a ISBN v2
fix: corrige parsing de CEP com hífen
docs: atualiza README com exemplos de CLI
refactor: extrai validação de CPF para função separada
test: adiciona testes para endpoint NCM
chore: atualiza dependências de desenvolvimento
```

### Branches
- `feature/nome-da-feature` — novas funcionalidades
- `fix/nome-do-bug` — correções
- `docs/o-que-atualiza` — documentação
- `refactor/o-que-refatora` — refatoração
- `chore/o-que-faz` — manutenção

## Desenvolvimento local

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/brasil-api-client.git
cd brasil-api-client

# Instale dependências
npm install

# Desenvolvimento (watch mode)
npm run dev

# Build
npm run build

# Testes
npm test

# Lint
npm run lint

# CLI local
npx ts-node src/cli.ts cep 01310100

# Servidor local
npm run dev:server
```

## Estrutura do projeto

```
src/
├── index.ts       # Cliente principal, types, error handling
├── cli.ts         # Interface de linha de comando
├── server.ts      # Express server (proxy local)
├── examples.ts    # Exemplos de uso da biblioteca
└── client.test.ts # Testes de integração

public/
├── index.html     # Web UI
├── app.js         # Frontend logic
└── styles.css     # Estilos (tema dark/light)

dist/              # Build output (gitignored)
node_modules/      # Dependencies (gitignored)
```

## Testes

- Testes de integração reais contra a Brasil API
- Timeout padrão: 15s por teste
- Cobertura: `npm test -- --coverage`
- Novos endpoints = novos testes

## Versionamento

Seguimos [SemVer](https://semver.org/):
- **MAJOR** — breaking changes
- **MINOR** — novas features (compatível)
- **PATCH** — bug fixes (compatível)

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT do projeto.

## Código de conduta

Seja respeitoso, inclusivo e construtivo. Este projeto segue o [Contributor Covenant](https://www.contributor-covenant.org/).

---

**Dúvidas?** Abra uma [issue](https://github.com/Marcolino-Dev/brasil-api-client/issues) ou inicie uma [discussão](https://github.com/Marcolino-Dev/brasil-api-client/discussions).