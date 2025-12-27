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
        <div className='text-center md:px-20 px-5 pt-60'>
          <h1 className='md:text-5xl text-3xl font-bold'>
            Buat undangan estetikmu sendiri hanya dalam waktu 5 menit!
          </h1>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-10'>
            {/* Primary Button */}

            <Link
              href='/sign-up'
              className='group px-6 py-4 md:px-8 md:py-5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform shadow-lg shadow-pink-500/25 w-full sm:w-auto'
            >
              <span className='flex items-center justify-center gap-2'>
                Get Started
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
