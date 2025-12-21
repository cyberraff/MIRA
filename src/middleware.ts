import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // If the user attempts to access an admin route without the ADMIN role,
        // we can optionally redirect them to a specific page or just let withAuth handle it (which denies access).
        // Here we just let the authorized callback handle the boolean logic.
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                if (req.nextUrl.pathname.startsWith("/admin")) {
                    return token?.role === "ADMIN";
                }
                // For other protected routes (if any), generally require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
