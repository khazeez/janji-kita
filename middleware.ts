import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Jangan jalankan middleware untuk file Next.js internal
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

  const isAuthPage = ['/sign-in', '/sign-up'].includes(pathname);
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/sign-in', origin));
  }

  if (isAuthPage && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
