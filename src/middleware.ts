import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isChoreographerRoute = createRouteMatcher(['/groups(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const role = (await auth()).sessionClaims?.metadata?.role;

  // Block non-admins from admin routes
  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Block everyone except admin and choreographer from groups routes
  if (isChoreographerRoute(req) && role !== 'admin' && role !== 'choreographer') {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    // Static/internal files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // All API/trpc routes
    "/(api|trpc)(.*)"
  ],
};
