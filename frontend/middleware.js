export const ROOT = '/';
export const PUBLIC_ROUTES = ['/', "/login"];
export const DEFAULT_REDIRECT = '/dashboard';
import NextAuth from "next-auth";
import { authConfig } from "./auth.config.ts";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

    if (nextUrl.pathname !== "/login") {
        if (isPublicRoute && isAuthenticated)
            return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }

    if (!isAuthenticated && !isPublicRoute)
        return Response.redirect(new URL(ROOT, nextUrl));
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};