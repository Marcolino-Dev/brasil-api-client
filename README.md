# Brasil API Client

Cliente TypeScript/JavaScript para a [Brasil API](https://brasilapi.com.br/) - API pública de dados brasileiros.

## Instalação

```bash
npm install
```

## Uso Rápido (CLI)

```bash
# Build
npm run build

# CEP
npx ts-node src/cli.ts cep 01310100

# CNPJ
npx ts-node src/cli.ts cnpj 00000000000000

# Bancos
npx ts-node src/cli.ts banks

# DDD
npx ts-node src/cli.ts ddd 11

# Feriados
npx ts-node src/cli.ts holidays 2024

# FIPE - Marcas
npx ts-node src/cli.ts fipe-brands carros

# FIPE - Modelos
npx ts-node src/cli.ts fipe-models carros 21

# IBGE - Estados
npx ts-node src/cli.ts ibge-states

# IBGE - Cidades por Estado
npx ts-node src/cli.ts ibge-cities SP

# NCM
npx ts-node src/cli.ts ncm 84713012

# CPF
npx ts-node src/cli.ts cpf 11144477735

# Status da API
npx ts-node src/cli.ts status

# Ajuda
npx ts-node src/cli.ts help
```

## Uso como Biblioteca

```typescript
import { createBrasilApiClient, cep, cnpj, banks, ddd, holidays, fipe, ibge, ncm, cpf, status } from './dist';

// Criar cliente customizado
const client = createBrasilApiClient({
  timeout: 15000,
});

// Ou usar funções de conveniência (cliente singleton)
const cepData = await cep.v2('01310100');
const cnpjData = await cnpj.get('00000000000000');
const banksList = await banks.list();
const dddData = await ddd.get('11');
const holidaysList = await holidays.byYear(2024);
const fipeBrands = await fipe.brands('carros');
const states = await ibge.states();
const cities = await ibge.citiesByState('SP');
const ncmData = await ncm.get('84713012');
const cpfResult = await cpf.validate('11144477735');
const apiStatus = await status.get();
```

## Endpoints Suportados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| CEP v1 | `cep.v1(cep)` | Busca CEP básica |
| CEP v2 | `cep.v2(cep)` | Busca CEP com geolocalização |
| CEP v3 | `cep.v3(cep)` | Busca CEP detalhada |
| CNPJ | `cnpj.get(cnpj)` | Busca dados de CNPJ |
| Bancos | `banks.list()` | Lista todos os bancos |
| Banco por código | `banks.byCode(code)` | Busca banco por código |
| DDD | `ddd.get(ddd)` | Busca cidades por DDD |
| Feriados | `holidays.byYear(year)` | Lista feriados nacionais |
| FIPE Marcas | `fipe.brands(type)` | Lista marcas de veículos |
| FIPE Modelos | `fipe.models(type, brandCode)` | Lista modelos por marca |
| FIPE Anos | `fipe.years(type, brandCode, modelCode)` | Lista anos por modelo |
| FIPE Preço | `fipe.price(fipeCode)` | Busca preço por código FIPE |
| IBGE Estados | `ibge.states()` | Lista todos os estados |
| IBGE Cidades | `ibge.citiesByState(uf)` | Lista cidades por estado |
| ISBN | `isbn.get(isbn)` | Busca livro por ISBN |
| NCM | `ncm.get(ncm)` | Busca NCM |
| CPF | `cpf.validate(cpf)` | Valida CPF |
| Status | `status.get()` | Verifica status da API |

## Estrutura do Projeto

```
src/
├── index.ts      # Cliente principal e tipos
├── cli.ts        # Interface de linha de comando
├── examples.ts   # Exemplos de uso
└── client.test.ts # Testes
```

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Build
npm run build

# Rodar exemplos
npx ts-node src/examples.ts

# Rodar testes
npm test

# Lint
npm run lint
```

## Licença

MIT