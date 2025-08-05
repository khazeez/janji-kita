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
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <header className="fixed top-0 left-0 w-full z-50 text-white shadow-lg backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <Link href="/" className={clsx(
            'font-bold text-2xl transition-colors duration-200',
            isOpen ? 'text-black' : 'text-white'
          )}>
            Janji<span className='text-pink-500'>Kita</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.slice(1).map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="relative group hover:text-pink-300 transition-colors duration-200 font-medium py-2"
              >
                {item.name}
                {/* Animated Underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={openLoginPopup}
              className="relative group px-4 py-2 font-medium transition-all duration-300 ease-out border border-pink-400/60 rounded-lg hover:border-transparent"
            >
              Sign in
              {/* Animated Underline */}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
            </button>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg"
            >
              Sign up
            </Link>
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className="md:hidden focus:outline-none text-white hover:text-pink-300 transition-colors duration-200"
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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white">
            <Link href="/" onClick={closeSidebar} className="font-bold text-2xl text-gray-800">
              Janji<span className='text-pink-500'>Kita</span>
            </Link>
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200 p-1"
              onClick={closeSidebar}
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeSidebar}
                    className="relative group flex items-center space-x-4 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 overflow-hidden"
                  >
                    <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors duration-200" />
                    <span className="font-medium">{item.name}</span>
                    {/* Animated Underline for Mobile */}
                    <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 group-hover:w-[calc(100%-24px)] transition-all duration-300 ease-out"></span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Auth Section */}
            <div className="space-y-3">
              <button 
                onClick={openLoginPopup}
                className="relative group flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 overflow-hidden w-full text-left"
              >
                <LogIn className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
                <span className="font-medium">Sign in</span>
                {/* Animated Underline for Sign in Mobile */}
                <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 group-hover:w-[calc(100%-24px)] transition-all duration-300 ease-out"></span>
              </button>
              
              <Link
                href="/sign-up"
                onClick={closeSidebar}
                className="flex items-center space-x-4 p-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg group"
              >
                <UserPlus className="w-5 h-5 text-white transition-colors duration-200" />
                <span className="font-medium">Sign up</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeLoginPopup}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome Back!
              </h2>
              <button
                onClick={closeLoginPopup}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200">
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/25">
                Sign In
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account? 
                <button className="text-pink-500 hover:text-pink-600 font-medium ml-1 transition-colors duration-200">
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}