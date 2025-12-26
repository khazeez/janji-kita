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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Data notifikasi
  const notifications = {
    cart: 3,
    payment: 2,
    progress: 1,
  };

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
      id: 'invitation',
      label: 'Invitation',
      icon: Mail,
      href: '/dashboard/invitation',
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
      badge: notifications.cart,
    },
    {
      id: 'payment',
      label: 'Transaksi',
      icon: CreditCard,
      href: '/dashboard/transaction',
      badge: notifications.payment,
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
    <div className='flex h-screen bg-gray-900 text-white overflow-hidden'>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className='p-4 border-b border-gray-700'>
          {!sidebarCollapsed && (
            <Link className='text-3xl font-bold ml-5 text-white' href='/'>
              Janji<span className='text-pink-500'>Kita</span>
            </Link>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className='w-full py-3 flex items-center justify-center border-b-1 border-t-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors'
        >
          {sidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>

        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={false}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  isActive
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon size={20} />
                {sidebarCollapsed && <Badge count={item.badge} />}
                {!sidebarCollapsed && (
                  <>
                    <span className='flex-1'>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className='bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5'>
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-gray-700'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors'
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Main Content */}
        <main className='flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6'>
          {children}
        </main>
      </div>

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
                prefetch={false}
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
