'use client';

interface Props {
  photos: string[];
}

export default function Gallery({ photos }: Props) {
  const validPhotos = (photos || []).filter((p) => p && p.trim() !== '');
  if (validPhotos.length === 0) return null;

  return (
    <section className='relative bg-white px-8 py-16'>
      <div className='max-w-sm mx-auto space-y-8'>
        <div className='text-center space-y-3'>
          <h2 className='text-2xl font-serif text-[#3d2b1f]'>Galeri Foto</h2>
          <div className='w-12 h-0.5 bg-[#c9a96e] mx-auto' />
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {validPhotos.map((photo, i) => (
            <div key={i} className='aspect-square rounded-xl overflow-hidden border-2 border-[#c9a96e]/30 shadow-md'>
              <img src={photo} alt='' className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
