'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  CheckCircle,
  Sparkles,
  Heart,
  Share2,
  CreditCard,
} from 'lucide-react';

interface InvitationType {
  id: string;
  title: string;
  date: string;
  status: string;
  thumbnailUrl?: string;
  link?: string;
}

export default function Invitation() {
  const [invitations] = useState<InvitationType[]>([]);

  const steps = [
    {
      number: 1,
      icon: Sparkles,
      title: 'Pilih Desain',
      description:
        'Ratusan template cantik siap pakai untuk berbagai tema pernikahan',
      color: 'text-purple-400',
    },
    {
      number: 2,
      icon: Heart,
      title: 'Isi Data Kalian',
      description:
        'Nama, tanggal, lokasi, foto, dan cerita cinta kalian berdua',
      color: 'text-pink-400',
    },
    {
      number: 3,
      icon: CreditCard,
      title: 'Aktivasi Undangan',
      description:
        'Bayar sekali saja, undangan aktif selamanya tanpa biaya bulanan',
      color: 'text-rose-400',
    },
    {
      number: 4,
      icon: Share2,
      title: 'Bagikan ke Tamu',
      description:
        'Kirim satu link yang sama ke semua tamu via WhatsApp atau sosial media',
      color: 'text-orange-400',
    },
  ];

  return (
    <div className='px-4 space-y-12'>
      {/* Hero Section */}
      
      <div className='bg-gray-800 border border-gray-700 rounded-xl p-8 md:p-10'>
        <h2 className='text-2xl md:text-3xl font-bold text-white mb-3'>
          Buat Undangan Digital 15 detik langsung jadi
        </h2>
        <p className='text-gray-400 text-lg mb-10'>
          Tanpa cetak, tanpa ribet. Dari pilih desain sampai siap dibagikan,
          semua dalam hitungan menit.
        </p>

        {/* Steps */}
        <div className='relative mb-10'>
          {/* Desktop - Curved SVG Line */}
          <svg
            className='hidden md:block absolute top-6 left-0 w-full h-24 pointer-events-none'
            style={{ zIndex: 0 }}
          >
            <path
              d='M 48 0 Q 25% -30, 50% 0 T 100% 0'
              stroke='#374151'
              strokeWidth='2'
              fill='none'
              strokeDasharray='8 4'
            />
          </svg>

          <div className='flex flex-col md:flex-row justify-between gap-10 md:gap-0 relative'>
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className='relative flex md:flex-col items-start md:items-center gap-4 md:w-full'
                >
                  {/* Mobile - Wavy Line */}
                  {index < steps.length - 1 && (
                    <svg
                      className='md:hidden absolute left-6 top-12 w-0.5 pointer-events-none'
                      style={{ height: 'calc(100% + 40px)' }}
                    >
                      <path
                        d='M 1 0 Q -8 25%, 1 50% T 1 100%'
                        stroke='#374151'
                        strokeWidth='2'
                        fill='none'
                      />
                    </svg>
                  )}

                  {/* Step circle with glow */}
                  <div className='relative z-10'>
                    <div className='absolute inset-0 rounded-full bg-pink-600 blur-md opacity-50 animate-pulse'></div>
                    <div className='relative w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:scale-110 transition-transform'>
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='md:text-center max-w-xs'>
                    <div className='flex md:flex-col items-center md:items-center gap-3 mb-2'>
                      <Icon size={22} className={step.color} />
                      <h3 className='text-white font-semibold text-base'>
                        {step.title}
                      </h3>
                    </div>
                    <p className='text-gray-400 text-sm leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className='pt-6 border-t border-gray-700'>
          <Link
            href='catalogue'
            className='inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors'
          >
            Mulai Buat Undangan Sekarang
          </Link>
        </div>
      </div>

      {/* Invitation List Section */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-white'>
            Undangan Digital Saya
          </h2>
          {invitations.length > 0 && (
            <span className='text-gray-400 text-sm'>
              {invitations.length} undangan aktif
            </span>
          )}
        </div>

        {invitations.length === 0 ? (
          <div className='bg-gray-800 border border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center'>
            <Package
              size={64}
              className='text-gray-600 mb-4'
              strokeWidth={1.5}
            />
            <p className='text-gray-300 text-center mb-2 text-lg font-semibold'>
              Belum Ada Undangan
            </p>
            <p className='text-gray-500 text-center text-sm mb-6 max-w-sm'>
              Mulai buat undangan digital pertamamu sekarang
            </p>
            <Link
              href='catalogue'
              className='bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors'
            >
              Buat Undangan
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className='bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-pink-500 transition-colors cursor-pointer group'
              >
                {invitation.thumbnailUrl && (
                  <div className='h-48 bg-gray-700 overflow-hidden'>
                    <img
                      src={invitation.thumbnailUrl}
                      alt={invitation.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                )}

                <div className='p-4'>
                  <h3 className='text-white font-bold text-lg mb-1'>
                    {invitation.title}
                  </h3>
                  <p className='text-gray-400 text-sm mb-3'>
                    {invitation.date}
                  </p>

                  <div className='flex items-center gap-2 mb-4'>
                    <CheckCircle size={16} className='text-green-500' />
                    <span className='text-green-500 text-sm font-medium'>
                      Siap Dibagikan
                    </span>
                  </div>

                  <div className='flex gap-2'>
                    <button className='flex-1 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors'>
                      Kelola
                    </button>
                    <button className='px-4 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors'>
                      Bagikan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
