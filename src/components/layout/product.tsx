import MagicBento from '@/components/layout/bento';

export default function Product() {
  return (
    <>
      {/* Gradasi hitam dengan efek blur di bagian atas */}
      {/* <div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm z-10' /> */}

      {/* Konten utama */}
      <div className='relative z-20 pt-20 shadow-md backdrop-blur-md bg-transparent mx-auto items-center text-center gap-1'>
        <div className='p-4'>
          <h1 className='text-5xl font-bold text-white mb-2'>
            Apa yang Anda Butuhkan?
          </h1>
          <p className='text-gray-300'>
            Semua yang diperlukan untuk terhubung ke keluarga Anda, kami
            sediakan.
          </p>
        </div>
        <div className='p-5'>
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
    </>
  );
}
