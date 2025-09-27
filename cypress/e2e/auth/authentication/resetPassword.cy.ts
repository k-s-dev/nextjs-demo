import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");
});

describe("Reset password flow", () => {
  it("should reset password for valid user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("reset_password-btn").click();
    cy.get(".form-message-item").should("be.visible");
  });

  it("should not reset password for unverfied user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-03@example.com");
    cy.getByData("reset_password-btn").click();
    cy.get(".form-error-item").should("be.visible");
  });

  it("should not reset password for invalid user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-03@example.com");
    cy.getByData("reset_password-btn").click();
    cy.get(".form-error-item").should("be.visible");
  });
});
