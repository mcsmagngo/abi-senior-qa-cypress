const { api } = require('../../support/api/client');
const { userFactory } = require('../../support/factories');
const { RegisterUserPage } = require('../../support/pages/register-user.page');

describe('FE-01 | Cadastro de usuário comum', () => {
  const registerPage = new RegisterUserPage();
  let createdUserId;

  afterEach(() => {
    if (createdUserId) {
      api.deleteUser(createdUserId).its('status').should('eq', 200);
    }
  });

  it('cadastra pela interface, confirma HTTP 201 e acessa a área do cliente', () => {
    const user = userFactory();
    cy.intercept('POST', '**/usuarios').as('createUser');

    registerPage.visit();
    registerPage.fill(user);
    registerPage.submit();

    cy.wait('@createUser').then(({ request, response }) => {
      expect(request.body).to.include({
        nome: user.nome,
        email: user.email,
        administrador: 'false',
      });
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      createdUserId = response.body._id;
      expect(createdUserId).to.match(/^[A-Za-z0-9]{16}$/);
    });

    cy.location('pathname', { timeout: 15000 }).should('eq', '/home');
    cy.contains('h1', 'Serverest Store').should('be.visible');
  });
});
