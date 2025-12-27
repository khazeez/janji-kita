'use client';

import { useState } from 'react';
import { Bell, Check, Info, AlertCircle, Gift, X } from 'lucide-react';
import { NotificationType } from '@/types/interface';

interface Props {
  initialNotifications: NotificationType[];
}

export default function NotificationsClient({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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

  return (
    <>
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
            className='text-pink-500 text-sm font-semibold'
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* List */}
      <div className='space-y-3'>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-gray-800 border rounded-xl p-4 ${
              notification.isRead ? 'border-gray-700' : 'border-pink-500/30'
            }`}
          >
            <div className='flex gap-4'>
              <div
                className={`w-10 h-10 ${getBgColor(
                  notification.type
                )} rounded-lg flex items-center justify-center`}
              >
                {getIcon(notification.type)}
              </div>

              <div className='flex-1'>
                <div className='flex justify-between'>
                  <h3 className='text-white font-semibold'>
                    {notification.title}
                  </h3>
                  <button onClick={() => deleteNotification(notification.id)}>
                    <X size={18} />
                  </button>
                </div>

                <p className='text-gray-400 text-sm'>{notification.message}</p>

                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className='text-pink-500 text-xs'
                  >
                    Tandai Dibaca
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
