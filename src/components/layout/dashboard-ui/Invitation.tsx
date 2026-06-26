'use client';
import { useState, useMemo, useEffect } from 'react';
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
  Palette,
  UserPlus,
  CreditCard,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Props = {
  data: AllInvitationData[];
};

function InteractiveTutorial() {
  const [step, setStep] = useState(0);

  const steps = [
    { icon: Palette, title: 'Pilih Tema' },
    { icon: UserPlus, title: 'Masukkan Data' },
    { icon: CreditCard, title: 'Aktivasi & Pembayaran' },
    { icon: Send, title: 'Bagikan' },
  ];

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className='py-6 sm:py-10 px-2 sm:px-6 max-w-full sm:max-w-md mx-auto'>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        .animate-breathe {
          animation: breathe 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(219, 39, 119, 0.6); transform: scale(1); }
          50% { box-shadow: 0 0 0 12px rgba(219, 39, 119, 0); transform: scale(1.05); }
        }
        .animate-pulse-btn {
          animation: pulse-btn 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <h2 className='text-center text-white font-bold text-xl sm:text-2xl mb-5'>
        Tutorial Bikin Undangan Kece😉
      </h2>

      {/* Big Card */}
      <div className='relative bg-gray-800/60 border border-gray-700/50 rounded-2xl py-16 sm:py-20 px-8 sm:px-12 text-center overflow-hidden'>
        {/* Decorative dots */}
        <div className='absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-1.5'>
          <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-500/40 animate-twinkle' style={{ animationDelay: '0s' }} />
          <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-500/40 animate-twinkle' style={{ animationDelay: '0.5s' }} />
          <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-500/40 animate-twinkle' style={{ animationDelay: '1s' }} />
        </div>

        {/* Icon */}
        <div className='relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-5'>
          <div className='absolute inset-0 rounded-full bg-pink-500/20 animate-breathe' />
          <div className='relative w-full h-full rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center'>
            <Icon className='w-10 h-10 sm:w-11 sm:h-11 text-pink-400 animate-float' />
          </div>
        </div>

        <h3 className='text-white font-bold text-2xl sm:text-3xl'>{current.title}</h3>

        {/* Bottom decoration */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1'>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className='w-1.5 h-1.5 rounded-full bg-pink-500/30 animate-twinkle'
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className='flex items-center justify-between mt-5 sm:mt-6 gap-2'>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className='flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-800'
        >
          <ChevronLeft size={14} className='sm:w-4 sm:h-4' />
          <span className='sm:hidden'>Sebelum</span>
          <span className='hidden sm:inline'>Sebelumnya</span>
        </button>

        <div className='flex gap-1.5 sm:gap-2'>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all duration-300 ${
                i === step ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-pink-500' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            className={`flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white rounded-lg transition-colors ${
              step === 0 ? 'bg-pink-500 animate-pulse-btn' : 'bg-pink-600 hover:bg-pink-500'
            }`}
          >
            <span className='sm:hidden'>Lanjut</span>
            <span className='hidden sm:inline'>Selanjutnya</span>
            <ChevronRight size={14} className='sm:w-4 sm:h-4' />
          </button>
        ) : (
          <Link
            href='/dashboard/catalogue'
            className='flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors font-semibold'
          >
            <Sparkles size={14} className='sm:w-4 sm:h-4' />
            Mulai
          </Link>
        )}
      </div>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const calcRemaining = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return <span className="text-gray-500 text-xs font-medium">Sudah Lewat</span>;
    return <span className="text-green-400 text-xs font-semibold">Hari Ini</span>;
  }

  return (
    <span className="text-white text-xs font-mono tracking-wider">
      {remaining.days > 0 && <span className="text-pink-400 font-bold">{remaining.days} Hari </span>}
      <span>{pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}</span>
    </span>
  );
}

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
        {data.length > 0 && (
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
        )}

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
          <InteractiveTutorial />
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

                    {/* Countdown */}
                    {invitation.invitationEvent && invitation.invitationEvent.length > 0 && invitation.invitationStatus !== 'draft' && (
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={14} className="text-pink-500" />
                        <CountdownTimer targetDate={invitation.invitationEvent[0].startTime} />
                      </div>
                    )}

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

                    {/* Published invitation link */}
                    {invitation.invitationStatus === 'published' && (
                      <a
                        href={`https://janjikita.art/${invitation.invitationUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 mb-4 text-gray-400 hover:text-green-400 transition-colors group/link"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-xs font-mono truncate">
                          janjikita.art/{invitation.invitationUrl}
                        </span>
                        <svg className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
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
                              className='flex-1 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-pink-500/50 border border-pink-400/20 disabled:opacity-50 disabled:cursor-not-allowed'
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
                                : 'Buat Undangan'}
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
