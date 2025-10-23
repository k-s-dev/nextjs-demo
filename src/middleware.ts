import { NextRequest, NextResponse } from "next/server";

// TODO: review eslint disable
// eslint-disable-next-line
export default function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Read more: https://clerk.com/docs/quickstarts/nextjs#add-clerk-middleware-to-your-app
// route matcher to include/exclude middleware on certain paths
export const config = {
  runtime: 'nodejs',
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
