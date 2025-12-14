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
        // Supabase otomatis membaca hash fragment dari URL
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          setTimeout(() => router.push('/auth/error'), 2000);
          return;
        }

        if (session) {
          console.log('Login berhasil:', session.user.email);
          router.push('/dashboard');
        } else {
          console.log('No session found');
          router.push('/');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('Terjadi kesalahan saat memproses login');
        setTimeout(() => router.push('/auth/error'), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center p-8 bg-white rounded-lg shadow-md'>
        {error ? (
          <>
            <div className='text-red-500 text-xl mb-4'>⚠️</div>
            <h2 className='text-xl font-semibold mb-2 text-red-600'>Error</h2>
            <p className='text-gray-600'>{error}</p>
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
