'use client';
import { useState, useEffect } from 'react';
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
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import Invitation from '@/components/layout/dashboard-layout/invitation';
import TransactionHistory from '@/components/layout/dashboard-layout/transactionHistory';
import PaymentStatus from '@/components/layout/dashboard-layout/paymentStatus';
import InvitationProgress from '@/components/layout/dashboard-layout/progressInvitation';
import Saved from '@/components/layout/dashboard-layout/favorite';
import Catalogue from '@/components/layout/dashboard-layout/theme';

export default function Dashboard() {
  const router = useRouter();

  // useEffect(() => {
  //   if (!isLoggedIn()) {
  //     router.replace('/sign-in'); // redirect ke login
  //   }
  // }, []);
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

  // Data notifikasi
  const notifications = {
    cart: 3,
    payment: 2,
    progress: 1,
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
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    alert('Logout clicked');
  };

  // Komponen konten dinamis (SPA)
  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <section>
            <h2 className='text-2xl font-bold mb-4 text-white'>Profile</h2>
            <p className='text-gray-400'>
              Halaman profile akan ditampilkan di sini.
            </p>
          </section>
        );
      // Di bagian renderContent, ubah case 'invitation':
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
            <h2 className='text-2xl font-bold mb-4 text-white'>
              Data Kehadiran
            </h2>
            <p className='text-gray-400'>
              Data jumlah orang yang hadir akan ditampilkan di sini.
            </p>
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

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-900'>
      {/* Header Mobile */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-40 px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Heart className='text-pink-500' size={20} />
          <h1 className='text-sm font-bold text-white'>JanjiKita</h1>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => setActiveMenu('favorite')}
            className='relative text-gray-300 hover:text-white'
          >
            <Star size={24} />
            <Badge count={notifications.cart} />
          </button>
          <button
            onClick={() => setActiveMenu('payment')}
            className='relative text-gray-300 hover:text-white'
          >
            <Bell size={24} />
            <Badge count={notifications.payment} />
          </button>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex md:flex-col bg-gray-800 border-r border-gray-700 fixed left-0 top-0 h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div
          className={`p-6 flex items-center border-b border-gray-700 ${
            sidebarCollapsed ? 'justify-center' : 'gap-2'
          }`}
        >
          <Heart className='text-pink-500' size={24} />
          {!sidebarCollapsed && (
            <h1 className='text-2xl font-bold text-white'>JanjiKita</h1>
          )}
        </div>

        {/* Tombol Collapse */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className='w-full py-3 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border-b border-gray-700'
        >
          {sidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>

        {/* Menu */}
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
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
            {!sidebarCollapsed && <span className='font-medium'>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Konten Utama (SPA Content) */}
      <main
        className={`flex-1 p-2 pb-24 pt-20 md:pt-6 md:pb-6 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className='max-w-4xl mx-auto'>{renderContent()}</div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50'>
        <div className='flex justify-around items-center py-2'>
          {menuItems
            .filter(
              (item) => !['favorite', 'history', 'payment'].includes(item.id)
            )
            .map((item) => {
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
