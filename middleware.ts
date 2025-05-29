import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is not approved and trying to access protected routes
    if (token?.needsApproval && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/pendingApproval", req.url));
    }

    // If user is approved and trying to access pending approval page
    if (token?.isApproved && pathname === "/pendingApproval") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes
        if (pathname.startsWith("/auth/") || pathname === "/") {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/pending-approval"],
};
