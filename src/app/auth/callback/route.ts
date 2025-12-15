import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('🔵 Callback [PROD]:', {
    hasCode: !!code,
    host: requestUrl.host,
    origin: requestUrl.origin,
  });

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/sign-in`);
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // ⭐ Pastikan cookie settings cocok untuk production
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax', // PENTING untuk OAuth
            secure: process.env.NODE_ENV === 'production', // HTTPS di production
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
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log('🔐 Exchange [PROD]:', {
    success: !!data.session,
    hasUser: !!data.user,
    error: error?.message,
  });

  if (error) {
    console.error('❌ OAuth error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/sign-in`);
  }

  // Buat redirect response baru
  const redirectResponse = NextResponse.redirect(
    `${requestUrl.origin}/dashboard`
  );

  // Copy cookies
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set({
      ...cookie,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  });

  console.log('✅ Redirecting to dashboard [PROD]');

  return redirectResponse;
}
