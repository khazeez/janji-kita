'use client';

import { useState, useEffect } from 'react';
import { AllInvitationData } from '@/types/interface';
import { motion } from 'framer-motion';

export interface Props {
  data: AllInvitationData;
}

export default function Introduction({ data }: Props) {
  // ✅ Ambil event AKAD
  const akadEvent = data?.invitationEvent?.find(
    (event) => event.eventType === 'AKAD'
  );

  // ✅ Format tanggal, jam, dan lokasi
  const akadDate = akadEvent
    ? new Date(akadEvent.startTime).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Tanggal belum ditentukan';

  const akadTime = akadEvent
    ? new Date(akadEvent.startTime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    : '-';

  const akadLocation = akadEvent?.location || '-';

  // ✅ State countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Pastikan ada waktu akad
    if (!akadEvent?.startTime) return;

    const target = new Date(akadEvent.startTime).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = target - now;

      if (isNaN(target)) {
        console.warn('❌ startTime invalid:', akadEvent.startTime);
        return;
      }

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    // Jalankan langsung sekali di awal
    updateCountdown();

    // Lalu update tiap detik
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [akadEvent?.startTime]);

  return (
    <div className='relative min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden mt-80'>
      <p className='text-sm tracking-widest'>THE WEDDING OF</p>

      <h1 className='text-6xl font-brown-sugar px-10'>
        {data.invitationDataUser.groomNickName} &{' '}
        {data.invitationDataUser.brideNickName}
      </h1>

      <p className='text-sm tracking-widest mb-20'>{akadDate}</p>

    <p className='text-sm tracking-widest'>SAVE THE DATE</p>
      <motion.div
        className='flex justify-center gap-3 sm:gap-4 mt-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {[
          { label: 'Hari', value: timeLeft.days },
          { label: 'Jam', value: timeLeft.hours },
          { label: 'Menit', value: timeLeft.minutes },
          { label: 'Detik', value: timeLeft.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className='text-center px-3 border border-white rounded-md bg-white/10 backdrop-blur-md shadow-inner'
          >
            <p className='text-2xl font-semibold text-white'>{item.value}</p>
            <p className='text-[10px] uppercase tracking-widest text-white'>
              {item.label}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
