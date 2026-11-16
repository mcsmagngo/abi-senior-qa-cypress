const { api } = require('../../support/api/client');
const { userFactory } = require('../../support/factories');

describe('API-02 | Autenticação com credenciais válidas', () => {
  let userId;

  afterEach(() => {
    if (userId) {
      api.deleteUser(userId).its('status').should('eq', 200);
    }
  });

  it('retorna 200 e um token Bearer para usuário existente', () => {
    const admin = userFactory({ admin: true });

    api.createUser(admin).then(({ status, body }) => {
      expect(status).to.eq(201);
      userId = body._id;
    });

    api.login(admin).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.message).to.eq('Login realizado com sucesso');
      expect(body.authorization).to.be.a('string').and.match(/^Bearer\s+\S+$/);
    });
  });
});
