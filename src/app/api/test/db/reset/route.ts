import { DbError } from "@/lib/utils/errors";
import { execSync } from "node:child_process";

export function DELETE() {
  try {
    execSync("npm run test:prisma:reset", {
      stdio: "inherit",
    });
  } catch (error) {
    throw new DbError({
      message: "Test db reset failed.",
      cause: error as Error,
    });
  }
  return new Response("Test db reset succeeded.", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      // "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
