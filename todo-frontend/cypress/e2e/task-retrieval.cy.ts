describe('Task Retrieval E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.wait(1000);
  });

  it('should load and display all tasks on startup', () => {
    // Tasks should be visible on page load
    cy.get('[class*="task"]').should('have.length.greaterThan', 0);
  });

  it('should display task list with all attributes', () => {
    cy.get('input[placeholder="Titre"]').type('Complete Task');
    cy.get('textarea[placeholder="Description"]').type('Full task details');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    cy.contains('Complete Task').should('be.visible');
    cy.contains('Full task details').should('be.visible');
    cy.contains('PENDING').should('be.visible');
  });

  it('should refresh and reload task list', () => {
    cy.get('input[placeholder="Titre"]').type('Task for Refresh');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Verify task is visible
    cy.contains('Task for Refresh').should('be.visible');

    // Reload the page
    cy.reload();
    cy.wait(1000);

    // Task should still be visible
    cy.contains('Task for Refresh').should('be.visible');
  });

  it('should maintain task order (newest first)', () => {
    // Create task 1
    cy.get('input[placeholder="Titre"]').type('First Task');
    cy.contains('button', 'Ajouter').click();
    cy.wait(300);

    // Create task 2
    cy.get('input[placeholder="Titre"]').type('Second Task');
    cy.contains('button', 'Ajouter').click();
    cy.wait(300);

    // Second task should appear before first task
    cy.contains('Second Task').parent().then(secondTask => {
      cy.contains('First Task').parent().then(firstTask => {
        expect(secondTask.index()).toBeLessThan(firstTask.index());
      });
    });
  });

  it('should handle empty task list gracefully', () => {
    // Delete all tasks if they exist
    cy.get('[class*="task"]').each(($task) => {
      cy.wrap($task).find('button[class*="delete"]').click();
      cy.wait(300);
    });

    // Check for empty state message or empty list
    // Either should show "no tasks" message or empty grid
    cy.get('[class*="task"]').should('have.length', 0);
  });
});
