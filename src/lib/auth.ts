import { supabase } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

// Check if user is logged in
export async function isLoggedIn(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Get current session
export async function getSession(): Promise<Session | null> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Get access token
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

// Sign up with email
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { [key: string]: any }
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Additional user metadata
      },
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { user: null, error: error.message };
  }
}

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { user: null, session: null, error: error.message };
  }
}

// Sign up with Google
export async function signUpWithGoogle() {
  try {
    
    const isProduction = window.location.hostname !== 'localhost';
    const redirectTo = isProduction
      ? `${process.env.NEXT_JANJIKITA_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Google sign up error:', error);
    return { error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    const isProduction = window.location.hostname !== 'localhost';
    const redirectTo = isProduction
      ? `${process.env.NEXT_JANJIKITA_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Google sign up error:', error);
    return { error: error.message };
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return { error: error.message };
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Update password error:', error);
    return { error: error.message };
  }
}

// Update user metadata
export async function updateUserMetadata(metadata: { [key: string]: any }) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('Update metadata error:', error);
    return { user: null, error: error.message };
  }
}

// Refresh session
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw error;

    return { session: data.session, error: null };
  } catch (error: any) {
    console.error('Refresh session error:', error);
    return { session: null, error: error.message };
  }
}

// Listen to auth changes
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  // Return unsubscribe function
  return () => subscription.unsubscribe();
}

// Check if user email is verified
export async function isEmailVerified(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.email_confirmed_at !== undefined;
}

// Resend verification email
export async function resendVerificationEmail() {
  try {
    const user = await getCurrentUser();

    if (!user?.email) {
      throw new Error('No user email found');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return { error: error.message };
  }
}

// Get user role (from metadata or custom claims)
export async function getUserRole(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user?.user_metadata?.role || user?.app_metadata?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Check if user has specific role
export async function hasRole(role: string): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  return await hasRole('admin');
}

// Sign in with magic link
export async function signInWithMagicLink(email: string) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Magic link error:', error);
    return { error: error.message };
  }
}

// Verify OTP
export async function verifyOtp(email: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return { user: null, session: null, error: error.message };
  }
}
