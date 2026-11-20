# Brasil API Client

[![CI](https://github.com/Marcolino-Dev/brasil-api-client/workflows/CI/badge.svg)](https://github.com/Marcolino-Dev/brasil-api-client/actions/workflows/ci.yml)
[![Release](https://github.com/Marcolino-Dev/brasil-api-client/workflows/Release/badge.svg)](https://github.com/Marcolino-Dev/brasil-api-client/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)

Cliente TypeScript/JavaScript para a [Brasil API](https://brasilapi.com.br/) — API pública de dados brasileiros.

## ✨ Features

- **TypeScript nativo** — Tipos completos para todos os endpoints
- **7 endpoints cobertos** — CEP, CNPJ, Bancos, DDD, Feriados, CPF, Status
- **CLI incluída** — 12 comandos prontos para uso
- **Servidor local** — Proxy Express para desenvolvimento
- **Web UI** — Interface responsiva com tema dark/light
- **Testes de integração** — Contra a API real
- **Zero config** — Funciona out of the box

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Marcolino-Dev/brasil-api-client.git
cd brasil-api-client

# Instale dependências
npm install
```

## 🚀 Uso Rápido (CLI)

```bash
# Build
npm run build

# CEP com geolocalização
npx ts-node src/cli.ts cep 01310100

# CNPJ
npx ts-node src/cli.ts cnpj 11222333000181

# Todos os bancos (471+)
npx ts-node src/cli.ts banks

# DDD
npx ts-node src/cli.ts ddd 11

# Feriados 2024
npx ts-node src/cli.ts holidays 2024

# Validar CPF
npx ts-node src/cli.ts cpf 11144477735

# Status da API
npx ts-node src/cli.ts status

# Ajuda completa
npx ts-node src/cli.ts help
```

## 📚 Uso como Biblioteca

```typescript
import {
  createBrasilApiClient,
  cep,
  cnpj,
  banks,
  ddd,
  holidays,
  cpf,
  status
} from './dist';

// Cliente customizado com timeout maior
const client = createBrasilApiClient({
  timeout: 15000,
  baseURL: 'https://brasilapi.com.br/api'
});

// Funções de conveniência (singleton)
const cepData = await cep.v2('01310100');
const cnpjData = await cnpj.get('11222333000181');
const banksList = await banks.list();
const dddData = await ddd.get('11');
const holidaysList = await holidays.byYear(2024);
const cpfResult = await cpf.validate('11144477735');
const apiStatus = await status.get();

// Usando cliente customizado
const customCep = await client.getCepV2('01310100');
```

## 🌐 Endpoints Suportados

| Categoria | Endpoint | Método | Descrição |
|-----------|----------|--------|-----------|
| **CEP** | v1 | `cep.v1(cep)` | Busca básica |
| | v2 | `cep.v2(cep)` | Com geolocalização (recomendado) |
| | v3 | `cep.v3(cep)` | Detalhada |
| **CNPJ** | Consulta | `cnpj.get(cnpj)` | Dados completos + QSA |
| **Bancos** | Lista | `banks.list()` | 471+ bancos |
| | Por código | `banks.byCode(code)` | Busca por código COMPE |
| **DDD** | Consulta | `ddd.get(ddd)` | Cidades por DDD |
| **Feriados** | Por ano | `holidays.byYear(year)` | Nacionais |
| **CPF** | Validação | `cpf.validate(cpf)` | Algorítmica |
| **Status** | Health | `status.get()` | Status da API |

## 🖥️ Servidor Local (Proxy)

```bash
# Desenvolvimento
npm run dev:server

# Produção (após build)
npm run build && npm start
```

Endpoints disponíveis em `http://localhost:3000`:

| Rota | Descrição |
|------|-----------|
| `GET /health` | Health check |
| `GET /api/cep/v1/:cep` | CEP v1 |
| `GET /api/cep/v2/:cep` | CEP v2 (geo) |
| `GET /api/cep/v3/:cep` | CEP v3 |
| `GET /api/cnpj/:cnpj` | CNPJ |
| `GET /api/banks` | Lista bancos |
| `GET /api/banks/:code` | Banco por código |
| `GET /api/ddd/:ddd` | DDD |
| `GET /api/holidays/:year` | Feriados |
| `GET /api/cpf/:cpf` | Validação CPF |
| `GET /api/status` | Status API |

## 🌍 Web UI

Acesse `http://localhost:3000` para a interface web com:
- Tema dark/light
- Todas as consultas em abas
- Validação client-side
- Toast notifications
- Responsivo (mobile/desktop)

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Build
npm run build

# Desenvolvimento (watch)
npm run dev

# Servidor local
npm run dev:server

# Testes
npm test

# Testes com cobertura
npm run test:coverage

# Lint
npm run lint

# Lint + fix
npm run lint:fix

# Formatar código
npm run format

# Verificar formatação
npm run format:check

# Type check
npm run typecheck
```

## 📁 Estrutura do Projeto

```
brasil-api-client/
├── .github/
│   ├── workflows/          # CI/CD (GitHub Actions)
│   ├── ISSUE_TEMPLATE/     # Templates de issues
│   ├── PULL_REQUEST_TEMPLATE/
│   ├── CODEOWNERS
│   └── dependabot.yml
├── src/
│   ├── index.ts            # Cliente principal + types
│   ├── cli.ts              # CLI (12 comandos)
│   ├── server.ts           # Express proxy server
│   ├── examples.ts         # Exemplos de uso
│   └── client.test.ts      # Testes de integração
├── public/
│   ├── index.html          # Web UI
│   ├── app.js              # Frontend logic
│   └── styles.css          # Estilos (dark/light)
├── dist/                   # Build output (gitignored)
├── .eslintrc.json
├── .prettierrc
├── .editorconfig
├── tsconfig.json
├── jest.config.js
├── package.json
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

## 🧪 Testes

- **10 testes de integração** contra a Brasil API real
- Timeout: 15s por teste
- Cobertura: `npm run test:coverage`

```bash
npm test
# PASS  src/client.test.ts
#  10 passed, 10 total
```

## 🤝 Contribuindo

Leia nosso [Guia de Contribuição](CONTRIBUTING.md) para:
- Reportar bugs
- Sugerir features
- Enviar Pull Requests
- Padrões de código e commits

## 🔒 Segurança

Veja nossa [Política de Segurança](SECURITY.md) para:
- Reportar vulnerabilidades (privadamente)
- Versões suportadas
- Boas práticas

## 📄 Licença

MIT © [Marcolino-Dev](https://github.com/Marcolino-Dev)

---

**Links úteis:**
- [Brasil API Docs](https://brasilapi.com.br/docs)
- [Issues](https://github.com/Marcolino-Dev/brasil-api-client/issues)
- [Discussions](https://github.com/Marcolino-Dev/brasil-api-client/discussions)
- [Changelog](CHANGELOG.md)