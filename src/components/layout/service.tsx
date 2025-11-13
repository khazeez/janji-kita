import MagicBento from '@/components/layout/bento';

export default function Services() {
  return (
    <>
      {/* Main Content */}
      <div className='relative min-h-screen pt-5 pb-16 px-10'>
        {/* Header Section */}
        <div className='max-w-7xl mx-auto text-center mb-12 md:mb-16'>
          {/* Subtitle Badge */}
          <div className='inline-block mb-6'>
            <span className='bg-gradient-to-r from-pink-500/20 to-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm md:text-base font-medium border border-pink-500/30 backdrop-blur-sm'>
              ✨ Layanan Premium
            </span>
          </div>

          {/* Main Title */}
          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
            <span className='bg-gradient-to-r from-white via-pink-100 to-pink-100 bg-clip-text text-transparent'>
              Apa yang Anda
            </span>
            <span> </span>
            <span className='bg-gradient-to-r from-pink-500 via-pink-400 to-pink-100 bg-clip-text text-transparent font-black'>
              Butuhkan?
            </span>
          </h1>

          {/* Description */}
          <div className='max-w-3xl mx-auto space-y-4'>
            <p className='text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed'>
              Semua yang diperlukan untuk terhubung ke keluarga Anda,
            </p>
            <p className='text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-pink-300 to-pink-300 bg-clip-text text-transparent font-semibold'>
              kami sediakan dengan sempurna.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className='flex flex-wrap justify-center gap-4 md:gap-6 mt-8 md:mt-12'>
            {[
              { icon: '🚀', text: 'Cepat & Mudah' },
              { icon: '💎', text: 'Kualitas Premium' },
              { icon: '🎨', text: 'Design Modern' },
              { icon: '💝', text: 'Penuh Cinta' },
            ].map((item, index) => (
              <div
                key={index}
                className='group flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-all duration-300'
              >
                <span className='text-lg group-hover:scale-110 transition-transform duration-300'>
                  {item.icon}
                </span>
                <span className='text-white/80 text-sm md:text-base font-medium group-hover:text-white transition-colors duration-300'>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Grid Section */}
        <div className='max-w-7xl mx-auto'>
          {/* Section Divider */}
          <div className='flex items-center justify-center mb-8 md:mb-12'>
            <div className='h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent w-full max-w-md'></div>
            <div className='mx-4 bg-gradient-to-r from-pink-500 to-pink-500 w-2 h-2 rounded-full'></div>
            <div className='h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent w-full max-w-md'></div>
          </div>

          {/* Bento Container */}
          <div className='relative'>
            {/* Subtle Corner Accents */}
            <div className='absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-2xl'></div>
            <div className='absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-2xl'></div>

            {/* Bento Grid */}
            <div className='relative z-10'>
              <MagicBento
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor='132, 0, 255'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
