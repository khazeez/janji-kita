'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signInWithGoogle } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'belum_daftar') {
      setError('Akun tidak ditemukan. Silakan daftar terlebih dahulu.');
    }
  }, []);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle('signup');
      if (error) {
        setError('Gagal daftar dengan Google. Silakan coba lagi.');
        setIsLoading(false);
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden'>
      <div className='w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-800/50 relative z-10'>
        <div className='p-6 md:p-12'>
          <div className='mb-6 md:mb-8'>
            <h1 className='text-2xl md:text-4xl text-center font-bold bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 bg-clip-text text-transparent mb-2'>
              Yuk! bikin akun
            </h1>
            <p className='text-sm md:text-base text-center text-gray-400'>
              Daftar untuk memulai perjalananmu
            </p>
          </div>

          {error && (
            <div className='mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl'>
              <p className='text-red-400 text-sm text-center'>{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className='w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 md:py-3.5 px-4 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base'
          >
            {isLoading ? (
              <Loader2 className='w-5 h-5 animate-spin text-gray-500' />
            ) : (
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
              </svg>
            )}
            {isLoading ? 'Memproses...' : 'Lanjutkan dengan Google'}
          </button>

          <p className='text-center text-gray-400 text-xs md:text-sm mt-6 md:mt-8'>
            Sudah punya akun?{' '}
            <Link
              href='/sign-in'
              className='text-pink-500 hover:text-pink-400 font-semibold transition-colors'
            >
              Masuk
            </Link>
          </p>

          <p className='text-center text-gray-500 text-xs mt-3 md:mt-4'>
            Dengan mendaftar, Anda menyetujui{' '}
            <a href='#' className='text-pink-500 hover:underline'>
              Syarat & Ketentuan
            </a>{' '}
            dan{' '}
            <a href='#' className='text-pink-500 hover:underline'>
              Kebijakan Privasi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
