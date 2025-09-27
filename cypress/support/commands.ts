Cypress.Commands.add("getByData", (selector, ...args) => {
  return cy.get(`[data-test-cy=${selector}]`, ...args);
});

Cypress.on("uncaught:exception", (err) => {
  // Return false to prevent Cypress from failing the test
  // when a NEXT_REDIRECT error is encountered.
  if (err.message.includes("NEXT_REDIRECT")) {
    return false;
  }

  // Allow other uncaught exceptions to fail the test as usual.
  return true;
});
