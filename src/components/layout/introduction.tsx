import Device from '../ui/device';

export default function Introduction() {
  return (
    <div className='w-ful'>
      {/* Device sebagai background */}
      <div className='absolute inset-0 z-0 pt-30'>
        <Device />
      </div>

      {/* Konten di tengah, di atas device */}
      <div className='absolute inset-0 z-10 flex items-center justify-center text-white'>
        <div className='text-center px-4 pt-60'>
          <h1 className='lg:text-5xl text-4xl font-bold '>
            Mulailah perjalanananmu di sini
          </h1>
          <p className='mt-4 text-2xl'>
           Berbagi moment kebahagiaan dengan keluarga, sanak saudara dan sahabat
          </p>
          <div className='flex items-center justify-center gap-10 mt-10'>
            <div className='p-5 bg-pink-500 rounded-xl font-bold text-xl '>
              Explore tema
            </div>
            <div className='p-5 text-pink-100 border border-pink-400 shadow-md backdrop-blur-md bg-transparent rounded-xl font-bold'>Contct Seles</div>
          </div>
        </div>
      </div>
    </div>
  );
}
