import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");
  cy.task("db:getUserByEmail", "test-user-02@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "update");
    })
    .as("user02UrlUpdate");
  cy.task("db:getUserByEmail", "test-user-02@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user02UrlDetail");
  cy.task("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user01UrlDetail");
});

describe("admin.user.delete flow", () => {
  it("should not delete user when signIn as non superuser", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-02@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.get("@user01UrlDetail").then((url) => {
      cy.visit(url);
      cy.document().should("not.be.visible");
    });
  });

  it("should delete single user when signIn as superuser", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.get("@user02UrlDetail").then((url) => {
      cy.visit(url);
    });
    cy.get("button.form-btn-delete").eq(0).click();
    cy.get("button.delete-modal-btn--confirm").click();
    cy.visit(routes.admin.user.read);
    cy.get(".table-cell")
      .contains("test-user-02@example.com")
      .should("not.be.true");
  });

  it("should delete many users when signed in as superuser");
});
