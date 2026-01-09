import '@cypress/schematic';

Cypress.Commands.add('createTask', (title: string, description?: string) => {
  cy.visit('/');
  cy.get('input[placeholder*="Titre"]').type(title);
  if (description) {
    cy.get('textarea[placeholder*="Description"]').type(description);
  }
  cy.get('button:contains("Ajouter")').click();
});

Cypress.Commands.add('updateTaskStatus', (taskTitle: string, newStatus: string) => {
  cy.visit('/');
  cy.contains(taskTitle).closest('.task-card').within(() => {
    cy.get('button:contains("→")').click();
    cy.get(`button:contains("${newStatus}")`).click();
  });
});

Cypress.Commands.add('deleteTask', (taskTitle: string) => {
  cy.visit('/');
  cy.contains(taskTitle).closest('.task-card').within(() => {
    cy.get('button[title="Supprimer"]').click();
  });
});

Cypress.Commands.add('verifyTaskVisible', (taskTitle: string) => {
  cy.contains(taskTitle).should('be.visible');
});

Cypress.Commands.add('verifyTaskNotVisible', (taskTitle: string) => {
  cy.contains(taskTitle).should('not.exist');
});

declare global {
  namespace Cypress {
    interface Chainable {
      createTask(title: string, description?: string): Chainable<void>;
      updateTaskStatus(taskTitle: string, newStatus: string): Chainable<void>;
      deleteTask(taskTitle: string): Chainable<void>;
      verifyTaskVisible(taskTitle: string): Chainable<void>;
      verifyTaskNotVisible(taskTitle: string): Chainable<void>;
    }
  }
}

export {};
