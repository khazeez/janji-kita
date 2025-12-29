import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelopeOpen } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface CoverPageProps {
  guestName?: string;
  isOpen: boolean;
  onOpen: () => void;
  bridePhoto?: string;
}

export default function Cover({
  guestName,
  isOpen,
  onOpen,
  bridePhoto,
}: CoverPageProps) {
  const images = [
    '/images/imam22.webp',
    '/images/imam39.png',
    '/images/imam53.webp',
    '/images/imam73.webp',
  ];

  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = images.length;

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoadedCount((p) => p + 1);
    });
  }, []);

  const progress = Math.round((loadedCount / totalImages) * 100);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          /* ⬇️ PENTING: absolute, BUKAN fixed */
          className='
            absolute inset-0
            z-50
            flex items-center justify-center
            overflow-hidden
          '
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background */}
          <div className='absolute inset-0'>
            <img
              src={bridePhoto || '/images/imam73.webp'}
              alt='Background'
              className='
                w-full h-full
                object-cover object-center
                brightness-75
                scale-105
                animate-slow-zoom
              '
            />
            <div className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent' />
          </div>

          {/* Content */}
          <div className='relative z-10 flex flex-col items-center justify-between h-full w-full pb-10 px-8'>
            {/* Logo */}
            <div className='text-center text-white pt-6'>
              <h1 className='flex items-center justify-center'>
                <span className='text-9xl font-madelyn leading-none'>I</span>
                <span className='text-6xl font-rumble-brave leading-none'>
                  E
                </span>
              </h1>
            </div>

            {/* Main */}
            <motion.div
              className='text-center text-white'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {guestName && (
                <motion.div
                  className='mb-8'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className='text-sm italic'>Kepada Yth.</p>
                  <p className='text-sm italic'>Bapak/Ibu/Saudara/i</p>
                  <p className='text-lg font-semibold mt-1'>{guestName}</p>
                </motion.div>
              )}

              <motion.button
                onClick={onOpen}
                className='
                  relative px-6 py-3
                  border border-white
                  rounded-full
                  text-white
                  overflow-hidden
                '
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className='relative z-10 flex items-center gap-2'>
                  <FaEnvelopeOpen />
                  Buka Undangan
                </span>
              </motion.button>
            </motion.div>

            <div className='h-12' />
          </div>

          {/* Loader */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loadedCount < totalImages ? 1 : 0 }}
            className='absolute bottom-6 text-white text-xs'
          >
            Memuat foto... {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
