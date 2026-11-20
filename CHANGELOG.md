# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado
- Configuração profissional de repositório GitHub
  - CI/CD com GitHub Actions (lint, build, test, type-check)
  - Templates de Issue (Bug Report, Feature Request)
  - Template de Pull Request
  - CODEOWNERS
  - CONTRIBUTING.md
  - SECURITY.md
  - LICENSE (MIT)

## [1.0.0] - 2024-11-19

### Adicionado
- Cliente TypeScript/JavaScript para Brasil API (brasilapi.com.br)
- Suporte completo aos endpoints:
  - **CEP**: v1 (básico), v2 (com geolocalização), v3 (detalhado)
  - **CNPJ**: Consulta completa com sócios (QSA)
  - **Bancos**: Lista todos (471+) e busca por código COMPE
  - **DDD**: Cidades por código de área
  - **Feriados**: Calendário nacional por ano
  - **FIPE**: Marcas, modelos, anos e preços de veículos (carros, motos, caminhões)
  - **IBGE**: Estados (27) e cidades por UF
  - **ISBN**: Busca de livros
  - **NCM**: Nomenclatura Comum do Mercosul
  - **CPF**: Validação algorítmica de dígitos verificadores
  - **Status**: Health check da API
- Interface de linha de comando (CLI) com 17 comandos
- Servidor Express local como proxy (porta 3000)
- Web UI responsiva com tema dark/light
- Testes de integração (16 testes passando)
- Build TypeScript com declarações (.d.ts)
- Documentação completa no README

### Configuração técnica
- TypeScript 5.x (strict mode)
- Jest + ts-jest para testes
- ESLint + TypeScript ESLint
- Axios para HTTP com interceptors de erro
- Express + CORS para servidor local