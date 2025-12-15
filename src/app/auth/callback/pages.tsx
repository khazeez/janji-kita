'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse hash fragment
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log('🔍 Access Token:', accessToken ? 'Found' : 'Not found');
        console.log('🔍 Refresh Token:', refreshToken ? 'Found' : 'Not found');

        if (accessToken && refreshToken) {
          // Set session dari token
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            setError(error.message);
            setTimeout(() => router.push('/sign-in'), 2000);
            return;
          }

          if (data.session) {
            console.log('✅ Login berhasil:', data.session.user.email);
            // Redirect ke dashboard
            router.push('/dashboard');
          }
        } else {
          console.log('❌ No tokens in URL');
          setError('Token tidak ditemukan');
          setTimeout(() => router.push('/sign-in'), 2000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('Terjadi kesalahan saat memproses login');
        setTimeout(() => router.push('/sign-in'), 2000);
      }
    };

    // Tunggu sebentar untuk memastikan hash fragment sudah ada
    setTimeout(handleCallback, 100);
  }, [router]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center p-8 bg-white rounded-lg shadow-md'>
        {error ? (
          <>
            <div className='text-red-500 text-xl mb-4'>⚠️</div>
            <h2 className='text-xl font-semibold mb-2 text-red-600'>Error</h2>
            <p className='text-gray-600'>{error}</p>
            <p className='text-sm text-gray-500 mt-2'>
              Mengalihkan ke halaman login...
            </p>
          </>
        ) : (
          <>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold mb-2'>Memproses login...</h2>
            <p className='text-gray-600'>Mohon tunggu sebentar</p>
          </>
        )}
      </div>
    </div>
  );
}
