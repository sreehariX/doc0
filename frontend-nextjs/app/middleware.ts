import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Apply to requests to the root path only
  const url = request.nextUrl.clone();
  
  // If it's a direct API call, don't redirect
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect any old bookmarked routes to new ones
  if (url.pathname === '/' && url.searchParams.has('oldChat')) {
    url.pathname = '/chat';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/:path*'],
}; 