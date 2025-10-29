import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: headers,
    },
  });
}

// Read more: https://clerk.com/docs/quickstarts/nextjs#add-clerk-middleware-to-your-app
// route matcher to include/exclude middleware on certain paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
