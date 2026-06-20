'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AllInvitationData } from '@/types/interface';
import {
  CheckCircle,
  Sparkles,
  Heart,
  PencilLineIcon,
  Clock,
  Calendar,
  Loader2,
  Zap,
  Share2,
  Package,
} from 'lucide-react';

type Props = {
  data: AllInvitationData[];
};

export default function InvitationComponents({ data }: Props) {
  const router = useRouter();
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<string>('all');

  const filteredData = useMemo(() => {
    if (filterTab === 'all') return data;
    return data.filter((inv) => {
      if (filterTab === 'active') return inv.invitationStatus === 'published';
      if (filterTab === 'needs_activation') return inv.invitationStatus === 'draft';
      if (filterTab === 'expired') return inv.invitationStatus === 'expired';
      return true;
    });
  }, [data, filterTab]);

  const handleNavigation = (url: string, id: string) => {
    setNavigatingId(id);
    router.push(url);
  };

  const getStatusConfig = (invitation: AllInvitationData) => {
    const getFallbackExpiry = () => {
      const base = invitation.publishedAt
        ? new Date(invitation.publishedAt)
        : new Date(invitation.createdAt);
      const d = new Date(base);
      d.setMonth(d.getMonth() + 6);
      return d;
    };

    // Cek status expired dari database
    if (invitation.invitationStatus === 'expired') {
      const expiryDate = invitation.expiredAt
        ? new Date(invitation.expiredAt)
        : getFallbackExpiry();

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

    // Fallback: hitung dari publishedAt + 6 bulan
    const expiryDate = getFallbackExpiry();
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
    setActivatingId(invitationId);
    try {
      const res = await fetch('/api/midtrans/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Checkout failed' }));
        throw new Error(err.message || 'Checkout failed');
      }

      const { snapToken } = await res.json();

      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: async () => {
          await fetch('/api/midtrans/success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invitationId }),
          });
          window.dispatchEvent(new CustomEvent('update-counts'));
          window.location.reload();
        },
        onPending: () => {
          setActivatingId(null);
          console.log('Payment pending');
        },
        onError: () => {
          setActivatingId(null);
          console.log('Payment failed');
        },
        onClose: () => {
          setActivatingId(null);
          console.log('Popup closed');
        },
      });
    } catch (error) {
      setActivatingId(null);
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
            <p className='text-xs text-gray-600 leading-tight tracking-wide'>{filteredData.length} undangan</p>
          </div>

          <div className="lg:text-2xl text-xl border border-b-2 border-l-2 p-0 px-3 rounded-sm">
            <Link href='/dashboard/catalogue'>
            +
            </Link>
          </div>
        </div>

        {/* Filter Tabs - only show when there are invitations */}
        {data.length > 0 && (
        <div className='flex gap-2 mb-6 overflow-x-auto'>
          {[
            { key: 'all', label: 'Semua' },
            { key: 'active', label: 'Aktif' },
            { key: 'needs_activation', label: 'Butuh Aktivasi' },
            { key: 'expired', label: 'Kadaluarsa' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                filterTab === tab.key
                  ? 'bg-gray-700 text-white border border-gray-600'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        )}

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
        ) : filteredData.length === 0 ? (
          <div className='p-8 sm:p-12 text-center'>
            <div className='bg-gray-900/50 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4'>
              <Package className='w-6 h-6 sm:w-7 sm:h-7 text-gray-700' />
            </div>
            <p className='text-gray-400 font-medium text-sm sm:text-base'>Tidak ada undangan</p>
            <p className='text-gray-600 text-[10px] sm:text-xs mt-1'>Tidak ada undangan dengan status ini.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredData.map((invitation) => {
              const statusConfig = getStatusConfig(invitation);
              const StatusIcon = statusConfig.icon;
              const isExpired = statusConfig.expired;
              const cardColor = invitation.invitationStatus === 'draft' ? 'yellow' : 'green';
              const heartColor = isExpired
                ? 'text-gray-600/20'
                : cardColor === 'yellow'
                  ? 'text-yellow-500/10 group-hover:text-yellow-500/20'
                  : 'text-green-500/10 group-hover:text-green-500/20';
              const titleHoverColor = isExpired
                ? 'text-gray-500'
                : 'text-white ' + (cardColor === 'yellow' ? 'group-hover:text-yellow-400' : 'group-hover:text-green-400');
              const cardBorderColor = isExpired
                ? 'bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed'
                : 'bg-gray-800/80 border-gray-700 ' + (cardColor === 'yellow' ? 'hover:border-yellow-500/50' : 'hover:border-green-500/50') + ' hover:shadow-xl cursor-pointer group';
              const gradientBarColor = isExpired
                ? 'bg-gray-600'
                : cardColor === 'yellow' ? 'bg-gradient-to-r from-yellow-700 to-yellow-400' : 'bg-gradient-to-r from-green-700 to-green-400';

              return (
                  <div
                    key={invitation.invitationId}
                    className={'border rounded-2xl overflow-hidden transition-all duration-300 ' + cardBorderColor}
                  >
                  {/* Image/Header dengan gradient border effect */}
                  <div className='relative h-48 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 overflow-hidden'>
                    {/* Decorative gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70'></div>

                    {/* Decorative elements */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Heart
                        size={80}
                        className={heartColor + ' transition-all duration-300'}
                        strokeWidth={1}
                      />
                    </div>

                    {/* Top gradient accent */}
                    <div
                      className={'h-1 ' + gradientBarColor}
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
                      className={'font-bold text-xl mb-3 transition-colors ' + titleHoverColor}
                    >
                      Wedding {invitation.invitationDataUser.groomNickName} &{' '}
                      {invitation.invitationDataUser.brideNickName}
                    </h3>

                    {/* Expiry Info with icon */}
                    {invitation.invitationStatus !== 'draft' && (
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
                    )}

                    {/* Action Buttons */}
                    {!isExpired && (
                      <>
                        {invitation.invitationStatus === 'draft' ? (
                          <div className='flex gap-3'>
                            <button
                              onClick={() => handleNavigation(`invitation/${invitation.invitationId}/preview`, `edit-${invitation.invitationId}`)}
                              disabled={!!navigatingId}
                              className='flex-1 bg-gray-700/80 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              {navigatingId === `edit-${invitation.invitationId}` ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <PencilLineIcon
                                  size={16}
                                  className='group-hover/btn:scale-110 transition-transform'
                                />
                              )}
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleActivation(invitation.invitationId)
                              }
                              disabled={
                                activatingId === invitation.invitationId
                              }
                              className='flex-1 bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-700 hover:to-amber-600 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-yellow-500/50 border border-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              {activatingId === invitation.invitationId ? (
                                <Loader2
                                  size={16}
                                  className='animate-spin'
                                />
                              ) : (
                                <Zap
                                  size={16}
                                  className='group-hover/btn:scale-110 transition-transform'
                                />
                              )}
                              {activatingId === invitation.invitationId
                                ? 'Memproses...'
                                : 'Aktivasi'}
                            </button>
                          </div>
                        ) : (
                          <div className='flex gap-3'>
                            <button
                              onClick={() => handleNavigation(`invitation/${invitation.invitationId}/preview`, `edit-${invitation.invitationId}`)}
                              disabled={!!navigatingId}
                              className='flex-1 bg-gray-700/80 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              {navigatingId === `edit-${invitation.invitationId}` ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <PencilLineIcon
                                  size={16}
                                  className='group-hover/btn:scale-110 transition-transform'
                                />
                              )}
                              Edit
                            </button>
                            <button
                              onClick={() => handleNavigation('/dashboard/invitation/send', `share-${invitation.invitationId}`)}
                              disabled={!!navigatingId}
                              className='flex-1 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-700 hover:to-emerald-600 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-green-500/50 border border-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              {navigatingId === `share-${invitation.invitationId}` ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Share2
                                  size={16}
                                  className='group-hover/btn:scale-110 transition-transform'
                                />
                              )}
                              Bagikan
                            </button>
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
