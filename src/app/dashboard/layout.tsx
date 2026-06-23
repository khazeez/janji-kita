// app/dashboard/layout.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  User,
  Palette,
  CreditCard,
  ListChecks,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Star,
  Mail,
  Bell,
  Settings,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import supabase from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user data
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      } else {
        setUser(session?.user || null);
      }
      setLoading(false);
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      try {
        const [favRes, trxRes] = await Promise.all([
          fetch('/api/favorites'),
          fetch('/api/transactions'),
        ]);
        if (favRes.ok) {
          const fav = await favRes.json();
          setFavoriteCount(fav.data?.length ?? 0);
        }
        if (trxRes.ok) {
          const trx = await trxRes.json();
          setTransactionCount(trx.data?.length ?? 0);
        }
      } catch {}
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    const handleUpdate = () => fetchCounts();
    window.addEventListener('update-counts', handleUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('update-counts', handleUpdate);
    };
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-in');
    }
  }, [loading, user, router]);

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        alert('Gagal logout. Silakan coba lagi.');
      } else {
        router.replace('/sign-in');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Terjadi kesalahan saat logout.');
    }
  };

  const getFirstName = () => {
    if (!user) return 'User';
    const fullName =
      user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    return fullName.split(' ')[0];
  };

  // Menu Sidebar dengan route
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      id: 'catalogue',
      label: 'Tema',
      icon: Palette,
      href: '/dashboard/catalogue',
    },
    {
      id: 'favorite',
      label: 'Favorite',
      icon: Star,
      href: '/dashboard/favorite',
      badge: favoriteCount,
    },
    {
      id: 'payment',
      label: 'Transaksi',
      icon: CreditCard,
      href: '/dashboard/transaction',
      badge: transactionCount,
    },
    {
      id: 'attendance',
      label: 'Data Kehadiran',
      icon: Users,
      href: '/dashboard/attendance',
    },
  ];

  const Badge = ({ count }: { count?: number }) => {
    if (!count) return null;
    return (
      <span className='absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='flex flex-col h-screen bg-gray-900 text-white overflow-hidden'>
      {/* Header Desktop & Mobile */}
      <header className='bg-gray-800 border-b border-gray-700 flex-shrink-0 relative'>
        {/* Mobile row: logo + account */}
        <div className='flex items-center justify-between px-4 py-3 lg:hidden'>
          <Link className='text-xl font-bold text-white' href='/'>
            Janji<span className='text-pink-500'>Kita</span>
          </Link>
          <div className='relative'>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all border border-gray-600'
            >
              <div className='w-7 h-7 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 text-xs font-bold'>
                {getFirstName()[0]}
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Desktop row: logo + nav + account */}
        <div className='hidden lg:flex items-center justify-between px-8 py-3'>
          <Link className='text-2xl font-bold text-white flex-shrink-0' href='/'>
            Janji<span className='text-pink-500'>Kita</span>
          </Link>
          <nav className='flex items-center gap-1'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                    isActive
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className='bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 ml-1'>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className='relative flex-shrink-0'>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all border border-gray-600'
            >
              <div className='w-7 h-7 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 text-xs font-bold'>
                {getFirstName()[0]}
              </div>
              <div className='hidden sm:block text-left'>
                <p className='text-sm font-medium text-white leading-tight'>{getFirstName()}</p>
                <p className='text-[10px] text-gray-400 leading-tight truncate max-w-[120px]'>{user?.email}</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Profile Dropdown */}
        {profileDropdownOpen && (
          <div
            ref={dropdownRef}
            className='absolute right-4 lg:right-6 top-full mt-1 w-56 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl py-2 z-50'
          >
            <div className='px-4 py-3 border-b border-gray-700'>
              <p className='text-sm font-medium text-white'>{user?.user_metadata?.full_name || 'User'}</p>
              <p className='text-xs text-gray-400 truncate'>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors text-sm'
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto scrollbar-hide px-4 lg:px-10 py-6 lg:py-8 pb-24 lg:pb-10 w-full lg:w-[70%] mx-auto'>
        {children}
      </main>

      {/* Bottom Nav Mobile */}
      <nav className='lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-2 py-2 z-40'>
        <div className='flex justify-around items-center'>
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 relative ${
                  isActive ? 'text-pink-500' : 'text-gray-400'
                }`}
              >
                <Icon size={20} />
                <Badge count={item.badge} />
                <span className='text-xs'>{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
