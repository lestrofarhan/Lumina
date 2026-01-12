import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    // Changed name from middleware to proxy
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";

    // If trying to access admin routes and not an admin, redirect
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      // Use req.nextUrl for the base to ensure correct domain handling
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // User must be logged in
    },
  }
);

export const config = { matcher: ["/admin/:path*"] };
