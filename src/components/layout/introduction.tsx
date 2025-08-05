import Device from '../ui/device';

export default function Introduction() {
  return (
    <div className='w-full'>
      {/* Device sebagai background */}
      <div className='absolute inset-0 z-0 pt-30'>
        <Device />
      </div>

      {/* Konten di tengah, di atas device */}
      <div className='absolute inset-0 z-10 flex items-center justify-center text-white'>
        <div className='text-center px-4 pt-60'>
          <h1 className='md:text-5xl text-3xl font-bold'>
            Mulailah perjalanananmu di sini
          </h1>
          <p className='mt-4 md:text-2xl text-sm'>
            Berbagi moment kebahagiaan dengan keluarga, sanak saudara dan sahabat
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-10'>
            {/* Primary Button */}
            <button className='group px-6 py-4 md:px-8 md:py-5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/25 w-full sm:w-auto'>
              <span className='flex items-center justify-center gap-2'>
                Explore Tema
                <span className='group-hover:translate-x-1 transition-transform duration-300'>→</span>
              </span>
            </button>
            
            {/* Secondary Button */}
            <button className='group px-6 py-4 md:px-8 md:py-5 text-pink-100 border-2 border-pink-400/70 hover:border-pink-400 hover:bg-pink-500/10 backdrop-blur-md bg-black/10 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto'>
              <span className='flex items-center justify-center gap-2'>
                Contact Sales
                <span className='group-hover:rotate-12 transition-transform duration-300'>↗</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}