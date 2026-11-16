const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    testIsolation: true,
    experimentalRunAllSpecs: true,
  },
  env: {
    apiUrl: 'https://serverest.dev',
  },
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  pageLoadTimeout: 60000,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  video: false,
  screenshotOnRunFailure: true,
});
