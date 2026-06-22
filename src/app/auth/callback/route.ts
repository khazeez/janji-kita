import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getProfileByUserId, createProfile } from '@/models/profiles';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const intent = requestUrl.searchParams.get('intent');
  const error = requestUrl.searchParams.get('error');
  const origin = requestUrl.origin;

  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=no_code`);
  }

  try {
    const supabase = await createClient();
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/sign-in?error=exchange_failed`);
    }

    if (!data.session) {
      return NextResponse.redirect(`${origin}/sign-in?error=no_session`);
    }

    const user = data.session.user;

    // For sign-in intent, check if profile exists
    if (intent === 'signin') {
      const profile = await getProfileByUserId(user.id);
      if (!profile) {
        // User hasn't signed up yet — sign them out and redirect
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/sign-up?error=belum_daftar`
        );
      }
    }

    // For sign-up intent, create profile if not exists
    if (intent === 'signup') {
      const profile = await getProfileByUserId(user.id);
      if (!profile) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'User';
        await createProfile(user.id, user.email || '', fullName);
      }
    }

    const response = NextResponse.redirect(`${origin}/dashboard`);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (err) {
    return NextResponse.redirect(`${origin}/sign-in?error=unexpected`);
  }
}
