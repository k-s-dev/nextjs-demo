import { routes } from "@/lib/utils/routeMapper";

Cypress.Commands.add("getByData", (selector, ...args) => {
  return cy.get(`[data-test-cy=${selector}]`, ...args);
});

Cypress.Commands.add("confirmSignIn", (email, password) => {
  cy.visit(routes.authentication.signIn);
  cy.getByData("signIn-email").type(email);
  cy.getByData("signIn-password").type(password);
  cy.getByData("signIn-btn").click();
  cy.intercept("POST", "api/auth/sign-in/email").as("signInRequest");
  cy.intercept("GET", "api/auth/get-session").as("sessionRequest");
  cy.wait("@signInRequest", { timeout: 10000 });
  cy.wait("@sessionRequest", { timeout: 20000 });
  cy.getByData("nav-user-avatar").should("be.visible");
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
