describe('Task Deletion E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.wait(1000);
  });

  it('should delete a task', () => {
    cy.get('input[placeholder="Titre"]').type('Task to Delete');
    cy.get('textarea[placeholder="Description"]').type('This task will be deleted');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Verify task is visible
    cy.contains('Task to Delete').should('be.visible');

    // Delete the task
    cy.contains('Task to Delete').parent().contains('button', '🗑').click();
    cy.wait(500);

    // Verify task is deleted
    cy.contains('Task to Delete').should('not.exist');
  });

  it('should delete multiple tasks', () => {
    // Create first task
    cy.get('input[placeholder="Titre"]').type('Delete Task 1');
    cy.contains('button', 'Ajouter').click();
    cy.wait(300);

    // Create second task
    cy.get('input[placeholder="Titre"]').type('Delete Task 2');
    cy.contains('button', 'Ajouter').click();
    cy.wait(300);

    // Delete first task
    cy.contains('Delete Task 1').parent().contains('button', '🗑').click();
    cy.wait(500);

    // Verify first is deleted but second exists
    cy.contains('Delete Task 1').should('not.exist');
    cy.contains('Delete Task 2').should('be.visible');

    // Delete second task
    cy.contains('Delete Task 2').parent().contains('button', '🗑').click();
    cy.wait(500);

    cy.contains('Delete Task 2').should('not.exist');
  });

  it('should show confirmation or handle gracefully', () => {
    cy.get('input[placeholder="Titre"]').type('Confirm Delete');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Attempt deletion
    cy.contains('Confirm Delete').parent().contains('button', '🗑').click();
    cy.wait(500);

    // Task should be gone
    cy.contains('Confirm Delete').should('not.exist');
  });
});
