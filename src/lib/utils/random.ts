import { randomBytes } from "node:crypto";

export function generateRandomString(nBytes = 4) {
  return randomBytes(nBytes).toString("hex");
}
