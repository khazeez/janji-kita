import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface GalleryProps {
  photos?: string[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<number[]>([]);

  const defaultImages = [
    { id: 1, src: '/images/imam105.webp', alt: 'Wedding Photo 1' },
    { id: 2, src: '/images/imam110.webp', alt: 'Wedding Photo 2' },
    { id: 3, src: '/images/imam31.webp', alt: 'Wedding Photo 3' },
    { id: 4, src: '/images/imam53.webp', alt: 'Wedding Photo 4' },
    { id: 5, src: '/images/imam22.webp', alt: 'Wedding Photo 5' },
    { id: 6, src: '/images/imam39.png', alt: 'Wedding Photo 6' },
    { id: 7, src: '/images/imam81.webp', alt: 'Wedding Photo 7' },
    { id: 8, src: '/images/imam22.webp', alt: 'Wedding Photo 8' },
    { id: 9, src: '/images/imam73.webp', alt: 'Wedding Photo 9' },
    { id: 10, src: '/images/imam77.webp', alt: 'Wedding Photo 10' },
  ];

  const images = photos && photos.length > 0 
    ? photos.map((src, index) => ({ id: index + 1, src, alt: `Wedding Photo ${index + 1}` }))
    : defaultImages;

  const mosaicPattern = [
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
  ];

  useEffect(() => {
    images.forEach((_, index) => {
      setTimeout(() => {
        setVisibleImages((prev) => [...prev, index]);
      }, index * 200);
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .photo-visible {
          animation: fadeInScale 0.8s ease-out forwards;
        }
        
        .photo-hidden {
          opacity: 0;
        }
      `}</style>

      <section className='relative py-12 px-4 bg-transparent overflow-hidden'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='font-amalfi text-white mb-3 text-4xl'>
              Our Moments
            </h2>
          </div>

          <div className='grid grid-cols-3 gap-1 auto-rows-[120px]'>
            {images.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                onClick={() => setSelectedImage(index)}
                className={`relative cursor-pointer overflow-hidden border-3 border-white shadow-lg group ${
                  mosaicPattern[index % mosaicPattern.length]
                } ${
                  visibleImages.includes(index)
                    ? 'photo-visible'
                    : 'photo-hidden'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                />

                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                <div className='absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-rose-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-md'>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedImage !== null && (
          <div
            className='fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4'
            onClick={() => setSelectedImage(null)}
          >
            <button
              className='absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all z-50 w-10 h-10 rounded-full flex items-center justify-center border border-white/20'
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </button>

            <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold z-50'>
              {selectedImage + 1} / {images.length}
            </div>

            <div
              className='relative w-full max-w-4xl flex items-center justify-center'
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className='max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl fade-up delay-2'
              />
            </div>

            <div className='fixed bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-50'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(
                    selectedImage > 0 ? selectedImage - 1 : images.length - 1
                  );
                }}
                className='bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full hover:bg-white/20 transition-all border border-white/20 text-sm font-medium'
              >
                ← Prev
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(
                    selectedImage < images.length - 1 ? selectedImage + 1 : 0
                  );
                }}
                className='bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full hover:bg-white/20 transition-all border border-white/20 text-sm font-medium'
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
