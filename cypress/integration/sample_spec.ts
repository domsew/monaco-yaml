describe('Marker data', () => {
  it('open editor', () => {
    cy.visit('');
  });

  it('should underline warning when type is incorrect', () => {
    cy.get('.cdr.squiggly-warning').should('have.length', 2);
  });

  it('should display warning when type is incorrect', () => {
    cy.get('.view-lines').trigger('mouseover', 30, 10);
    cy.get('.marker.hover-contents > span:nth-child(1)').should(
      'contain.text',
      'Incorrect type. Expected "number".',
    );
  });
});
