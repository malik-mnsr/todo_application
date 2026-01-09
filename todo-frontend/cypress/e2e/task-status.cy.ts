describe('Task Status Transitions E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.wait(1000);
  });

  it('should transition from PENDING to IN_PROGRESS', () => {
    cy.get('input[placeholder="Titre"]').type('Status Task 1');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Verify initial status is PENDING
    cy.contains('Status Task 1').parent().contains('PENDING').should('be.visible');

    // Click IN_PROGRESS button
    cy.contains('Status Task 1').parent().contains('button', 'IN_PROGRESS').click();
    cy.wait(500);

    // Verify status changed
    cy.contains('Status Task 1').parent().contains('IN_PROGRESS').should('be.visible');
  });

  it('should transition from IN_PROGRESS to DONE', () => {
    cy.get('input[placeholder="Titre"]').type('Status Task 2');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Change to IN_PROGRESS
    cy.contains('Status Task 2').parent().contains('button', 'IN_PROGRESS').click();
    cy.wait(500);

    // Change to DONE
    cy.contains('Status Task 2').parent().contains('button', 'DONE').click();
    cy.wait(500);

    // Verify DONE status
    cy.contains('Status Task 2').parent().contains('DONE').should('be.visible');
  });

  it('should allow backward transition DONE to IN_PROGRESS', () => {
    cy.get('input[placeholder="Titre"]').type('Status Task 3');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    // Progress to DONE
    cy.contains('Status Task 3').parent().contains('button', 'IN_PROGRESS').click();
    cy.wait(500);
    cy.contains('Status Task 3').parent().contains('button', 'DONE').click();
    cy.wait(500);

    // Go back to IN_PROGRESS
    cy.contains('Status Task 3').parent().contains('button', 'IN_PROGRESS').click();
    cy.wait(500);

    // Verify status
    cy.contains('Status Task 3').parent().contains('IN_PROGRESS').should('be.visible');
  });

  it('should show appropriate status badges', () => {
    cy.get('input[placeholder="Titre"]').type('Badge Test');
    cy.contains('button', 'Ajouter').click();
    cy.wait(500);

    cy.contains('Badge Test').parent().contains('PENDING').should('be.visible');
    cy.contains('Badge Test').parent().contains('button', 'IN_PROGRESS').click();
    cy.wait(500);
    cy.contains('Badge Test').parent().contains('IN_PROGRESS').should('be.visible');
  });
});
