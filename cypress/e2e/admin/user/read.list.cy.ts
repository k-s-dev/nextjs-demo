import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");
});

describe("admin.user.read flow", () => {
  it("should not navigate to the /user/list page without authentication", () => {
    cy.visit(routes.admin.user.read);
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should not navigate to /user/list page without superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-02@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.visit(routes.admin.user.read);
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should navigate to user/list page with superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.visit(routes.admin.user.read);
    cy.location("pathname").should("eq", "/admin/user/list");
    cy.get("h1").should("contain.text", "User");
  });
});
