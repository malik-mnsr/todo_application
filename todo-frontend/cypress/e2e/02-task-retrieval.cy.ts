describe('Consultation de tâches', () => {
  beforeEach(() => {
    cy.visit('/');
    // Créer une tâche de test
    cy.get('input[placeholder*="Titre"]').type('Tâche Test');
    cy.get('button:contains("Ajouter")').click();
  });

  it('SC-005: Récupérer toutes les tâches', () => {
    // La page devrait afficher les tâches
    cy.get('.task-card').should('have.length.greaterThan', 0);
  });

  it('SC-006: Consulter une tâche', () => {
    // Vérifier qu'une tâche est visible
    cy.contains('Tâche Test').should('be.visible');
    cy.contains('PENDING').should('be.visible');
  });
});
