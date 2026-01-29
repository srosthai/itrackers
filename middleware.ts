// =====================================================
// NEXT.JS MIDDLEWARE
// 
// Protects dashboard routes - requires authentication
// Uses Node.js runtime to support bcryptjs and googleapis
// =====================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Use Node.js runtime instead of Edge
export const config = {
    runtime: 'nodejs',
    matcher: [
        // Protected routes
        '/dashboard/:path*',
        '/transactions/:path*',
        '/accounts/:path*',
        '/categories/:path*',
        '/budgets/:path*',
        '/settings/:path*',
        // Auth routes
        '/login',
        '/register',
    ],
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for session token (NextAuth stores it as a cookie)
    const sessionToken = request.cookies.get('authjs.session-token')?.value
        || request.cookies.get('__Secure-authjs.session-token')?.value;

    // Protected routes
    const protectedPaths = ['/dashboard', '/transactions', '/accounts', '/categories', '/budgets', '/settings'];
    const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

    // Auth routes (login, register)
    const authPaths = ['/login', '/register'];
    const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

    // Redirect logged-in users away from auth pages
    if (isAuthRoute && sessionToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to login
    if (isProtectedRoute && !sessionToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
