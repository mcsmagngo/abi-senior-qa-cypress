# Cenários de Teste - Matriz de Rastreabilidade

Escopo solicitado pelo PDF: 3 cenários E2E frontend e 3 cenários API, usando Cypress + JavaScript. Priorização baseada em fluxos principais (cadastro, autenticação e catálogo) e nos contratos do Swagger.

## Frontend

### FE-01 - Cadastro de usuário comum (positivo)
**Dado** que uma pessoa não cadastrada acessa a tela de cadastro

**Quando** informa nome, e-mail único e senha válidos e confirma o cadastro

**Então** a API retorna **201** e o usuário é direcionado à página `/home` com a vitrine da loja visível.

**Arquivo:** `cypress/e2e/frontend/01-cadastro-usuario.cy.js`

### FE-02 - Autenticação inválida (negativo)
**Dado** que um visitante acessa `/login` sem credenciais válidas

**Quando** tenta autenticar com e-mail que não existe

**Então** a API retorna **401**, a mensagem de erro é exibida, o usuário permanece em `/login` e nenhum token é persistido.

**Arquivo:** `cypress/e2e/frontend/02-login-invalido.cy.js`

### FE-03 - Cadastro de produto via painel administrativo (positivo)
**Dado** um administrador criado pela API para uso exclusivo do teste

**Quando** efetua login pela interface e preenche os campos obrigatórios do produto

**Então** a API retorna **201**, a aplicação navega à listagem e o novo produto aparece na tabela.

**Arquivo:** `cypress/e2e/frontend/03-cadastro-produto-admin.cy.js`

## API

### API-01 - Persistência de usuário (positivo)
**Dado** um usuário único com propriedades válidas

**Quando** envia `POST /usuarios` e consulta `GET /usuarios/{_id}`

**Então** recebe **201**, ID válido e **200** com os mesmos atributos cadastrados.

**Arquivo:** `cypress/e2e/api/01-usuarios.cy.js`

### API-02 - Login e emissão de token (positivo)
**Dado** um usuário administrador cadastrado no pré-requisito

**Quando** envia `POST /login` com credenciais corretas

**Então** recebe **200**, mensagem de login concluído e autorização `Bearer` preenchida.

**Arquivo:** `cypress/e2e/api/02-login.cy.js`

### API-03 - Cadastro e consulta autenticada de produto (positivo)
**Dado** um administrador com token Bearer válido

**Quando** envia `POST /produtos` com cabeçalho Authorization e consulta `GET /produtos/{_id}`

**Então** recebe **201** ao cadastrar e **200** ao consultar, com dados consistentes.

**Arquivo:** `cypress/e2e/api/03-produtos.cy.js`

## Técnicas e cobertura

| Aspecto | Evidência |
|---|---|
| Classes de equivalência | Credenciais válidas e inválidas |
| Contrato HTTP | 200, 201, 401; `message`, `_id`, `authorization` |
| Autorização | Produto criado com token admin |
| Persistência | GET por ID após POST |
| Navegação e interface | Rotas `/login`, `/home`, `/admin/home`, `/admin/listarprodutos` e feedback visual |
| Testes determinísticos | Factories para nomes/e-mails exclusivos e pós-condição de exclusão |
| Reutilização | Page Object Model e API Client |

**Fora do escopo** dos 6 cenários: carga, acessibilidade, concorrência, paginação, falhas de rede, regras avançadas de carrinho e testes visuais. Seriam candidatos à expansão posterior mediante priorização de risco.
