import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check jika ada cookie auth Supabase
  // Format cookie name: sb-{project-ref}-auth-token
  const allCookies = request.cookies.getAll();
  const hasAuthToken = allCookies.some(
    (cookie) =>
      cookie.name.startsWith('sb-') &&
      cookie.name.includes('auth-token') &&
      cookie.value !== ''
  );

  const isAuthPage =
    request.nextUrl.pathname === '/sign-in' ||
    request.nextUrl.pathname === '/sign-up';
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  console.log('Middleware check:', {
    path: request.nextUrl.pathname,
    hasAuthToken,
    isAuthPage,
    isDashboard,
  });

  // Redirect ke sign-in jika tidak ada token dan mengakses dashboard
  if (isDashboard && !hasAuthToken) {
    console.log('❌ No auth token, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect ke dashboard jika sudah login dan mengakses halaman auth
  if (isAuthPage && hasAuthToken) {
    console.log('✅ Already logged in, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};
