import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk:
  // - OAuth callbacks
  // - API routes
  // - Halaman publik (/, /sign-in, /sign-up)
  const isAuthCallback = pathname.startsWith('/auth/callback');
  const isApiRoute = pathname.startsWith('/api/');
  const isPublicPath =
    pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up';

  if (isAuthCallback || isApiRoute || isPublicPath) {
    return NextResponse.next();
  }

  // Dashboard akan dicek di client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
