import { Prisma } from "@/generated/prisma/client";
import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task<Prisma.UserModel>("db:getUserByEmail", "test-user-02@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "update");
    })
    .as("user02UrlUpdate");
  cy.task<Prisma.UserModel>("db:getUserByEmail", "test-user-02@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user02UrlDetail");
  cy.task<Prisma.UserModel>("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user01UrlDetail");
});

describe("admin.user.delete flow", () => {
  it("should not delete user when signed in as non superuser", () => {
    cy.visit(routes.authentication.signIn);
    cy.confirmSignIn("test-user-02@example.com", "12345678");
    cy.get<string>("@user01UrlDetail").then((url) => {
      cy.visit(url);
      cy.document().should("not.be.visible");
    });
  });

  it(
    "should delete single user when signed in as superuser",
    {
      retries: {
        runMode: 4,
        openMode: 0,
      },
    },
    () => {
      cy.visit(routes.authentication.signIn);
      cy.confirmSignIn("test-user-01@example.com", "12345678");
      cy.get<string>("@user02UrlDetail").then((url) => {
        cy.visit(url);
      });
      cy.getByData("delete-user-button").eq(0).click();
      cy.getByData("delete-confirmation-button").should("be.visible").click();
      cy.visit(routes.admin.user.read);
      cy.contains("test-user-02@example.com").should("not.be.true");
    },
  );

  it(
    "should not delete a superuser when signed in as superuser",
    {
      retries: {
        runMode: 4,
        openMode: 0,
      },
    },
    () => {
      cy.visit(routes.authentication.signIn);
      cy.confirmSignIn("test-user-01@example.com", "12345678");
      cy.visit(routes.admin.user.read);
      cy.getByData("select-row-1").click();
      cy.getByData("delete-all-button").eq(0).click();
      cy.getByData("delete-confirmation-button").click();
      cy.getByData("delete-confirmation-button").should("be.visible");
    },
  );

  it(
    "should delete many users when signed in as superuser",
    {
      retries: {
        runMode: 4,
        openMode: 0,
      },
    },
    () => {
      cy.visit(routes.authentication.signIn);
      cy.confirmSignIn("test-user-01@example.com", "12345678");
      cy.visit(routes.admin.user.read);
      cy.get("input[type='checkbox']").eq(2).click();
      cy.get("input[type='checkbox']").eq(3).click();
      cy.getByData("delete-all-button").eq(0).click();
      cy.getByData("delete-confirmation-button").click();
      cy.contains("test-user-01@example.com").should("be.visible");
      cy.contains("test-user-02@example.com").should("not.be.true");
    },
  );
});
