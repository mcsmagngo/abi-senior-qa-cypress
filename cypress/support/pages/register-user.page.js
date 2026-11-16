/** POM: cadastro de usuário pelo navegador. */
class RegisterUserPage {
  visit() {
    cy.visit('/cadastrarusuarios');
  }

  fill(user) {
    cy.get('input[name="nome"]').should('be.visible').type(user.nome);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password, { log: false });
    // A opção de administrador permanece desmarcada (usuário comum).
  }

  submit() {
    cy.contains('button', /^Cadastrar$/).should('be.enabled').click();
  }
}

module.exports = { RegisterUserPage };
