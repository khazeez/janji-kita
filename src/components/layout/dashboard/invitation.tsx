import { useState } from 'react';
import { Globe, Video, Camera, Package } from 'lucide-react';

interface InvitationType {
  id: string;
  title: string;
  date: string;
  status: string;
  type: 'web' | 'video' | 'filter';
}

export default function Invitation() {
  const [invitations] = useState<InvitationType[]>([]);

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-white'>Invitation</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-pink-500 transition-colors cursor-pointer'>
          <div className='flex flex-col items-center text-center'>
            <div className='bg-pink-600 p-4 rounded-full mb-4'>
              <Globe size={32} className='text-white' />
            </div>
            <h3 className='text-xl font-bold text-white mb-2'>Create Web</h3>
            <p className='text-gray-400 text-sm'>
              Buat undangan website dengan design menarik dan fitur lengkap
            </p>
          </div>
        </div>

        <div className='bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-pink-500 transition-colors cursor-pointer'>
          <div className='flex flex-col items-center text-center'>
            <div className='bg-pink-600 p-4 rounded-full mb-4'>
              <Video size={32} className='text-white' />
            </div>
            <h3 className='text-xl font-bold text-white mb-2'>Create Video</h3>
            <p className='text-gray-400 text-sm'>
              Buat video undangan pernikahan yang berkesan dan profesional
            </p>
          </div>
        </div>

        <div className='bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-pink-500 transition-colors cursor-pointer'>
          <div className='flex flex-col items-center text-center'>
            <div className='bg-pink-600 p-4 rounded-full mb-4'>
              <Camera size={32} className='text-white' />
            </div>
            <h3 className='text-xl font-bold text-white mb-2'>Create Filter</h3>
            <p className='text-gray-400 text-sm'>
              Buat filter Instagram/TikTok custom untuk momen spesial Anda
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className='text-xl font-bold text-white mb-4'>Undangan Saya</h3>

        {invitations.length === 0 ? (
          <div className='bg-gray-800 border border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center'>
            <Package
              size={64}
              className='text-gray-600 mb-4'
              strokeWidth={1.5}
            />
            <p className='text-gray-400 text-center'>
              Belum ada undangan yang dibuat
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className='bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-pink-500 transition-colors cursor-pointer'
              >
                <div className='flex items-center gap-3 mb-3'>
                  {invitation.type === 'web' && (
                    <Globe size={24} className='text-pink-500' />
                  )}
                  {invitation.type === 'video' && (
                    <Video size={24} className='text-pink-500' />
                  )}
                  {invitation.type === 'filter' && (
                    <Camera size={24} className='text-pink-500' />
                  )}
                  <div>
                    <h4 className='text-white font-bold'>{invitation.title}</h4>
                    <p className='text-gray-400 text-xs'>{invitation.date}</p>
                  </div>
                </div>
                <p className='text-gray-500 text-sm'>{invitation.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
