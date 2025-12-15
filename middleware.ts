import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk OAuth callbacks dan API routes
  const isAuthCallback = pathname.startsWith('/auth/callback');
  const isApiRoute = pathname.startsWith('/api/');
  const isPublicPath = pathname === '/';

  if (isAuthCallback || isApiRoute || isPublicPath) {
    return NextResponse.next();
  }

  // Cek Supabase auth cookies (works untuk semua OAuth providers)
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some((cookie) => {
    return (
      cookie.name.startsWith('sb-') &&
      cookie.name.includes('auth-token') &&
      cookie.value &&
      cookie.value.length > 0
    );
  });

  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
  const isDashboard = pathname.startsWith('/dashboard');

  // Redirect ke sign-in jika mencoba akses dashboard tanpa auth
  if (isDashboard && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect ke dashboard jika sudah login dan mencoba akses auth pages
  if (isAuthPage && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
