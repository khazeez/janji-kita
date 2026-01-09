'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AllInvitationData, Transactions } from '@/types/interface';
import {
  Package,
  CheckCircle,
  Sparkles,
  Heart,
  Share2,
  CreditCard,
  Eye,
  PencilLineIcon,
  Clock,
  Zap,
  Calendar,
} from 'lucide-react';
import { createTransaction } from '@/models/transactions';

type Props = {
  data: AllInvitationData[];
  trx: Transactions;
};

export default function InvitationComponents({ data, trx }: Props) {
  const [showEditWarning, setShowEditWarning] = useState(false);

  const getStatusConfig = (invitation: AllInvitationData) => {
    // Cek status expired dari database
    if (invitation.invitationStatus === 'expired') {
      const expiryDate = invitation.expiredAt
        ? new Date(invitation.expiredAt)
        : new Date(invitation.createdAt);

      return {
        label: 'Kadaluarsa',
        color: 'text-white',
        bgColor: 'bg-gray-500',
        borderColor: 'border-gray-500/20',
        icon: Clock,
        expired: true,
        expiryDate,
      };
    }

    // Cek apakah ada expiredAt
    if (invitation.expiredAt) {
      const expiryDate = new Date(invitation.expiredAt);
      const now = new Date();
      const isExpired = now > expiryDate;

      if (isExpired) {
        return {
          label: 'Kadaluarsa',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          icon: Clock,
          expired: true,
          expiryDate,
        };
      }
    }

    // Fallback: hitung dari createdAt + 6 bulan
    const createdAt = new Date(invitation.createdAt);
    const expiryDate = new Date(createdAt);
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    const now = new Date();
    const isExpired = now > expiryDate;

    if (isExpired) {
      return {
        label: 'Kadaluarsa',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/20',
        icon: Clock,
        expired: true,
        expiryDate,
      };
    }

    if (invitation.invitationStatus === 'published') {
      return {
        label: 'Aktif',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        icon: CheckCircle,
        expired: false,
        expiryDate: invitation.expiredAt
          ? new Date(invitation.expiredAt)
          : expiryDate,
      };
    }

    return {
      label: 'Belum Aktif',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      icon: Clock,
      expired: false,
      expiryDate: invitation.expiredAt
        ? new Date(invitation.expiredAt)
        : expiryDate,
    };
  };

  const handleActivation = async (invitationId: string) => {
    try {
      const res = await fetch('/api/midtrans/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      });

      if (!res.ok) {
        throw new Error('Checkout failed');
      }

      const { snapToken } = await res.json();

      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: () => {
          console.log('Payment success');
        },
        onPending: () => {
          console.log('Payment pending');
        },
        onError: () => {
          console.log('Payment failed');
        },
        onClose: () => {
          console.log('Popup closed');
        },
      });
    } catch (error) {
      console.error('Activation error:', error);
    }
  };

  const formatExpiryDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isEventDay = (eventDate: string) => {
    const event = new Date(eventDate);
    const now = new Date();
    return (
      event.getDate() === now.getDate() &&
      event.getMonth() === now.getMonth() &&
      event.getFullYear() === now.getFullYear()
    );
  };

  return (
    <div className='pb-20 space-y-12'>
      {/* Edit Warning Modal */}
      {showEditWarning && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='bg-red-500/10 p-3 rounded-full'>
                <Calendar className='text-red-500' size={24} />
              </div>
              <h3 className='text-xl font-bold text-white'>Tidak Bisa Edit</h3>
            </div>
            <p className='text-gray-400 mb-6'>
              Undangan sudah tidak bisa diedit karena hari ini adalah hari H
              acara Anda.
            </p>
            <button
              onClick={() => setShowEditWarning(false)}
              className='w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-3 rounded-lg transition-all duration-300'
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Invitation List Section */}
      <div className=' p-2 rounded-2xl'>
        <div className='flex items-center justify-between mb-10 '>
          <div className=''>
            <h2 className='lg:text-2xl text-xl font-bold text-white'>
              Undangan Saya
            </h2>
            <p className='text-xs text-gray-600 leading-tight tracking-wide'>{data.length} undangan</p>
          </div>

          <div className="lg:text-2xl text-xl border border-b-2 border-l-2 p-0 px-3 rounded-sm">
            <Link href='/dashboard/catalogue'>
            +
            </Link>
          </div>
        </div>

        {data.length === 0 ? (
          <div className='rounded-2xl py-5 pb-10  backdrop-blur-sm px-2 lg:px-4'>
            <div className='text-center pb-10'>
              <span className='relative inline-block text-pink-500'>
                <h2 className='lg:text-2xl text-xl font-bold text-white mb-2'>
                  Cara Membuat Undangan Digital
                </h2>
                <svg
                  className='absolute left-0 -bottom-1 w-full h-4 text-pink-200'
                  viewBox='0 0 100 20'
                  preserveAspectRatio='none'
                >
                  <path
                    d='M 2 15 Q 50 2, 98 12'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    opacity='0.8'
                  />
                </svg>
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative'>
              {[
                {
                  number: 1,
                  title: 'Pilih Tema',
                  description:
                    'Pilih desain undangan yang sesuai dengan tema pernikahan Anda',
                },
                {
                  number: 2,
                  title: 'Masukkan Data',
                  description:
                    'Isi data Anda dan pasangan untuk mempersonalisasi undangan',
                },
                {
                  number: 3,
                  title: 'Aktivasi',
                  description:
                    'Lakukan pembayaran untuk mengaktifkan undangan digital Anda',
                },
                {
                  number: 4,
                  title: 'Bagikan',
                  description:
                    'Sebarkan undangan kepada keluarga dan teman-teman Anda',
                },
              ].map((step, index) => {
                return (
                  <div
                    key={step.number}
                    className='relative group flex md:flex-col gap-3 items-center md:text-center'
                  >
                    {/* Circular Number with Arc */}
                    <div className='relative mb-6'>
                      {/* Arc Background */}
                      <svg
                        className='absolute -inset-4 lg:w-32 lg:h-32 w-20 h-23'
                        viewBox='0 0 120 120'
                      >
                        <circle
                          cx='60'
                          cy='60'
                          r='54'
                          fill='none'
                          stroke='#ec4899'
                          strokeWidth='2'
                          strokeDasharray='160 340'
                          strokeDashoffset='-80'
                          opacity='0.3'
                          className='group-hover:opacity-60 transition-opacity'
                        />
                      </svg>

                      {/* Number Circle */}
                      <div className='relative lg:w-24 lg:h-24 w-15 h-15 border border-r-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                        <span className='text-white font-bold lg:text-5xl text-3xl'>
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Title */}

                    <div className='content '>
                      <h3 className='text-white font-semibold text-lg mb-2 group-hover:text-pink-400 transition-colors'>
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className='text-gray-400 text-sm leading-relaxed max-w-xs'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='mt-8 w-full text-center '>
              <Link
                href='dashboard/catalogue'
                className='inline-flex items-center gap-2 hover:scale-110 text-white font-semibold px-8 border border-l-8 border-b-8 py-3 rounded-lg transition-all duration-300 shadow-lg'
              >
                <Sparkles size={20} className='text-pink-400' />
                Mulai Buat Undangan
              </Link>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {data.map((invitation) => {
              const statusConfig = getStatusConfig(invitation);
              const StatusIcon = statusConfig.icon;
              const isExpired = statusConfig.expired;

              return (
                <div
                  key={invitation.invitationId}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpired
                      ? 'bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed'
                      : 'bg-gray-800/80 border-gray-700 hover:border-pink-500/50 hover:shadow-xl cursor-pointer group'
                  }`}
                >
                  {/* Image/Header dengan gradient border effect */}
                  <div className='relative h-48 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 overflow-hidden'>
                    {/* Decorative gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70'></div>

                    {/* Decorative elements */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Heart
                        size={80}
                        className={`${
                          isExpired
                            ? 'text-gray-600/20'
                            : 'text-pink-500/10 group-hover:text-pink-500/20'
                        } transition-all duration-300`}
                        strokeWidth={1}
                      />
                    </div>

                    {/* Top gradient accent */}
                    <div
                      className={`h-1 ${
                        isExpired
                          ? 'bg-gray-600'
                          : 'bg-gradient-to-r from-pink-700 to-pink-400'
                      }`}
                    ></div>

                    {/* Status Badge */}
                    <div className='absolute top-4 right-4'>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-md shadow-lg`}
                      >
                        <StatusIcon size={14} className={statusConfig.color} />
                        <span
                          className={`${statusConfig.color} text-xs font-medium`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='p-6'>
                    {/* Title */}
                    <h3
                      className={`font-bold text-xl mb-3 transition-colors ${
                        isExpired
                          ? 'text-gray-500'
                          : 'text-white group-hover:text-pink-400'
                      }`}
                    >
                      Wedding {invitation.invitationDataUser.groomNickName} &{' '}
                      {invitation.invitationDataUser.brideNickName}
                    </h3>

                    {/* Expiry Info with icon */}
                    <div className='flex items-center gap-2 mb-5'>
                      <Clock size={14} className='text-gray-500' />
                      <p className='text-gray-500 text-xs'>
                        {isExpired ? (
                          <span className='text-red-400 font-medium'>
                            Masa aktif berakhir
                          </span>
                        ) : (
                          <>
                            Aktif sampai{' '}
                            <span className='text-gray-400 font-medium'>
                              {formatExpiryDate(statusConfig.expiryDate)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {!isExpired && (
                      <>
                        {invitation.invitationStatus === 'draft' ? (
                          <div className='flex gap-3'>
                            <Link
                              href={`invitation/${invitation.invitationId}/preview`}
                              className='flex-1 bg-gray-700/80 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn'
                            >
                              <PencilLineIcon
                                size={16}
                                className='group-hover/btn:scale-110 transition-transform'
                              />
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleActivation(invitation.invitationId)
                              }
                              className='flex-1 bg-gradient-to-r from-pink-700 to-pink-500 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-pink-500/50 border border-pink-500/20'
                            >
                              <Zap
                                size={16}
                                className='group-hover/btn:scale-110 transition-transform'
                              />
                              Aktivasi
                            </button>
                          </div>
                        ) : (
                          <div className='flex gap-3'>
                            <Link
                              href={`invitation/${invitation.invitationId}/preview`}
                              className='flex-1 bg-gray-700/80 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn'
                            >
                              <PencilLineIcon
                                size={16}
                                className='group-hover/btn:scale-110 transition-transform'
                              />
                              Edit
                            </Link>
                            <Link
                              href={'invitation/send'}
                              className='flex-1 bg-gradient-to-r from-pink-700 to-pink-500 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-pink-500/50 border border-pink-500/20'
                            >
                              <Share2
                                size={16}
                                className='group-hover/btn:scale-110 transition-transform'
                              />
                              Bagikan
                            </Link>
                          </div>
                        )}
                      </>
                    )}

                    {isExpired && (
                      <div className='bg-gray-700/30 border border-gray-600 rounded-xl p-4 text-center'>
                        <p className='text-gray-400 text-sm'>
                          Undangan tidak dapat diakses
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
