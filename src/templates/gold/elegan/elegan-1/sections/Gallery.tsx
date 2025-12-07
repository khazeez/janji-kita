import { useState } from 'react';
import { X, Heart } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Sample images - ganti dengan foto wedding Anda
  const images = [
    { id: 1, src: '/images/imam22.webp', alt: 'Wedding Photo 1' },
    { id: 2, src: '/images/imam22.webp', alt: 'Wedding Photo 2' },
    { id: 3, src: '/images/imam22.webp', alt: 'Wedding Photo 3' },
    { id: 4, src: '/images/imam22.webp', alt: 'Wedding Photo 4' },
    { id: 5, src: '/images/imam22.webp', alt: 'Wedding Photo 5' },
    { id: 6, src: '/images/imam22.webp', alt: 'Wedding Photo 6' },
    { id: 7, src: '/images/imam22.webp', alt: 'Wedding Photo 7' },
    { id: 8, src: '/images/imam22.webp', alt: 'Wedding Photo 8' },
    { id: 9, src: '/images/imam22.webp', alt: 'Wedding Photo 9' },
    { id: 10, src: '/images/imam22.webp', alt: 'Wedding Photo 10' },
  ];

  return (
    <section className='relative py-12 px-4 bg-transparent overflow-hidden'>
      <style>{`
   
      `}</style>

      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-10 animate-fadeIn'>

          <h2 className='text-4xl md:text-5xl font-madelyn text-white mb-3'>
            Our Moments
          </h2>
        </div>

        {/* Mosaic Gallery */}
        <div
          className='mosaic-container mb-8 animate-fadeIn'
          style={{ animationDelay: '200ms' }}
        >
          {images.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className='mosaic-item group'
              onClick={() => setSelectedImage(index)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img src={image.src} alt={image.alt} />

              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 z-10'></div>

              {/* Number badge */}
              <div className='absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-sm w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-rose-900 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity shadow-lg'>
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className='text-center animate-fadeIn px-4'
          style={{ animationDelay: '1000ms' }}
        >
        </div>
      </div>

      {/* Modal Lightbox */}
      {selectedImage !== null && (
        <div
          className='fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            className='absolute top-40 left-50 md:top-6 md:right-6 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 active:bg-white/30 transition-all z-50 w-12 h-12 rounded-full flex items-center justify-center border border-white/20'
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>

          {/* Image counter */}
          <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 text-sm font-semibold z-50'>
            {selectedImage + 1} / {images.length}
          </div>

          {/* Image container */}
          <div
            className='relative w-full max-w-4xl flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className='max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl'
            />
          </div>

          {/* Navigation */}
          <div className='fixed bottom-6 left-0 right-0 flex items-center justify-center gap-3 px-4 z-50'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(
                  selectedImage > 0 ? selectedImage - 1 : images.length - 1
                );
              }}
              className='bg-white/10 backdrop-blur-md text-white px-6 py-3 md:px-8 md:py-3 rounded-full hover:bg-white/20 active:bg-white/30 transition-all border border-white/20 font-medium text-sm md:text-base'
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
              className='bg-white/10 backdrop-blur-md text-white px-6 py-3 md:px-8 md:py-3 rounded-full hover:bg-white/20 active:bg-white/30 transition-all border border-white/20 font-medium text-sm md:text-base'
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
