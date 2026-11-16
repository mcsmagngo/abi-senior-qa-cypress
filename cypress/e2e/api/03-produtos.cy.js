const { api } = require('../../support/api/client');
const { userFactory, productFactory } = require('../../support/factories');

describe('API-03 | Produto exige autenticação de administrador', () => {
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

  it('retorna 201 ao cadastrar e 200 ao consultar o produto criado', () => {
    const admin = userFactory({ admin: true });
    const product = productFactory();

    api.createUser(admin).then(({ status, body }) => {
      expect(status).to.eq(201);
      adminId = body._id;
    });

    api.login(admin).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.authorization).to.match(/^Bearer\s+\S+$/);
      adminToken = body.authorization;
    });

    cy.then(() => api.createProduct(product, adminToken)).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body.message).to.eq('Cadastro realizado com sucesso');
      expect(body._id).to.match(/^[A-Za-z0-9]{16}$/);
      productId = body._id;
    });

    cy.then(() => api.getProduct(productId)).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.include({ ...product, _id: productId });
    });
  });
});
