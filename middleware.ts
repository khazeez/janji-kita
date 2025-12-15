import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  console.log('🟡 Middleware hit:', request.nextUrl.pathname);

  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase env missing');
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        const value = request.cookies.get(name)?.value;
        console.log(
          '🍪 Middleware reading cookie:',
          name,
          value ? 'EXISTS' : 'MISSING'
        );
        return value;
      },
      set(name: string, value: string, options: any) {
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        response.cookies.set({
          name,
          value: '',
          maxAge: 0,
          ...options,
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('👤 Middleware user check:', {
    path: request.nextUrl.pathname,
    hasUser: !!user,
    userId: user?.id,
    allCookies: request.cookies.getAll().map((c) => c.name),
  });

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard && !user) {
    console.log('🚫 No user, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && user) {
    console.log('✅ User exists on auth page, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('✅ Middleware passed');
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/auth/callback'],
};
