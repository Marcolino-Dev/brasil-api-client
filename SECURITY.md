# Política de Segurança

## Versões suportadas

| Versão | Suportada |
|--------|-----------|
| 1.x.x  | ✅ Sim    |
| < 1.0  | ❌ Não    |

## Reportando vulnerabilidades

**Não abra issues públicas para vulnerabilidades de segurança.**

Envie um email para: **security@marcolino.dev** (ou abra um [Security Advisory](https://github.com/Marcolino-Dev/brasil-api-client/security/advisories/new) privado no GitHub).

Inclua:
- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestão de correção (se tiver)

## Resposta esperada

- **Confirmação**: dentro de 48h
- **Avaliação inicial**: dentro de 5 dias úteis
- **Correção**: depende da severidade (crítico: < 7 dias; alto: < 30 dias)

## Boas práticas de segurança

### Como biblioteca
- Não expõe chaves/segredos — apenas faz proxy para API pública
- Valida/sanitiza inputs (CEP, CNPJ, CPF, etc. limpos de caracteres não numéricos)
- Timeout configurável (padrão 10s) para evitar hangs
- Tratamento de erros sem vazar stack traces internos

### Como servidor local (`src/server.ts`)
- CORS habilitado (use com cuidado em produção)
- Rate limiting: **não implementado** — adicione se expor publicamente
- Helmet.js: **não incluído** — adicione headers de segurança em produção
- Logs de erro sem dados sensíveis

### Dependências
- `npm audit` executado no CI
- Dependências atualizadas regularmente
- `package-lock.json` commitado para builds reprodutíveis

## Checklist para mantenedores

Ao fazer release:
- [ ] `npm audit` sem vulnerabilidades altas/críticas
- [ ] Dependências atualizadas (`npm outdated`)
- [ ] Testes passando
- [ ] Build limpo
- [ ] Changelog atualizado

## Divulgação responsável

Agradecemos pesquisadores de segurança que seguem divulgação responsável. Creditaremos no changelog (se desejado) após a correção ser publicada.