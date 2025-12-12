import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelopeOpen } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface CoverPageProps {
  guestName?: string;
  isOpen: boolean;
  onOpen: () => void;
  bridePhoto?: string;
  weddingDate?: string;
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

  // Prefetch images
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedCount((prev) => prev + 1);
      };
    });
  }, []);

  const progress = Math.round((loadedCount / totalImages) * 100);
  const isLoaded = progress === 100;

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className='fixed inset-0 flex items-center justify-center overflow-hidden'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
        >
          {/* 🌿 Background */}
          <div className='absolute inset-0'>
            <img
              src={bridePhoto || '/images/imam73.webp'}
              alt='Background'
              className='w-full h-full object-cover brightness-75 scale-105 animate-slow-zoom'
            />
            <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-[110%] h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent'></div>
          </div>

          {/* ✨ Main Container */}
          <div className='relative z-10 flex flex-col items-center justify-between h-screen pb-10 px-8'>
            {/* Logo */}
            <div className='text-center text-white pt-5'>
              <h1 className='flex items-center justify-center'>
                <span className='text-9xl font-madelyn leading-none'>I</span>
                <span className='text-6xl font-rumble-brave leading-none'>
                  E
                </span>
              </h1>
            </div>

            {/* ✨ Main Content */}
            <motion.div
              className='text-center text-white pt-40'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Guest Name */}
              {guestName && (
                <motion.div
                  className='mb-8'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <p className='text-sm italic text-white'>Kepada tamu Yth.</p>
                  <p className='text-sm italic text-white'>
                    Bapak/Ibu/Saudara/i
                  </p>
                  <p className='text-lg font-semibold text-white mt-1 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]'>
                    {guestName}
                  </p>
                </motion.div>
              )}

              {/* Buka Button */}
              <motion.button
                onClick={isLoaded ? onOpen : undefined}
                disabled={!isLoaded}
                className={`relative px-6 py-3 border border-white text-white rounded-full font-sm overflow-hidden group transition-all ${
                  isLoaded
                    ? 'opacity-100 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                whileHover={isLoaded ? { scale: 1.05 } : {}}
                whileTap={isLoaded ? { scale: 0.95 } : {}}
              >
                <div className='absolute inset-0 bg-white/10 backdrop-blur-md -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full'></div>
                <span className='relative z-10 flex items-center gap-2'>
                  <FaEnvelopeOpen className='text-sm' />
                  {isLoaded ? 'Buka Undangan' : `Memuat... ${progress}%`}
                </span>
              </motion.button>
            </motion.div>

            <div className='h-20'></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
