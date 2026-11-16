/** POM: cadastro de produto no painel do administrador. */
class AdminProductsPage {
  visitRegister() {
    cy.visit('/admin/cadastrarprodutos');
  }

  fill(product) {
    cy.get('input[name="nome"]').should('be.visible').type(product.nome);
    cy.get('[name="price"]').type(String(product.preco));
    cy.get('[name="description"]').type(product.descricao);
    cy.get('[name="quantity"]').type(String(product.quantidade));
  }

  submit() {
    cy.contains('button', /^Cadastrar$/).should('be.enabled').click();
  }
}

module.exports = { AdminProductsPage };
