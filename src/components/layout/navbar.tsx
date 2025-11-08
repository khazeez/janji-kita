'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Info,
  FileText,
  Package,
  LogIn,
  UserPlus,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import LoginPopup from '../ui/loginPopUp'; // pastikan path sesuai

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Catalogue', href: '/catalogue', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Product', href: '/product', icon: Package },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const openLoginPopup = () => setShowLoginPopup(true);
  const closeLoginPopup = () => setShowLoginPopup(false);

  return (
    <>
      {/* Navbar */}
      <header className='fixed top-0 left-0 w-full z-50 text-white shadow-lg backdrop-blur-md bg-black/20 border-b border-white/10 leading-relaxed tracking-wide'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <Link
            href='/'
            className={clsx(
              'font-bold text-2xl transition-colors duration-200',
              isOpen ? 'text-black' : 'text-white'
            )}
          >
            Janji<span className='text-pink-500'>Kita</span>
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

          {/* Auth Buttons (Desktop) */}
          <div className='hidden md:flex items-center space-x-3'>
            <button
              onClick={openLoginPopup}
              className='relative group px-4 py-2 font-medium transition-all duration-300 ease-out border border-pink-400/60 rounded-lg hover:border-transparent'
            >
              Sign in
              <span className='absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left'></span>
            </button>
            <Link
              href='/sign-up'
              className='px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg'
            >
              Sign up
            </Link>
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className='md:hidden focus:outline-none text-white hover:text-pink-300 transition-colors duration-200'
            onClick={toggleSidebar}
            aria-label='Toggle Menu'
          >
            {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
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

            {/* Auth Section */}
            <div className='space-y-3'>
              <button
                onClick={openLoginPopup}
                className='relative group flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 overflow-hidden w-full text-left'
              >
                <LogIn className='w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200' />
                <span className='font-medium'>Sign in</span>
                <span className='absolute bottom-2 left-3 w-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 group-hover:w-[calc(100%-24px)] transition-all duration-300 ease-out'></span>
              </button>

              <Link
                href='/sign-up'
                onClick={closeSidebar}
                className='flex items-center space-x-4 p-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg group'
              >
                <UserPlus className='w-5 h-5 text-white transition-colors duration-200' />
                <span className='font-medium'>Sign up</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup isOpen={showLoginPopup} onClose={closeLoginPopup} />
    </>
  );
}
