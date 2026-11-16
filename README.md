# Desafio Senior QA ABI - Testes automatizados ServeRest

![Cypress](https://img.shields.io/badge/E2E-Cypress-17202C) ![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E) ![ServeRest](https://img.shields.io/badge/API-ServeRest-green)

Projeto desenvolvido conforme o **Senior QA Test ABI**: **exatamente 3 cenários de frontend E2E e 3 cenários de API** utilizando **Cypress e JavaScript**. Baseado na [interface ServeRest](https://front.serverest.dev/) e na [documentação Swagger](https://serverest.dev/).

## Cenários solicitados

| ID | Camada | Cenário | Resultado esperado |
|---|---|---|---|
| FE-01 | Frontend | Cadastrar usuário comum | `POST /usuarios` = `201`; acesso a `/home` |
| FE-02 | Frontend | Tentativa de login com credenciais inválidas | `POST /login` = `401`; erro visível; permanência em `/login` |
| FE-03 | Frontend | Login admin e cadastro de produto pela UI | `POST /produtos` = `201`; produto visível na lista |
| API-01 | API | Cadastrar usuário e consultar por ID | `POST /usuarios` = `201`; `GET /usuarios/{id}` = `200` e dados coerentes |
| API-02 | API | Autenticar usuário válido | `POST /login` = `200`; token no formato `Bearer <token>` |
| API-03 | API | Criar produto como admin e consultar por ID | `POST /produtos` = `201`; `GET /produtos/{id}` = `200` |

Cada linha corresponde a **um único `it`**. As requisições de preparo e limpeza são *fixtures dinâmicas* / *teardown*, e não cenários adicionais.

## Tecnologias e arquitetura

- **Cypress + JavaScript**: testes em navegador e HTTP via `cy.request`.
- **Page Object Model (POM)**: abstração de interações com login, cadastro e produtos.
- **Factory de dados**: usuário e produto únicos por execução, sem depender de contas fixas.
- **API Client**: centraliza endpoints, verbos e autenticação para preparo, verificações e exclusão.
- **Test isolation / teardown**: apaga produtos e usuários cadastrados pela suíte no ambiente público.
- **GitHub Actions**: lint, Chrome e upload de screenshots em falhas.

### Estrutura de diretórios

```text
.
├── .github/workflows/cypress.yml          # CI
├── cypress.config.js                      # Cypress, baseUrl e apiUrl
├── cypress/
│   ├── e2e/
│   │   ├── frontend/
│   │   │   ├── 01-cadastro-usuario.cy.js
│   │   │   ├── 02-login-invalido.cy.js
│   │   │   └── 03-cadastro-produto-admin.cy.js
│   │   └── api/
│   │       ├── 01-usuarios.cy.js
│   │       ├── 02-login.cy.js
│   │       └── 03-produtos.cy.js
│   └── support/
│       ├── api/client.js                  # Requisições de API
│       ├── pages/                         # Page Objects
│       ├── factories.js                   # Dados únicos
│       └── e2e.js                         # Arquivo global de suporte
├── CENARIOS.md                            # Gherkin / rastreabilidade
├── eslint.config.js                       # Regras de qualidade
└── package.json                           # Scripts e dependências
```

## Pré-requisitos

- **Node.js 22 ou superior**, `npm` e navegador **Chrome** ou **Electron**.
- Internet para acessar `https://front.serverest.dev` e `https://serverest.dev`.
- O frontend público ServeRest está marcado como **beta** no projeto original. Alterações externas podem exigir atualização de seletores.

## Instalação

No macOS ou em outro sistema com Node disponível:

```bash
npm install
```

O comando instala o Cypress e as ferramentas de lint. Ele também gera o `package-lock.json`; **commite esse arquivo no repositório** para permitir instalações reproduzíveis.

## Execução

```bash
npm test                  # todos os 6 testes em Electron headless
npm run test:frontend     # apenas 3 testes de frontend
npm run test:api          # apenas 3 testes de API
npm run test:chrome       # todos os testes em Chrome
npm run ci                # lint + suíte completa no Chrome
npm run test:open         # interface interativa Cypress
npm run lint              # validação estática
```

### Ambiente configurável

As URLs de produção, definidas em `cypress.config.js`, podem ser substituídas usando variáveis do Cypress (exemplo):

```bash
CYPRESS_BASE_URL=https://front.serverest.dev CYPRESS_apiUrl=https://serverest.dev npm test
```

Os testes de frontend dependem do backend remoto apontado pela própria aplicação. Alterar apenas o `apiUrl` dos testes, mantendo o frontend remoto, pode causar divergência entre os ambientes. Para execução local, inicie também o frontend apontando para a API local.

## Estratégia de testes

1. **Pré-condições**: `cy.request` cria apenas os dados necessários ao cenário, sem clicar na UI em todo setup.
2. **Ação**: frontend exercita formulários reais; API executa chamadas HTTP reais.
3. **Assertivas**: status HTTP, mensagem de contrato, formato de ID/token, persistência e comportamento visual / rota.
4. **Limpeza**: após cada teste, exclui os registros criados (produto antes do administrador). IDs são preservados ao longo do cenário.
5. **Independência**: os cenários podem rodar isolados ou em qualquer ordem, sem depender de dados estáticos.

> **Atenção ao ambiente compartilhado:** o ServeRest online remove dados diariamente e é usado por outras pessoas. Evite carga/performance ou execução altamente paralela nesse endpoint. Para suites grandes ou testes destrutivos, prefira o ServeRest local.

## CI - GitHub Actions

O workflow `.github/workflows/cypress.yml` roda em `push`/`pull_request` para `main` e manualmente. Instala as dependências com `npm install`, executa ESLint + Cypress no Chrome e publica screenshots apenas se ocorrerem falhas. Em projeto definitivo, após commitar o `package-lock.json`, é recomendado substituir `npm install` por `npm ci`.

### Publicação no GitHub

1. Crie um repositório **público** no GitHub (sugestão: `abi-senior-qa-cypress`).
2. Descompacte/copie os arquivos deste projeto para a raiz do repositório.
3. Execute `npm install`, `npm run lint`, `npm test` e verifique o relatório do Cypress.
4. Versione também o `package-lock.json` gerado.
5. Publique e compartilhe a **URL pública** do repositório.

```bash
git init
git branch -M main
npm install
npm run lint
npm test
git add .
git commit -m "test: implementa cenários E2E e API do desafio ABI"
git remote add origin https://github.com/SEU_USUARIO/abi-senior-qa-cypress.git
git push -u origin main
```

**Obs.:** substitua `SEU_USUARIO` pelo usuário GitHub e crie o repositório público antes do `push`. Não coloque tokens de acesso ou senhas reais no código. As senhas de exemplo são geradas para contas descartáveis.

### Histórico de commits recomendado

Para tornar as mudanças fáceis de revisar, registre em commits separados no seu clone antes de publicar:

```text
chore: configura projeto Cypress e qualidade de código
feat: adiciona factories, cliente HTTP e page objects
test: implementa três cenários de API ServeRest
test: implementa três cenários E2E de frontend
ci: adiciona execução automatizada no GitHub Actions
docs: documenta cenários, execução e decisões técnicas
```

## Limitações e transparência

- **Nenhum teste é simulado** ou usa `cy.intercept` para devolver uma resposta falsa: `cy.intercept` observa chamadas reais e permite validar o contrato frontend–API.
- O projeto foi estruturado a partir dos requisitos do desafio e da documentação/código públicos do ServeRest. **Não há registro de execução real contra os dois sites neste pacote**; rode `npm test` no seu ambiente e envie o link do CI após obter resultado verde.
- Códigos HTTP e mensagens são baseados no contrato publicado; se a aplicação beta mudar, a falha evidenciará a alteração e deverá ser investigada.

## Referências

- [Swagger ServeRest](https://serverest.dev/)
- [Código do frontend ServeRest](https://github.com/ServeRest/front)
- [Repositório oficial da API](https://github.com/ServeRest/ServeRest)
- [Documentação oficial do Cypress](https://docs.cypress.io/)
