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
    <div className='px-4 space-y-12'>
      <div className='bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-white mb-2'>
            Cara Membuat Undangan Digital
          </h2>
          <p className='text-gray-400 text-sm'>
            Mudah dan cepat, hanya 4 langkah sederhana
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Step 1 */}
          <div className='relative group'>
            <div className='bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 h-full'>
              <div className='absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-lg'>1</span>
              </div>
              <div className='bg-pink-500/10 p-4 rounded-lg mb-4 inline-block'>
                <Sparkles className='text-pink-500' size={32} />
              </div>
              <h3 className='text-white font-semibold text-lg mb-2'>
                Pilih Tema
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Pilih desain undangan yang sesuai dengan tema pernikahan Anda
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className='relative group'>
            <div className='bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 h-full'>
              <div className='absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-lg'>2</span>
              </div>
              <div className='bg-pink-500/10 p-4 rounded-lg mb-4 inline-block'>
                <Heart className='text-pink-500' size={32} />
              </div>
              <h3 className='text-white font-semibold text-lg mb-2'>
                Masukkan Data
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Isi data Anda dan pasangan untuk mempersonalisasi undangan
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className='relative group'>
            <div className='bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 h-full'>
              <div className='absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-lg'>3</span>
              </div>
              <div className='bg-pink-500/10 p-4 rounded-lg mb-4 inline-block'>
                <CreditCard className='text-pink-500' size={32} />
              </div>
              <h3 className='text-white font-semibold text-lg mb-2'>
                Aktivasi
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Lakukan pembayaran untuk mengaktifkan undangan digital Anda
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className='relative group'>
            <div className='bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 h-full'>
              <div className='absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-lg'>4</span>
              </div>
              <div className='bg-pink-500/10 p-4 rounded-lg mb-4 inline-block'>
                <Share2 className='text-pink-500' size={32} />
              </div>
              <h3 className='text-white font-semibold text-lg mb-2'>Bagikan</h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Sebarkan undangan kepada keluarga dan teman-teman Anda
              </p>
            </div>
          </div>
        </div>

        <div className='mt-8 w-full text-center'>
          <Link
            href='dashboard/catalogue'
            className='inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-pink-500/50'
          >
            <Sparkles size={20} />
            Mulai Buat Undangan
          </Link>
        </div>
      </div>
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
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-white'>
            Undangan Digital Saya
          </h2>
          {data.length > 0 && (
            <span className='text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full border border-gray-700'>
              {data.length} undangan
            </span>
          )}
        </div>

        {data.length === 0 ? (
          <div className='bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center shadow-xl'>
            <div className='bg-gray-700/50 p-6 rounded-full mb-4'>
              <Package size={64} className='text-gray-500' strokeWidth={1.5} />
            </div>
            <p className='text-gray-300 text-center mb-2 text-lg font-semibold'>
              Belum Ada Undangan
            </p>
            <p className='text-gray-500 text-center text-sm mb-6 max-w-sm'>
              Mulai buat undangan digital pertamamu sekarang
            </p>
            <Link
              href='catalogue'
              className='bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-pink-500/50'
            >
              Buat Undangan
            </Link>
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
                  className={`bg-gray-800 border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpired
                      ? 'border-gray-700 opacity-60 cursor-not-allowed'
                      : 'border-gray-700 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 cursor-pointer group'
                  }`}
                >
                  {/* Header gradient */}
                  <div
                    className={`h-2 ${
                      isExpired
                        ? 'bg-gray-600'
                        : 'bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500'
                    }`}
                  ></div>

                  {/* Image */}
                  <div className='relative h-80 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden'>
                    {invitation.product.coverImage ? (
                      <img
                        src={invitation.product.coverImage}
                        alt={`Wedding ${invitation.invitationDataUser.groomNickName} & ${invitation.invitationDataUser.brideNickName}`}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <>
                        <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60'></div>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <Heart
                            size={48}
                            className='text-pink-500/20'
                            strokeWidth={1}
                          />
                        </div>
                      </>
                    )}

                    {/* Status Badge */}
                    <div className='absolute top-3 right-3'>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-sm`}
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

                  <div className='p-5'>
                    {/* Title */}
                    <h3
                      className={`font-bold text-xl mb-2 transition-colors ${
                        isExpired
                          ? 'text-gray-500'
                          : 'text-white group-hover:text-pink-400'
                      }`}
                    >
                      Wedding {invitation.invitationDataUser.groomNickName} &{' '}
                      {invitation.invitationDataUser.brideNickName}
                    </h3>

                    {/* Expiry Info */}
                    <p className='text-gray-500 text-xs mb-4'>
                      {isExpired ? (
                        <span className='text-red-400'>
                          Masa aktif berakhir
                        </span>
                      ) : (
                        <>
                          Aktif sampai{' '}
                          {formatExpiryDate(statusConfig.expiryDate)}
                        </>
                      )}
                    </p>

                    {/* Action Buttons */}
                    {!isExpired && (
                      <>
                        {invitation.invitationStatus === 'draft' ? (
                          <div className='flex gap-2'>
                            <Link
                              href={`invitation/${invitation.invitationId}/preview`}
                              className='w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn'
                            >
                              <Eye
                                size={16}
                                className='group-hover/btn:scale-110 transition-transform'
                              />
                              Lihat Detail
                            </Link>
                            <button
                              onClick={() =>
                                handleActivation(invitation.invitationId)
                              }
                              className='w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-pink-500/50'
                            >
                              <Zap
                                size={16}
                                className='group-hover/btn:scale-110 transition-transform'
                              />
                              Aktivasi
                            </button>
                          </div>
                        ) : (
                          <div className='flex gap-2'>
                            <Link
                              href={`invitation/${invitation.invitationId}/preview`}
                              className='w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn'
                            >
                              <Eye
                                size={16}
                                className='group-hover/btn:scale-110 transition-transform'
                              />
                              Lihat Detail
                            </Link>
                            <Link
                              href={'invitation/send'}
                              className='w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-pink-500/50'
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
                      <div className='bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-center'>
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
