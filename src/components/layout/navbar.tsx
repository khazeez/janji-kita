'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  BookOpen,
  Info,
  FileText,
  Package,
  LogIn,
  UserPlus,
  Home,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronDown,
  LayoutDashboardIcon
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import supabase from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Catalogue', href: '/catalogue', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Product', href: '/product', icon: Package },
  ];

  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
    router.push('/');
  };

  const getFirstName = () => {
    if (!user) return 'User';
    const fullName =
      user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    return fullName.split(' ')[0];
  };

  const DonerIcon = ({ size = 70, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      className={className}
    >
      <line
        x1='4'
        y1='7'
        x2='20'
        y2='7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <line
        x1='4'
        y1='12'
        x2='16'
        y2='12'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <line
        x1='4'
        y1='17'
        x2='12'
        y2='17'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );

  return (
    <>
      {/* Navbar */}
      <header className='fixed top-0 left-0 w-full z-50 text-white shadow-lg backdrop-blur-md bg-black/20 border- leading-relaxed tracking-wide'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <Link
            href='/'
            className={clsx(
              'font-bold text-2xl transition-colors duration-200',
              isOpen ? 'text-black' : 'text-white'
            )}
          >
            <img
              src='/janjiKitaPutih.png'
              className='w-auto h-10'
              alt='JanjiKita Logo'
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8 ml-20'>
            {navigation.slice(1).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='relative group hover:text-pink-300 transition-colors duration-200 font-normal text-shadow-white py-2'
              >
                {item.name}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 group-hover:w-full transition-all duration-300 ease-out'></span>
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className='hidden md:flex items-center space-x-1'>
            {loading ? (
              // Loading state
              <div className='w-32 h-10 bg-white/10 rounded-lg animate-pulse'></div>
            ) : user ? (
              // Logged in state
              <>
                <Link
                  href='/dashboard'
                  className='p-2 text-sm bg-pink-500/20 border-1 border-pink-400  text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2'
                >
                  <LayoutDashboardIcon size={18} />
                  {/* Dashboard */}
                </Link>

                {/* Profile Dropdown */}
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className='flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-2 transition-colors'
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt='Avatar'
                        className='w-9 h-9 rounded-full border-2 border-pink-500'
                      />
                    ) : (
                      <div className='w-9 h-9 rounded-full border-2 border-pink-500 bg-gray-700 flex items-center justify-center'>
                        <User className='text-gray-300' size={18} />
                      </div>
                    )}
                    {/* <ChevronDown
                      size={16}
                      className={`text-gray-300 transition-transform ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    /> */}
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2'>
                      <div className='px-4 py-3 border-b border-gray-700'>
                        <p className='text-white font-medium text-sm truncate'>
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className='text-gray-400 text-xs truncate'>
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href='/dashboard'
                        onClick={() => setProfileDropdownOpen(false)}
                        className='w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                      >
                        <LayoutDashboard size={18} />
                        <span className='text-sm'>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => setProfileDropdownOpen(false)}
                        className='w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                      >
                        <Settings size={18} />
                        <span className='text-sm'>Pengaturan</span>
                      </button>
                      <hr className='my-2 border-gray-700' />
                      <button
                        onClick={handleLogout}
                        className='w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors'
                      >
                        <LogOut size={18} />
                        <span className='text-sm'>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Not logged in state
              <>
                <Link
                  href='/sign-in'
                  className='relative group px-4 py-2 font-medium transition-all duration-300 ease-out border border-pink-400/60 rounded-lg hover:border-transparent'
                >
                  Sign in
                  <span className='absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left'></span>
                </Link>
                <Link
                  href='/sign-up'
                  className='px-2 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg'
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className='md:hidden focus:outline-none text-white hover:text-pink-300 transition-colors duration-200'
            onClick={toggleSidebar}
            aria-label='Toggle Menu'
          >
            {isOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <DonerIcon className='w-6 h-6' />
            )}
          </button>
        </div>
      </header>

      {/* Sidebar Overlay + Content (Mobile) */}
      <div
        className={clsx(
          'fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out',
          isOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 pointer-events-none'
        )}
      >
        {/* Overlay Background */}
        <div
          className='absolute inset-0 bg-black/70 backdrop-blur-sm'
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white text-gray-800 shadow-2xl transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Sidebar Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white'>
            <Link
              href='/'
              onClick={closeSidebar}
              className='font-bold text-2xl text-gray-800'
            >
              Janji<span className='text-pink-500'>Kita</span>
            </Link>
            <button
              className='text-gray-600 hover:text-gray-800 transition-colors duration-200 p-1'
              onClick={closeSidebar}
              aria-label='Close Menu'
            >
              <X className='w-6 h-6' />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className='flex flex-col p-6'>
            <div className='space-y-2'>
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeSidebar}
                    className='relative group flex items-center space-x-4 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 overflow-hidden'
                  >
                    <IconComponent className='w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors duration-200' />
                    <span className='font-medium'>{item.name}</span>
                    <span className='absolute bottom-2 left-3 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 group-hover:w-[calc(100%-24px)] transition-all duration-300 ease-out'></span>
                  </Link>
                );
              })}
            </div>

            <div className='my-6 border-t border-gray-200'></div>

            {/* Auth Section - Mobile */}
            {loading ? (
              <div className='space-y-3'>
                <div className='h-12 bg-gray-100 rounded-xl animate-pulse'></div>
                <div className='h-12 bg-gray-100 rounded-xl animate-pulse'></div>
              </div>
            ) : user ? (
              // Logged in state - Mobile
              <div className='space-y-3'>
                {/* User Info */}
                <div className='flex items-center space-x-3 p-3 bg-pink-50 rounded-xl'>
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt='Avatar'
                      className='w-10 h-10 rounded-full border-2 border-pink-500'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full border-2 border-pink-500 bg-gray-200 flex items-center justify-center'>
                      <User className='text-gray-500' size={20} />
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-800 truncate'>
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href='/dashboard'
                  onClick={closeSidebar}
                  className='flex items-center space-x-4 p-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg group'
                >
                  <LayoutDashboard className='w-5 h-5' />
                  <span className='font-medium'>Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                  className='w-full flex items-center space-x-4 p-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200'
                >
                  <LogOut className='w-5 h-5' />
                  <span className='font-medium'>Logout</span>
                </button>
              </div>
            ) : (
              // Not logged in state - Mobile
              <div className='space-y-3'>
                <Link
                  href='/sign-in'
                  onClick={closeSidebar}
                  className='relative group flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 overflow-hidden w-full text-left'
                >
                  <LogIn className='w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200' />
                  <span className='font-medium'>Sign in</span>
                  <span className='absolute bottom-2 left-3 w-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 group-hover:w-[calc(100%-24px)] transition-all duration-300 ease-out'></span>
                </Link>

                <Link
                  href='/sign-up'
                  onClick={closeSidebar}
                  className='flex items-center space-x-4 p-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg group'
                >
                  <UserPlus className='w-5 h-5 text-white transition-colors duration-200' />
                  <span className='font-medium'>Sign up</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
