import { NextResponse } from "next/server";

import { routes } from "@/lib/utils/routeMapper";
import { authentication } from "./lib/features/authentication/config";

export default authentication((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthAPIRoute = req.nextUrl.pathname.startsWith(routes.authAPIPrefix);
  const isTestAPIRoute = Object.values(routes.api.test).includes(
    req.nextUrl.pathname,
  );
  const isPublicRoute = routes.public.some((route) => {
    return typeof route === "string" && route === req.nextUrl.pathname;
  });
  const isAuthenticationRoute = Object.values(routes.authentication).includes(
    req.nextUrl.pathname,
  );

  if (isAuthAPIRoute || isTestAPIRoute) return;

  if (!isLoggedIn) {
    if (isAuthenticationRoute) return;

    if (!isPublicRoute) {
      const redirectUrl = new URL(
        routes.authentication.signIn,
        req.nextUrl.origin,
      );
      const response = NextResponse.redirect(redirectUrl);
      return response;
    }
  }

  if (isLoggedIn) {
    if (isAuthenticationRoute) {
      const redirectUrl = new URL(
        routes.DEFAULT_LOGIN_REDIRECT,
        req.nextUrl.origin,
      );
      const response = NextResponse.redirect(redirectUrl);
      return response;
    }
  }

  return;
});

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
