import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAuthCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};
