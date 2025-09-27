"use server";

import { headers } from "next/headers";

export async function getHostUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host");
  const protocol = headerList.get("x-forwarded-proto");

  // NOTE: no trailing slash, routes mapper begin with slash
  return `${protocol}://${host}`
}
