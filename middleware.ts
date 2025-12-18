import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk OAuth callbacks, API routes, dan halaman publik
  const isAuthCallback = pathname.startsWith('/auth/callback');
  const isApiRoute = pathname.startsWith('/api/');
  const isPublicPath = pathname === '/';

  if (isAuthCallback || isApiRoute || isPublicPath) {
    return NextResponse.next();
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cek cookies autentikasi Supabase
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some(
    (cookie) =>
      cookie.name.startsWith('sb-') &&
      cookie.name.includes('auth-token') &&
      cookie.value &&
      cookie.value.length > 0
  );

  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
  const isDashboard = pathname.startsWith('/dashboard');

  // Redirect ke sign-in jika mencoba akses dashboard tanpa auth
  if (isDashboard && (!hasAuthCookie || !user)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect ke dashboard jika sudah login dan mencoba akses halaman auth
  if (isAuthPage && hasAuthCookie && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
