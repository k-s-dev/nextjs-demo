import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");

  cy.task("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user01UrlDetail");
});

describe("admin.user.create flow", () => {
  it("should not navigate to the /user/create page without authentication", () => {
    cy.visit(routes.admin.user.create);
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should not navigate to /user/create page without superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-02@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.visit(routes.admin.user.create);
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should navigate to user/create page with superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.visit(routes.admin.user.create);
    cy.location("pathname").should("eq", "/admin/user/create");
    cy.get("h1").should("contain.text", "User: Create");
  });

  it("should create user with superuser signIn", () => {
    const userEmail = "test-user-04@example.com"
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.visit(routes.admin.user.create);
    cy.get('input[name="email"]').type(userEmail);
    cy.get("button.form-btn-submit").contains("Save").click();
    cy.location("pathname").should("eq", "/admin/user/list");
    cy.get(".table-cell").contains(userEmail).click();
    cy.location("pathname").should("contain", "/admin/user/");
    cy.location("pathname").should("contain", "/detail");
    cy.get("h1").should("contain.text", "User: Details")
  });
});
