import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");
});

describe("admin flow", () => {
  it("should not navigate to the admin page without authentication", () => {
    cy.visit(routes.admin.root);
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should not navigate to admin page without superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-02@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.visit(routes.admin.root);
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should navigate to admin page with superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.visit(routes.admin.root);
    cy.location("pathname").should("eq", "/admin");
    cy.get("h1").should("have.text", "Models");
  });
});
