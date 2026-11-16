const { api } = require('../../support/api/client');
const { userFactory, productFactory } = require('../../support/factories');
const { LoginPage } = require('../../support/pages/login.page');
const { AdminProductsPage } = require('../../support/pages/admin-products.page');

describe('FE-03 | Administrador cadastra produto', () => {
  const loginPage = new LoginPage();
  const productsPage = new AdminProductsPage();
  let adminId;
  let adminToken;
  let productId;

  afterEach(() => {
    if (productId && adminToken) {
      api.deleteProduct(productId, adminToken).its('status').should('eq', 200);
    }
    if (adminId) {
      api.deleteUser(adminId).its('status').should('eq', 200);
    }
  });

  it('faz login como admin, cria produto pela UI e confirma presença na listagem', () => {
    const admin = userFactory({ admin: true });
    const product = productFactory();

    api.createUser(admin).then(({ status, body }) => {
      expect(status).to.eq(201);
      adminId = body._id;
    });
    api.login(admin).then(({ status, body }) => {
      expect(status).to.eq(200);
      adminToken = body.authorization;
    });

    cy.intercept('POST', '**/login').as('loginUi');
    loginPage.login(admin);
    cy.wait('@loginUi').its('response.statusCode').should('eq', 200);
    cy.location('pathname', { timeout: 15000 }).should('eq', '/admin/home');

    cy.intercept('POST', '**/produtos').as('createProduct');
    cy.intercept('GET', '**/produtos*').as('listProducts');
    productsPage.visitRegister();
    productsPage.fill(product);
    productsPage.submit();

    cy.wait('@createProduct').then(({ request, response }) => {
      expect(request.body.nome).to.eq(product.nome);
      expect(Number(request.body.preco)).to.eq(product.preco);
      expect(Number(request.body.quantidade)).to.eq(product.quantidade);
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      productId = response.body._id;
    });

    cy.location('pathname', { timeout: 15000 }).should('eq', '/admin/listarprodutos');
    cy.wait('@listProducts').its('response.statusCode').should('eq', 200);
    cy.contains('tbody tr', product.nome).should('be.visible');
  });
});
