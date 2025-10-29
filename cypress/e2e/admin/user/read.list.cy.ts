import { routes } from "@/lib/utils/routeMapper";

describe("admin.user.read flow", () => {
  it("should not navigate to the /user/list page without authentication", () => {
    cy.visit(routes.admin.user.read);
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should not navigate to /user/list page without superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.confirmSignIn("test-user-02@example.com", "12345678");
    cy.visit(routes.admin.user.read);
    cy.contains("Unauthorized").should("exist");
  });

  it("should navigate to user/list page with superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.confirmSignIn("test-user-01@example.com", "12345678");
    cy.visit(routes.admin.user.read);
    cy.location("pathname").should("eq", "/admin/user/list");
    cy.get("#admin-user-table").should("be.visible");
  });
});
