// app/notifications/page.tsx
import NotificationsClient from '@/components/layout/dashboard-ui/Notifications';
import { NotificationType } from '@/types/interface';

async function getNotifications(): Promise<NotificationType[]> {
  // nanti ganti DB query
  return [
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
  ];
}

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className='px-4 max-w-4xl mx-auto'>
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
