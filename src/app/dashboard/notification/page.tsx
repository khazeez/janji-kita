'use client';
import { useState } from 'react';
import { Bell, Check, Info, AlertCircle, Gift, Heart, X } from 'lucide-react';

interface NotificationType {
  id: string;
  type: 'info' | 'success' | 'warning' | 'promo';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: '1',
      type: 'success',
      title: 'Undangan Berhasil Dibuat',
      message:
        'Undangan "Pernikahan Budi & Ani" telah berhasil dibuat dan siap dibagikan',
      time: '5 menit yang lalu',
      isRead: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Tamu Baru Konfirmasi Hadir',
      message: '3 tamu baru telah mengkonfirmasi kehadiran di acaramu',
      time: '2 jam yang lalu',
      isRead: false,
    },
    {
      id: '3',
      type: 'promo',
      title: 'Diskon 20% Template Premium',
      message:
        'Dapatkan diskon spesial untuk semua template premium hingga akhir bulan ini!',
      time: '1 hari yang lalu',
      isRead: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Pembayaran Menunggu Konfirmasi',
      message: 'Pembayaran undanganmu sedang diverifikasi. Proses 1x24 jam',
      time: '2 hari yang lalu',
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className='text-green-500' size={20} />;
      case 'warning':
        return <AlertCircle className='text-orange-500' size={20} />;
      case 'promo':
        return <Gift className='text-pink-500' size={20} />;
      default:
        return <Info className='text-blue-500' size={20} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10';
      case 'warning':
        return 'bg-orange-500/10';
      case 'promo':
        return 'bg-pink-500/10';
      default:
        return 'bg-blue-500/10';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className='px-4 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center'>
            <Bell className='text-white' size={20} />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'>Notifikasi</h1>
            {unreadCount > 0 && (
              <p className='text-gray-400 text-sm'>
                {unreadCount} belum dibaca
              </p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className='text-pink-500 hover:text-pink-400 text-sm font-semibold'
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className='bg-gray-800 border border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center'>
          <Bell size={64} className='text-gray-600 mb-4' strokeWidth={1.5} />
          <p className='text-gray-300 text-center mb-2 text-lg font-semibold'>
            Tidak Ada Notifikasi
          </p>
          <p className='text-gray-500 text-center text-sm'>
            Notifikasi akan muncul di sini
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-gray-800 border rounded-xl p-4 transition-all ${
                notification.isRead
                  ? 'border-gray-700'
                  : 'border-pink-500/30 bg-gray-800/80'
              }`}
            >
              <div className='flex gap-4'>
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 ${getBgColor(
                    notification.type
                  )} rounded-lg flex items-center justify-center`}
                >
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-2 mb-1'>
                    <h3 className='text-white font-semibold'>
                      {notification.title}
                      {!notification.isRead && (
                        <span className='ml-2 inline-block w-2 h-2 bg-pink-500 rounded-full'></span>
                      )}
                    </h3>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className='text-gray-500 hover:text-gray-300 transition-colors'
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className='text-gray-400 text-sm mb-2'>
                    {notification.message}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-500 text-xs'>
                      {notification.time}
                    </span>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className='text-pink-500 hover:text-pink-400 text-xs font-semibold'
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
