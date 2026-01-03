import { TServerResponse } from "../types/serverResponse";

export function updateServerResponseError(
  response: TServerResponse,
  error?: string | string[],
) {
  if (!response.errors) response.errors = [];
  if (typeof error === "string") {
    response.errors.push(error);
  }
  if (Array.isArray(error)) {
    response.errors.push(...error);
  }
}
