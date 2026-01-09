describe('Création de tâches', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('SC-001: Créer une tâche avec titre et description', () => {
    // Saisir les données
    cy.get('input[placeholder*="Titre"]').type('Faire les courses');
    cy.get('textarea[placeholder*="Description"]').type('Lait, œufs, pain');
    
    // Soumettre
    cy.get('button:contains("Ajouter")').click();
    
    // Vérifier
    cy.contains('Faire les courses').should('be.visible');
    cy.contains('PENDING').should('be.visible');
  });

  it('SC-002: Créer une tâche avec date d\'échéance', () => {
    // Saisir les données
    cy.get('input[placeholder*="Titre"]').type('Tâche importante');
    cy.get('input[type="date"]').type('2026-02-15');
    
    // Soumettre
    cy.get('button:contains("Ajouter")').click();
    
    // Vérifier
    cy.contains('Tâche importante').should('be.visible');
  });

  it('SC-003: Erreur - Créer sans titre', () => {
    // Ne pas saisir de titre
    cy.get('textarea[placeholder*="Description"]').type('Description seule');
    
    // Soumettre
    cy.get('button:contains("Ajouter")').click();
    
    // Vérifier l'erreur
    cy.contains('obligatoire').should('be.visible');
  });

  it('SC-004: Erreur - Titre trop court', () => {
    // Saisir un titre trop court
    cy.get('input[placeholder*="Titre"]').type('ab');
    
    // Soumettre
    cy.get('button:contains("Ajouter")').click();
    
    // Vérifier l'erreur
    cy.contains('au moins 3').should('be.visible');
  });
});
