describe('Task Creation E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.wait(1000);
  });

  it('should create a task with title and description', () => {
    // Fill the form
    cy.get('input[placeholder="Titre"]').type('Faire les courses');
    cy.get('textarea[placeholder="Description"]').type('Lait, œufs, pain');
    
    // Submit
    cy.contains('button', 'Ajouter').click();
    
    // Verify task is created
    cy.contains('Faire les courses').should('be.visible');
    cy.contains('Lait, œufs, pain').should('be.visible');
  });

  it('should validate title is required', () => {
    // Try to submit empty form
    cy.contains('button', 'Ajouter').click();
    
    // Verify error message
    cy.contains('obligatoire').should('be.visible');
  });

  it('should validate title minimum length', () => {
    cy.get('input[placeholder="Titre"]').type('ab');
    cy.get('textarea[placeholder="Description"]').type('Test');
    cy.contains('button', 'Ajouter').click();
    
    cy.contains('au moins 3').should('be.visible');
  });

  it('should create task with due date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];

    cy.get('input[placeholder="Titre"]').type('Tâche importante');
    cy.get('input[type="date"]').type(dateString);
    cy.contains('button', 'Ajouter').click();

    cy.contains('Tâche importante').should('be.visible');
  });

  it('should display new task with PENDING status', () => {
    cy.get('input[placeholder="Titre"]').type('Test Task');
    cy.contains('button', 'Ajouter').click();

    // Check for PENDING badge
    cy.contains('Test Task').parent().contains('PENDING').should('be.visible');
  });
});
