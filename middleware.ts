// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value; // Get the session token from cookies
  const { pathname } = request.nextUrl; // Get the pathname of the request

  // Check if the current route is protected
  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      // If the user is not authenticated, redirect to the login page
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the route is not protected or the user is authenticated, allow the request
  return NextResponse.next();
}
