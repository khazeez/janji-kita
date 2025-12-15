import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('🔵 Callback route hit:', {
    hasCode: !!code,
    url: requestUrl.href,
  });

  if (!code) {
    console.log('❌ No code found, redirecting to sign-in');
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
          console.log('🍪 Setting cookie:', name);
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          console.log('🗑️ Removing cookie:', name);
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

  console.log('🔐 Exchange result:', {
    hasSession: !!data.session,
    hasUser: !!data.user,
    error: error?.message,
  });

  if (error) {
    console.error('❌ OAuth error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/sign-in`);
  }

  // Log cookies yang akan di-set
  console.log('📦 Response cookies:', response.cookies.getAll());

  // PENTING: Buat response redirect BARU dengan cookies yang sudah di-set
  const redirectResponse = NextResponse.redirect(
    `${requestUrl.origin}/dashboard`
  );

  // Copy semua cookies dari response lama ke response redirect
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  console.log('✅ Redirecting to dashboard with cookies');

  return redirectResponse;
}
