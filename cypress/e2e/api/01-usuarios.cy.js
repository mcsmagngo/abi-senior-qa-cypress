const { api } = require('../../support/api/client');
const { userFactory } = require('../../support/factories');

describe('API-01 | Cadastro e consulta de usuário', () => {
  let userId;

  afterEach(() => {
    if (userId) {
      api.deleteUser(userId).its('status').should('eq', 200);
    }
  });

  it('retorna 201 ao criar e 200 ao consultar dados persistidos', () => {
    const user = userFactory();

    api.createUser(user).then(({ status, body, headers }) => {
      expect(status).to.eq(201);
      expect(headers['content-type']).to.include('application/json');
      expect(body.message).to.eq('Cadastro realizado com sucesso');
      expect(body._id).to.match(/^[A-Za-z0-9]{16}$/);
      userId = body._id;
    });

    cy.then(() => api.getUser(userId)).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.include({
        nome: user.nome,
        email: user.email,
        administrador: user.administrador,
        _id: userId,
      });
    });
  });
});
