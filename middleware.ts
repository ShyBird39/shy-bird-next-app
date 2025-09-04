import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths = ['/login', '/api/auth/login'];

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    
    // Allow public paths
    if (publicPaths.some(p => path.startsWith(p))) {
      return NextResponse.next();
    }
    
    // Check for auth token
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Verify token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-shy-bird-2024');
      await jwtVerify(token, secret);
      
      return NextResponse.next();
    } catch (jwtError) {
      // Invalid token
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    // If there's any error in middleware, let the request through
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - api/auth (auth endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)',
  ],
};