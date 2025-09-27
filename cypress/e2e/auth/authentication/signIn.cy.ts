import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");
});

describe("SignIn flow", () => {
  it("should navigate to the Sign in page", () => {
    // Start from the index page
    cy.visit(routes.authentication.signIn);

    // The new url should include "/signIn"
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", `${routes.authentication.signIn}`);
  });

  it("should signIn verfified user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", routes.DEFAULT_LOGIN_REDIRECT);
  });

  it("should not signIn unverfified user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-03@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", routes.authentication.signIn);
    cy.get(".form-error-item").eq(0).should("exist");
  });
});
