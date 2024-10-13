describe("simulator loads", () => {
  it("successfully loads the home page", () => {
    cy.visit("/#/");
    cy.contains("h4", " Remote freelancer from Portugal 🇵🇹");
  });
});

describe("pass income to url parameters", () => {
  it("successfully save a new simulation", () => {
    const simulationName = 'Rendimento líquido em 2023';

    cy.visit("/#/");
    cy.get('[data-cy="simulations-menu"]').should('not.exist');
    cy.get('[data-cy="income"]').type("55000");
    cy.get('[data-cy="save-simulation-button"]').click();
    cy.get('[data-cy="simulation-name"]').type(simulationName);
    cy.get('[data-cy="save-new-simulation-button"]').click();
    cy.get('[data-cy="simulations-menu"]').should('exist');
    cy.get('[data-cy="simulations-menu"]').click();
    cy.contains("p", simulationName);
    cy.get('[data-cy="open-simulation"]').click();
    cy.url().should("include", "?income=55000");
    cy.get('[data-cy="income"]').should('have.value', '55 000');
    cy.get('[data-cy="simulations-menu"]').click();
    cy.get('[data-cy="delete-simulation"]').click();
    cy.get('[data-cy="simulations-menu"]').should('not.exist');
  })
});
