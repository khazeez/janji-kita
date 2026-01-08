import Device from '../ui/device';
import Link from 'next/link';

export default function Introduction() {
  return (
    <div className='w-full'>
      {/* Device sebagai background */}
      <div className='absolute inset-0 z-0 pt-30'>
        <Device />
      </div>

      {/* Konten di tengah, di atas device */}
      <div className='absolute inset-0 z-10 flex items-center justify-center text-white'>
        <div className='text-center md:px-20 px-5 pt-30'>
          <h1 className='md:text-5xl text-3xl font-bold'>
            Buat undangan,{' '}
            <span className='relative inline-block text-pink-500'>
              15 detik
              <svg
                className='absolute left-0 -bottom-1 w-full h-4 pt-2 text-pink-300'
                viewBox='0 0 100 20'
                preserveAspectRatio='none'
              >
                <path
                  d='M 2 15 Q 50 2, 98 12'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='10'
                  strokeLinecap='round'
                  opacity='0.8'
                />
              </svg>
            </span>{' '}
            langsung jadi!
          </h1>
          <p className='text-center lg:text-xl text-white/80 mt-2'>
            Ga perlu ngerti koding, ga perlu paham design, cuman modal niat &
            kuota internet.
          </p>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-10'>
            {/* Primary Button */}

            <Link
              href='/sign-up'
              className='group px-6 py-4 md:px-8 md:py-5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform shadow-lg shadow-pink-500/25 w-full sm:w-auto'
            >
              <span className='flex items-center justify-center gap-2'>
                Cobain sendiri
                <span className='group-hover:translate-x-1 transition-transform duration-300'>
                  →
                </span>
              </span>
            </Link>

            {/* Secondary Button */}
            <Link
              href='/catalogue'
              className='group px-6 py-4 md:px-8 md:py-5 text-pink-100 border-2 border-pink-400/70 hover:border-pink-400 backdrop-blur-md bg-black/10 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform w-full sm:w-auto hover:text-white'
            >
              <span className='flex items-center justify-center gap-2'>
                Lihat tema
                <span className='group-hover:rotate-45 transition-transform duration-300'>
                  ↗
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
