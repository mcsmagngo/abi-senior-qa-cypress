/** POM: seletores e ações da tela de autenticação. */
class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fill({ email, password }) {
    cy.get('input[name="email"]').should('be.visible').type(email);
    cy.get('input[name="password"]').should('be.visible').type(password, { log: false });
  }

  submit() {
    cy.contains('button', /^Entrar$/).should('be.enabled').click();
  }

  login(credentials) {
    this.visit();
    this.fill(credentials);
    this.submit();
  }
}

module.exports = { LoginPage };
