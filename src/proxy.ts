import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Renamed from `middleware.ts` per the Next.js 16 `proxy` convention.
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

// "/" is the public marketing/landing page — stays reachable signed-out.
// Everything else (the library, a book's page, capture) needs a session.
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// Without live Clerk keys the app still runs end-to-end against a fixed
// demo user (see src/lib/auth.ts) — no auth gate to get in the way locally.
export const proxy = clerkConfigured
  ? clerkMiddleware((auth, req) => {
      if (!isPublicRoute(req)) {
        auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
