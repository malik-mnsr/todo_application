describe('Task Update E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.wait(1000);
  });

  it('should update task title', () => {
    // Create a task first
    cy.get('input[placeholder="Titre"]').type('Old Title');
    cy.get('textarea[placeholder="Description"]').type('Test description');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Click edit button
    cy.contains('Old Title').parent().contains('button', '✎').click();
    cy.wait(500);

    // Clear and update title
    cy.get('input[placeholder="Titre"]').clear().type('New Title');
    cy.contains('button', 'Mettre à jour').click();
    cy.wait(500);

    // Verify update
    cy.contains('New Title').should('be.visible');
  });

  it('should not allow empty title on update', () => {
    // Create task
    cy.get('input[placeholder="Titre"]').type('Test Title');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Edit task
    cy.contains('Test Title').parent().contains('button', '✎').click();
    cy.wait(500);

    // Clear title
    cy.get('input[placeholder="Titre"]').clear();
    cy.contains('button', 'Mettre à jour').click();

    // Verify error
    cy.contains('obligatoire').should('be.visible');
  });

  it('should update task description', () => {
    cy.get('input[placeholder="Titre"]').type('Task Title');
    cy.get('textarea[placeholder="Description"]').type('Old description');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    cy.contains('Task Title').parent().contains('button', '✎').click();
    cy.wait(500);

    cy.get('textarea[placeholder="Description"]').clear().type('New description');
    cy.contains('button', 'Mettre à jour').click();
    cy.wait(500);

    cy.contains('New description').should('be.visible');
  });

  it('should preserve status when updating', () => {
    cy.get('input[placeholder="Titre"]').type('Status Test');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Change status to IN_PROGRESS
    cy.contains('Status Test').parent().contains('button', 'IN_PROGRESS').click();
    cy.wait(500);

    // Edit title
    cy.contains('Status Test').parent().contains('button', '✎').click();
    cy.wait(500);
    cy.get('input[placeholder="Titre"]').clear().type('Updated Title');
    cy.contains('button', 'Mettre à jour').click();
    cy.wait(500);

    // Verify status is still IN_PROGRESS
    cy.contains('Updated Title').parent().contains('IN_PROGRESS').should('be.visible');
  });
});
