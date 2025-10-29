import "./commands";

beforeEach(() => {
  cy.task("db:reset");
  cy.task("db:seed");
});
