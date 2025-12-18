'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User,
  Palette,
  CreditCard,
  ListChecks,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  Bell,
  Star,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import Invitation from '@/components/layout/dashboard-layout/invitation';
import TransactionHistory from '@/components/layout/dashboard-layout/transactionHistory';
import PaymentStatus from '@/components/layout/dashboard-layout/paymentStatus';
import InvitationProgress from '@/components/layout/dashboard-layout/progressInvitation';
import Saved from '@/components/layout/dashboard-layout/favorite';
import Catalogue from '@/components/layout/dashboard-layout/theme';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<
    | 'invitation'
    | 'theme'
    | 'favorite'
    | 'payment'
    | 'progress'
    | 'attendance'
    | 'profile'
  >('invitation');
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
   const getUser = async () => {
     try {
       const supabase = createClient();
       const {
         data: { user },
       } = await supabase.auth.getUser();

       setUser(user);
     } catch (err) {
       console.error('Error getting user:', err);
       setUser(null);
     } finally {
       setLoading(false);
     }
   };

   getUser();
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

  const handleLogout = async () => {
    const supabase = createClient();
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

  // Get first name from full name
  const getFirstName = () => {
    if (!user) return 'User';
    const fullName =
      user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    return fullName.split(' ')[0];
  };

  // Menu Sidebar
  const menuItems = [
    { id: 'invitation', label: 'Invitation', icon: Mail },
    { id: 'theme', label: 'Tema', icon: Palette },
    {
      id: 'favorite',
      label: 'Favorite',
      icon: Star,
      badge: notifications.cart,
    },
    {
      id: 'payment',
      label: 'Transaksi',
      icon: CreditCard,
      badge: notifications.payment,
    },
    {
      id: 'progress',
      label: 'Progress Undangan',
      icon: ListChecks,
      badge: notifications.progress,
    },
    { id: 'attendance', label: 'Data Kehadiran', icon: Users },
  ];

  // Komponen konten dinamis (SPA)
  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <section>
            <div className='bg-gray-800 rounded-lg p-6 space-y-4'>
              {user && (
                <>
                  <div className='flex items-center space-x-4'>
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt='Avatar'
                        className='w-20 h-20 rounded-full border-2 border-pink-500'
                      />
                    ) : (
                      <div className='w-20 h-20 rounded-full border-2 border-pink-500 bg-gray-700 flex items-center justify-center'>
                        <User className='text-gray-400' size={32} />
                      </div>
                    )}
                    <div>
                      <h3 className='text-xl font-semibold text-white'>
                        {user.user_metadata?.full_name || 'User'}
                      </h3>
                      <p className='text-gray-400'>{user.email}</p>
                    </div>
                  </div>
                  <div className='border-t border-gray-700 pt-4'>
                    <p className='text-sm text-gray-500'>User ID:</p>
                    <p className='text-gray-300 font-mono text-sm'>{user.id}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Provider:</p>
                    <p className='text-gray-300 capitalize'>
                      {user.app_metadata?.provider || 'Email'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Bergabung:</p>
                    <p className='text-gray-300'>
                      {new Date(user.created_at || '').toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        );
      case 'invitation':
        return <Invitation onNavigateToTheme={() => setActiveMenu('theme')} />;
      case 'theme':
        return <Catalogue />;
      case 'favorite':
        return <Saved />;
      case 'payment':
        return <PaymentStatus />;
      case 'progress':
        return <InvitationProgress />;
      case 'attendance':
        return (
          <section>
            <div className='bg-gray-800 rounded-lg p-6'>
              <p className='text-gray-400'>
                Data jumlah orang yang hadir akan ditampilkan di sini.
              </p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  // Komponen Badge
  const Badge = ({ count }: { count?: number }) => {
    if (!count) return null;
    return (
      <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1'>
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4'></div>
          <p className='text-white'>Loading...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada user (fallback)
  if (!user) {
    return (
      <div className="text-white items-center text-center text-2xl">
        User tidak ada
        {user}
      </div>
    );
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-900'>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex md:flex-col bg-gray-800 border-r border-gray-700 fixed left-0 top-0 h-screen transition-all duration-300 overflow-hidden z-50 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div
          className={`p-6 flex items-center ${
            sidebarCollapsed ? 'justify-center' : 'gap-2'
          }`}
        >
          {!sidebarCollapsed && (
            <Link className='text-3xl font-bold ml-5 text-white' href='/'>
              Janji<span className='text-pink-500'>Kita</span>
            </Link>
          )}
        </div>

        {/* Tombol Collapse */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className='w-full py-3 flex items-center justify-center border-b-1 border-t-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-color'
        >
          {sidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>

        {/* Menu */}
        <nav className='flex-1 p-4 space-y-2 text-sm font-bold overflow-y-auto'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id as typeof activeMenu)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  activeMenu === item.id
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <div className='relative'>
                  <Icon size={20} />
                  {sidebarCollapsed && <Badge count={item.badge} />}
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className='font-medium flex-1 text-left'>
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span className='bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5'>
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className='p-4 border-t border-gray-700'>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span className='text-sm'>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Header Desktop & Mobile */}
        <header className='sticky bg-gray-900 top-0 z-40'>
          <div className='px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between'>
            {/* Left Side - Logo & Greeting */}
            <div className='flex items-center gap-3 ml-3'>
              {/* <Heart className='text-pink-500 md:hidden' size={20} /> */}
              <div>
                <h1 className='text-sm md:text-lg font-bold text-white'>
                  <span className='hidden'>JanjiKita</span>
                  <span className='md:inline md:text-2xl text-xl'>
                    Hi, {getFirstName()}! ❤️
                  </span>
                </h1>
                <p className='md:block text-xs text-gray-400'>
                  Selamat datang kembali
                </p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className='flex items-center gap-2 md:gap-3'>
              {/* Notification Button */}
              <button
                onClick={() => setActiveMenu('payment')}
                className='relative text-gray-300 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors'
              >
                <Bell size={20} />
                <Badge count={notifications.payment} />
              </button>

              {/* Profile Dropdown */}
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className='flex items-center gap-2 hover:bg-gray-700 rounded-lg px-2 py-2 transition-colors'
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt='Avatar'
                      className='w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-pink-500'
                    />
                  ) : (
                    <div className='w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-pink-500 bg-gray-700 flex items-center justify-center'>
                      <User className='text-gray-400' size={18} />
                    </div>
                  )}
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform hidden md:block ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
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
                    <button
                      onClick={() => {
                        setActiveMenu('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className='w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                    >
                      <User size={18} />
                      <span className='text-sm'>Profile Saya</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        // Add settings handler here
                      }}
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
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto bg-gray-900'>
          <div className='max-w-6xl mx-auto'>{renderContent()}</div>
        </main>
      </div>

      {/* Bottom Nav Mobile */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50'>
        <div className='flex justify-around items-center py-2'>
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id as typeof activeMenu)}
                className={`flex flex-col items-center gap-1 px-3 py-2 relative ${
                  activeMenu === item.id ? 'text-pink-500' : 'text-gray-400'
                }`}
              >
                <div className='relative'>
                  <Icon size={20} />
                  <Badge count={item.badge} />
                </div>
                <span className='text-xs'>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
