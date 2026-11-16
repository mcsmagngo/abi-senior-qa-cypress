const { userFactory } = require('../../support/factories');
const { LoginPage } = require('../../support/pages/login.page');

describe('FE-02 | Login com credenciais inválidas', () => {
  it('mantém usuário desautenticado e exibe mensagem de erro', () => {
    const invalidUser = userFactory(); // e-mail único não cadastrado
    const loginPage = new LoginPage();
    cy.intercept('POST', '**/login').as('loginAttempt');

    loginPage.login(invalidUser);

    cy.wait('@loginAttempt').then(({ request, response }) => {
      expect(request.body.email).to.eq(invalidUser.email);
      expect(response.statusCode).to.eq(401);
      expect(response.body.message).to.eq('Email e/ou senha inválidos');
    });

    cy.location('pathname').should('eq', '/login');
    cy.contains('Email e/ou senha inválidos').should('be.visible');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('serverest/userToken')).to.be.null;
    });
  });
});
