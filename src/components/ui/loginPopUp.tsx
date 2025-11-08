'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300'
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className='relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>Welcome Back!</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Body */}
        <div className='p-6 space-y-6'>
          {/* Email */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='email'
                placeholder='Masukkan email kamu'
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
            </div>
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Masukkan password kamu'
                className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                className='w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500'
              />
              <span className='text-gray-600'>Ingatkan saya</span>
            </label>
            <button className='text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200'>
              Lupa Password?
            </button>
          </div>

          {/* Login Button */}
          <button className='w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md shadow-pink-500/25'>
            Sign In
          </button>

          {/* Divider */}
          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                atau lanjut dengan
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className='flex w-full'>
            <button className='flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 space-x-3'>
              {/* Google Logo */}
              <svg className='w-5 h-5' viewBox='0 0 533.5 544.3'>
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
              <span className='text-sm font-medium text-gray-700'>
                Lanjutkan dengan google
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className='p-6 border-t border-gray-200 text-center'>
          <p className='text-sm text-gray-600'>
           Tidak punya akun?
            <Link href='/sign-up' className='text-pink-500 hover:text-pink-600 font-medium ml-1 transition-colors duration-200'>
              daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
