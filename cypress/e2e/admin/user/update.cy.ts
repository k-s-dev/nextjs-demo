import { Prisma } from "@/generated/prisma/client";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task<Prisma.UserModel>("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "update");
    })
    .as("user01UrlUpdate");
  cy.task<Prisma.UserModel>("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user01UrlDetail");
});

describe("admin.user.update flow", () => {
  it("should not navigate to the /user/update page without authentication", () => {
    cy.get<string>("@user01UrlUpdate").then((url) => {
      cy.visit(url);
    });
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it(
    "should not navigate to /user/update page without superuser authentication",
    { retries: { runMode: 4 } },
    () => {
      cy.visit(routes.authentication.signIn);
      cy.confirmSignIn("test-user-02@example.com", "12345678");
      cy.get<string>("@user01UrlUpdate").then((url) => {
        cy.visit(url);
      });
      cy.contains(ERROR_MESSAGES.unauthorized).should("exist");
    },
  );

  it(
    "should navigate to user/update page with superuser authentication",
    { retries: { runMode: 4 } },
    () => {
      cy.visit(routes.authentication.signIn);
      cy.confirmSignIn("test-user-01@example.com", "12345678");
      cy.get<string>("@user01UrlUpdate").then((url) => {
        cy.visit(url);
        cy.location("pathname").should("eq", url);
      });
      cy.get("#user-update-form").should("be.visible");
    },
  );

  it(
    "should update user with superuser authentication",
    { retries: { runMode: 4 } },
    () => {
      cy.visit(routes.authentication.signIn);
      cy.confirmSignIn("test-user-01@example.com", "12345678");
      cy.get<string>("@user01UrlUpdate").then((url) => {
        cy.visit(url);
      });
      cy.get('input[name="name"]').as("input").type("superuser 01");
      cy.getByData("save-user-updates-button").eq(0).click();
      cy.get("@user01UrlDetail").then((url) => {
        cy.location("pathname").should("eq", url);
      });
    },
  );
});
