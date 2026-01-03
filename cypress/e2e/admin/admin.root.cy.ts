import { ERROR_MESSAGES } from "@/lib/constants/others";
import { routes } from "@/lib/utils/routeMapper";

describe("admin flow", () => {
  it("should not navigate to the admin page without authentication", () => {
    cy.visit(routes.admin.root);
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should not navigate to admin page without superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.confirmSignIn("test-user-02@example.com", "12345678");
    cy.visit(routes.admin.root);
    cy.contains(ERROR_MESSAGES.unauthorized).should("be.visible");
  });

  it("should navigate to admin page with superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.confirmSignIn("test-user-01@example.com", "12345678");
    cy.visit(routes.admin.root);
    cy.location("pathname").should("eq", "/admin");
    cy.get("h1").should("have.text", "Models");
  });
});
