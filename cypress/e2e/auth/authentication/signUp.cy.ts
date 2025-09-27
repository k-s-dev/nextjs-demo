import { routes } from "@/lib/utils/routeMapper";

before(() => {
  // visit routes to avoid timeouts with dev server due to compilation
  cy.visit(routes.generic.home);
  cy.visit(routes.authentication.signUp);
});

beforeEach(() => {
  cy.task("db:seed");
});

describe("SignUp flow", () => {
  it("should navigate to the Sign up page", () => {
    cy.visit(routes.authentication.signUp);
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signUp");
  });

  it("should signUp new user", () => {
    cy.visit(routes.authentication.signUp);
    cy.getByData("signUp-email").type("test-user-04@example.com");
    cy.getByData("signUp-password").type("12345678");
    cy.getByData("signUp-confirmPassword").type("12345678");
    cy.getByData("signUp-btn").click();
    cy.getByData("signUp-success-message").should("be.visible");
  });

  it("should not signUp existing user", () => {
    cy.visit(routes.authentication.signUp);
    cy.getByData("signUp-email").type("test-user-01@example.com");
    cy.getByData("signUp-password").type("12345678");
    cy.getByData("signUp-confirmPassword").type("12345678");
    cy.getByData("signUp-btn").click();
    cy.get(".form-error-item").should("be.visible");
  });

  it.skip("should verify email", () => {
    const email = "test-user-04@example.com";
    cy.visit(routes.authentication.signUp);
    cy.getByData("signUp-email").type(email);
    cy.getByData("signUp-password").type("12345678");
    cy.getByData("signUp-confirmPassword").type("12345678");
    cy.getByData("signUp-btn").click();
    // get token
    // construct verify-email route with token
    // visit verfify-email page
    // confirm email verfied using displayed confirmation message
  });
});
