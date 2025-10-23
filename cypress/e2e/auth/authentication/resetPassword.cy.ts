import { routes } from "@/lib/utils/routeMapper";

describe("Reset password flow", () => {
  it("should reset password for valid user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("reset_password-btn").click();
    cy.getByData("form-message-item")
      .eq(0)
      .should("contain", "check your email for the reset link");
  });

  it("should not reset password for unverified user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-03@example.com");
    cy.getByData("reset_password-btn").click();
    cy.getByData("form-error-item").eq(0).should("be.visible");
  });

  it("should not reset password for invalid user", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-03@example.com");
    cy.getByData("reset_password-btn").click();
    cy.getByData("form-error-item").eq(0).should("be.visible");
  });
});
