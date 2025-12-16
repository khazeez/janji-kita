import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('🔵 AUTH CALLBACK TRIGGERED');

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  const origin = requestUrl.origin;

  console.log('📍 Callback URL:', requestUrl.href);
  console.log('🔑 Code:', code ? 'EXISTS' : 'NOT FOUND');
  console.log('❌ Error:', error);
  console.log('📝 Error Description:', error_description);

  if (error) {
    console.error('❌ OAuth Error:', error, error_description);
    return NextResponse.redirect(`${origin}/sign-in?error=${error}`);
  }

  if (!code) {
    console.error('❌ No code in callback');
    return NextResponse.redirect(`${origin}/sign-in?error=no_code`);
  }

  try {
    const supabase = await createClient();
    console.log('✅ Supabase client created');

    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('❌ Exchange error:', exchangeError);
      return NextResponse.redirect(`${origin}/sign-in?error=exchange_failed`);
    }

    if (!data.session) {
      console.error('❌ No session returned');
      return NextResponse.redirect(`${origin}/sign-in?error=no_session`);
    }

    console.log('✅ Session created successfully!');
    console.log('👤 User:', data.session.user.email);
    console.log('🕐 Expires:', data.session.expires_at);

    const response = NextResponse.redirect(`${origin}/dashboard`);

    // Force refresh untuk ensure cookies ter-set
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate'
    );

    console.log('🚀 Redirecting to dashboard');
    return response;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return NextResponse.redirect(`${origin}/sign-in?error=unexpected`);
  }
}
