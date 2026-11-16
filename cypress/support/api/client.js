/** Cliente de API centralizado: reduz repetição e diferencia setup de validação. */
const endpoint = (path) => `${Cypress.env('apiUrl').replace(/\/$/, '')}${path}`;

const api = {
  createUser: (user) => cy.request({
    method: 'POST', url: endpoint('/usuarios'), body: user,
  }),
  getUser: (id) => cy.request({
    method: 'GET', url: endpoint(`/usuarios/${id}`),
  }),
  deleteUser: (id) => cy.request({
    method: 'DELETE', url: endpoint(`/usuarios/${id}`), failOnStatusCode: false,
  }),
  login: ({ email, password }, options = {}) => cy.request({
    method: 'POST', url: endpoint('/login'), body: { email, password }, ...options,
  }),
  createProduct: (product, token) => cy.request({
    method: 'POST', url: endpoint('/produtos'),
    headers: { Authorization: token }, body: product,
  }),
  getProduct: (id) => cy.request({
    method: 'GET', url: endpoint(`/produtos/${id}`),
  }),
  deleteProduct: (id, token) => cy.request({
    method: 'DELETE', url: endpoint(`/produtos/${id}`),
    headers: { Authorization: token }, failOnStatusCode: false,
  }),
};

module.exports = { api };
