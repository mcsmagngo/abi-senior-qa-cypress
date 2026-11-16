/**
 * Massa dinâmica: evita conflitos em execução paralela ou com dados compartilhados.
 * Não depende de usuários/produtos pré-cadastrados no ServeRest público.
 */
function uniqueSuffix() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

function userFactory({ admin = false } = {}) {
  const suffix = uniqueSuffix();

  return {
    nome: admin ? `QA Admin ${suffix}` : `QA Usuario ${suffix}`,
    email: `abi.qa.${suffix}@example.com`,
    password: `QaTeste${suffix}!`,
    administrador: String(admin),
  };
}

function productFactory() {
  const suffix = uniqueSuffix();

  return {
    nome: `Produto ABI ${suffix}`,
    preco: 189,
    descricao: 'Produto de teste automatizado Cypress para o desafio ABI',
    quantidade: 8,
  };
}

module.exports = { userFactory, productFactory };
