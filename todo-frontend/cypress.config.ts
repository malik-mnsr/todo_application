import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    setupNodeEvents(on, config) {
      return config;
    },
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    screenshotOnRunFailure: true,
    video: true,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
