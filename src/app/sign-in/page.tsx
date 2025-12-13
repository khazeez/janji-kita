'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormErrors {
  email?: string;
  password?: string;
}

const DUMMY_USERS = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
  },
  {
    email: 'user@example.com',
    password: 'user1234',
    name: 'Regular User',
  },
  {
    email: 'test@example.com',
    password: 'test12345',
    name: 'Test User',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const validUser = DUMMY_USERS.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (validUser) {
        console.log('Login berhasil:', validUser);

        if (formData.rememberMe) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              email: validUser.email,
              name: validUser.name,
            })
          );
        }

        router.push('/dashboard');
      } else {
        setErrors({
          email: 'Email atau password salah!',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ email: 'Terjadi kesalahan, silakan coba lagi' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className='min-h-screen flex items-center justify-center  p-4 overflow-hidden'>
      <div className='relative bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[95vh] overflow-y-auto'>
        {/* Header */}
        <h2 className='text-xl py-10 text-center md:text-2xl font-bold text-gray-800'>
          Welcome Back!
        </h2>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className='p-4 md:p-6 space-y-4 md:space-y-6'
        >
          {/* Email */}
          <div className='space-y-2'>
            <label className='text-xs md:text-sm font-medium text-gray-700'>
              Email
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5' />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder='Masukkan email kamu'
                className={`w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 border ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-pink-500'
                } rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 outline-none text-sm md:text-base`}
              />
              {formData.email &&
                !errors.email &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <svg
                    className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-green-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
            </div>
            {focusedField === 'email' && !formData.email && (
              <p className='text-gray-400 text-xs mt-1.5 ml-1 flex items-center gap-1'>
                <svg
                  className='w-3 h-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
                Contoh: nama@email.com
              </p>
            )}
            {errors.email && (
              <p className='text-red-500 text-xs md:text-sm mt-1.5 ml-1 flex items-center gap-1'>
                <svg
                  className='w-3 h-3 md:w-4 md:h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <label className='text-xs md:text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5' />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder='Masukkan password kamu'
                className={`w-full pl-9 md:pl-10 pr-11 md:pr-12 py-2.5 md:py-3 border ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-pink-500'
                } rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 outline-none text-sm md:text-base`}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                {showPassword ? (
                  <EyeOff className='w-4 h-4 md:w-5 md:h-5' />
                ) : (
                  <Eye className='w-4 h-4 md:w-5 md:h-5' />
                )}
              </button>
            </div>
            {focusedField === 'password' && !formData.password && (
              <p className='text-gray-400 text-xs mt-1.5 ml-1 flex items-center gap-1'>
                <svg
                  className='w-3 h-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
                Masukkan password Anda (min. 8 karakter)
              </p>
            )}
            {errors.password && (
              <p className='text-red-500 text-xs md:text-sm mt-1.5 ml-1 flex items-center gap-1'>
                <svg
                  className='w-3 h-3 md:w-4 md:h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className='flex items-center justify-between text-xs md:text-sm'>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='checkbox'
                name='rememberMe'
                checked={formData.rememberMe}
                onChange={handleChange}
                className='w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500 cursor-pointer'
              />
              <span className='text-gray-600'>Ingatkan saya</span>
            </label>
            <button
              type='button'
              className='text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200'
            >
              Lupa Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 md:py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm md:text-base'
          >
            {isLoading ? (
              <>
                <svg
                  className='animate-spin h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Memproses...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-xs md:text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                atau lanjut dengan
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className='flex w-full'>
            <button
              type='button'
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className='flex items-center justify-center w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 space-x-2 md:space-x-3 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <svg className='w-4 h-4 md:w-5 md:h-5' viewBox='0 0 533.5 544.3'>
                <path
                  d='M533.5 278.4c0-17.2-1.5-34.4-4.7-51.1H272v96.7h146.9c-6.4 34.5-25.3 63.7-53.9 83.3v69.1h87.1c51-47 80.4-116.2 80.4-198z'
                  fill='#4285F4'
                />
                <path
                  d='M272 544.3c72.6 0 133.6-24.1 178.1-65.3l-87.1-69.1c-24.2 16.2-55 25.7-91 25.7-69.8 0-129-47.1-150.1-110.3H31.8v69.3c44.6 88.4 136.2 149.7 240.2 149.7z'
                  fill='#34A853'
                />
                <path
                  d='M121.9 325.3c-10.7-31.5-10.7-65.4 0-96.9V159.1H31.8c-44.6 88.4-44.6 192.4 0 280.8l90.1-69.3z'
                  fill='#FBBC05'
                />
                <path
                  d='M272 107.2c37.5-.6 71.3 13.1 97.8 38.5l73.3-73.3C405.3 24.1 344.3 0 272 0 168 0 76.4 61.3 31.8 149.7l90.1 69.3C143 154.3 202.2 107.3 272 107.2z'
                  fill='#EA4335'
                />
              </svg>
              <span className='text-xs md:text-sm font-medium text-gray-700'>
                Lanjutkan dengan Google
              </span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className='p-4 md:p-6 border-t border-gray-200 text-center'>
          <p className='text-xs md:text-sm text-gray-600'>
            Tidak punya akun?
            <Link
              href='/sign-up'
              className='text-pink-500 hover:text-pink-600 font-medium ml-1 transition-colors duration-200'
            >
              daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
