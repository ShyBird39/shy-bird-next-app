import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths = ['/login', '/api/auth/login'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }
  
  // Check for auth token
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    await jwtVerify(token, secret);
    
    return NextResponse.next();
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};