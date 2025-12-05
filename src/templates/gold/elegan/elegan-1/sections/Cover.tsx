import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelopeOpen } from 'react-icons/fa';
import { useState } from 'react';

interface CoverPageProps {
  guestName?: string;
  isOpen: boolean;
  onOpen: () => void;
  bridePhoto?: string;
  weddingDate?: string;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  guestName,
  isOpen,
  onOpen,
  bridePhoto,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/20'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
        >
          {/* 🌿 Background */}
          <div className='absolute inset-0'>
            <img
              src={bridePhoto || '/images/cover2.jpeg'}
              alt='Background'
              className='w-full h-full object-cover brightness-95 scale-105 animate-slow-zoom'
            />
            <div className='absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-emerald-900/90 via-emerald-800/50 to-transparent'></div>
          </div>

          {/* ✨ Konten Utama */}
          <motion.div
            className='relative z-20 text-center text-white px-8 max-w-lg w-full'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >

            {/* 🎀 Nama Tamu */}
            {guestName && (
              <motion.div
                className='mb-8'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <p className='text-sm italic text-emerald-100'>Dear</p>
                <p className='text-lg font-semibold text-white mt-1 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]'>
                  {guestName}
                </p>
              </motion.div>
            )}

            {/* 🌿 Tombol Buka */}
            <motion.button
              onClick={onOpen}
              className='group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-full font-medium shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300 overflow-hidden'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className='relative z-10 flex items-center gap-2'>
                <FaEnvelopeOpen className='text-sm' />
                Buka Undangan
              </span>
              <div className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-40 blur-sm' />
            </motion.button>

            {/* ✨ Ornament bawah */}
            <motion.div
              className='mt-10'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className='w-32 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto' />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
