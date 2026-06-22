import { useState, useEffect } from 'react';
import { FaEnvelopeOpen } from 'react-icons/fa';

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = bridePhoto || '/images/imam73.webp';
  }, [bridePhoto]);

  return (
    <div
      className={`
        absolute inset-0 z-50
        flex items-center justify-center
        overflow-hidden
        transition-all duration-700 ease-out
        ${isOpen ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 pointer-events-auto'}
      `}
    >
      <div className='absolute inset-0'>
        <img
          src={bridePhoto || '/images/imam73.webp'}
          alt='Background'
          loading='lazy'
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

      <div className='relative z-10 flex flex-col items-center justify-between h-full w-full pb-10 px-8'>
        <div className='text-center text-white pt-6'>
          <h1 className='flex items-center justify-center'>
            <span className='text-9xl font-madelyn leading-none'>I</span>
            <span className='text-6xl font-rumble-brave leading-none'>E</span>
          </h1>
        </div>

        <div className='text-center text-white animate-fadeUp'>
          {guestName && (
            <div className='mb-8 animate-fadeIn' style={{ animationDelay: '1s', animationFillMode: 'backwards' }}>
              <p className='text-sm italic'>Kepada Yth.</p>
              <p className='text-sm italic'>Bapak/Ibu/Saudara/i</p>
              <p className='text-lg font-semibold mt-1'>{guestName}</p>
            </div>
          )}

          <button
            onClick={onOpen}
            className='
              relative px-6 py-3
              border border-white
              rounded-full
              text-white
              overflow-hidden
              hover:scale-105 active:scale-95
              transition-transform duration-200
            '
          >
            <span className='relative z-10 flex items-center gap-2'>
              <FaEnvelopeOpen />
              Buka Undangan
            </span>
          </button>
        </div>

        <div className='h-12' />
      </div>

      {!loaded && (
        <div className='absolute bottom-6 text-white text-xs animate-fadeIn'>
          Memuat...
        </div>
      )}
    </div>
  );
}
