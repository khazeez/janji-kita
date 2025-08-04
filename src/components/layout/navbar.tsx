'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Product', href: '/product' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 text-white shadow-md backdrop-blur-md bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link href="/" className={clsx(
            'font-bold text-2xl',
            isOpen ? 'text-black' : 'text-white'
          )}>
            Janji<span className='text-pink-500'>Kita</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="hover:text-gray-300">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/sign-in" className="hover:underline rounded-md px-4 border border-pink-400 py-2">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
            >
              Sign up
            </Link>
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className="md:hidden focus:outline-none text-white"
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar Overlay + Content (Mobile) */}
      <div
        className={clsx(
          'fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out',
          isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        )}
      >
        {/* Overlay Background */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-1/2 bg-white text-black p-6 transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <button
            className="mb-6 text-black"
            onClick={closeSidebar}
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>

          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar}
                className="hover:text-gray-600"
              >
                {item.name}
              </Link>
            ))}

            <hr className="my-2 border-gray-300" />

            <Link href="/sign-in" onClick={closeSidebar} className="hover:underline">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              onClick={closeSidebar}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
