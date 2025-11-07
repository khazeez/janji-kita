'use client'
import { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
  };

  return (
    <div className='min-h-screen bg-gray-950 flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden'>
        <div className='grid md:grid-cols-2'>
          {/* Left Side - Ornamental */}
          <div className='hidden md:flex bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden'>
            {/* Decorative circles */}
            <div className='absolute top-10 right-10 w-72 h-72 bg-pink-500 rounded-full opacity-20 blur-3xl'></div>
            <div className='absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl'></div>

            <div className='relative z-10'>
              <h2 className='text-5xl font-bold text-white mb-4'>
                Join Us Today
              </h2>
              <p className='text-pink-100 text-lg'>
                Create an account and unlock amazing features
              </p>
            </div>

            {/* Decorative geometric shapes */}
            <div className='relative z-10 space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-white font-semibold'>Fast & Secure</h3>
                  <p className='text-pink-100 text-sm'>
                    Your data is protected
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-white font-semibold'>Lightning Fast</h3>
                  <p className='text-pink-100 text-sm'>
                    Get started in seconds
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-white font-semibold'>
                    Fully Customizable
                  </h3>
                  <p className='text-pink-100 text-sm'>Tailor to your needs</p>
                </div>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className='relative z-10'>
              <div className='flex gap-2'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
                <div className='w-2 h-2 bg-white bg-opacity-60 rounded-full'></div>
                <div className='w-2 h-2 bg-white bg-opacity-30 rounded-full'></div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className='p-8 md:p-12 flex flex-col justify-center'>
            <div className='mb-8'>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2'>
                Create Account
              </h1>
              <p className='text-gray-400'>Sign up to get started</p>
            </div>

            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              className='w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-750 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 mb-6 border border-gray-700 hover:border-gray-600'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className='flex items-center mb-6'>
              <div className='flex-1 border-t border-gray-800'></div>
              <span className='px-4 text-gray-500 text-sm font-medium'>OR</span>
              <div className='flex-1 border-t border-gray-800'></div>
            </div>

            {/* Form Fields */}
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-pink-400 text-sm font-medium mb-2'
                >
                  Full Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
                  placeholder='John Doe'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-pink-400 text-sm font-medium mb-2'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
                  placeholder='john@example.com'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-pink-400 text-sm font-medium mb-2'
                >
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
                  placeholder='••••••••'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-pink-400 text-sm font-medium mb-2'
                >
                  Confirm Password
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
                  placeholder='••••••••'
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                className='w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-pink-500/50 mt-2'
              >
                Create Account
              </button>
            </div>

            {/* Footer */}
            <p className='text-center text-gray-400 text-sm mt-8'>
              Already have an account?{' '}
              <a
                href='#'
                className='text-pink-400 hover:text-pink-300 font-semibold transition-colors'
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
