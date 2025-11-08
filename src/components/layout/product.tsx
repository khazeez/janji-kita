/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Marquee } from '../magicui/marquee';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const phoneScreens = [
  {
    name: 'Elegant Wedding',
    theme: 'Luxury',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=800&fit=crop',
  },
  {
    name: 'Traditional Javanese',
    theme: 'Adat',
    img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=800&fit=crop',
  },
  {
    name: 'Modern Minimalist',
    theme: 'Gen Z',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=800&fit=crop',
  },
  {
    name: 'Islamic Wedding',
    theme: 'Agama',
    img: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=800&fit=crop',
  },
  {
    name: 'Garden Romance',
    theme: 'Romantic',
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=800&fit=crop',
  },
  {
    name: 'Royal Luxury',
    theme: 'Premium',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=800&fit=crop',
  },
  {
    name: 'Beach Wedding',
    theme: 'Tropical',
    img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=800&fit=crop',
  },
  {
    name: 'Classic Vintage',
    theme: 'Classic',
    img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=800&fit=crop',
  },
  {
    name: 'Floral Dream',
    theme: 'Elegant',
    img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=800&fit=crop',
  },
  {
    name: 'Urban Chic',
    theme: 'Modern',
    img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=800&fit=crop',
  },
];

const PhoneCard = ({
  img,
  name,
  theme,
}: {
  img: string;
  name: string;
  theme: string;
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-fit cursor-pointer overflow-hidden rounded-xl border p-3',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
        // Individual pause on hover untuk setiap card
        'group/card'
      )}
    >
      <div className='flex flex-col items-center gap-1'>
        {/* Phone mockup - LEBIH BESAR */}
        <div className='relative w-44 h-80 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-800 transition-transform duration-300 group-hover/card:scale-105'>
          {/* Notch */}
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-2xl z-10' />

          {/* Screen */}
          <div className='relative w-full h-full bg-white rounded-[2rem] overflow-hidden'>
            <img src={img} alt={name} className='w-full h-full object-cover' />

            {/* Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

            {/* Text on image */}
            <div className='absolute bottom-3 left-3 right-3'>
              <p className='text-white font-bold text-sm drop-shadow-lg'>
                {name}
              </p>
              <p className='text-white/80 text-xs drop-shadow-lg'>{theme}</p>
            </div>
          </div>

          {/* Home Indicator */}
          <div className='absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full' />
        </div>
      </div>
    </figure>
  );
};

// Buat rows yang berbeda untuk setiap kolom marquee
const firstRow = phoneScreens.slice(0, 5);
const secondRow = phoneScreens.slice(2, 7);
const thirdRow = phoneScreens.slice(4, 9);
const fourthRow = phoneScreens.slice(1, 6);
const fiveRow = phoneScreens.slice(3, 8);
const sixRow = phoneScreens.slice(0, 5);
const sevenRow = phoneScreens.slice(5, 10);
const eightRow = phoneScreens.slice(2, 7);
const nineRow = phoneScreens.slice(1, 6);

export default function Product() {
  return (
    <>
      <style>
        {`
    /* 🔥 Hentikan animasi marquee jika mouse hover pada kolom manapun */
    .group\/marquee:hover .animate-marquee,
    .group\/marquee:hover .animate-marquee-vertical {
      animation-play-state: paused !important;
    }
  `}
      </style>

      {/* Hero Title Section */}
      <div className='pt-20 pb-16 px-4'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className='inline-block mb-4 md:mb-6'>
            <span className='text-white/60 text-sm md:text-lg font-medium tracking-wider uppercase'>
              Koleksi Eksklusif
            </span>
          </div>

          <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8'>
            <span className='text-white animate-pulse'>Dengan </span>
            <span className='relative inline-block'>
              <span className='bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-black px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl font-black shadow-lg shadow-pink-500/30 animate-pulse'>
                100+ thema
              </span>
            </span>
            <span className='text-white animate-pulse'>
              {' '}
              yang kami sediakan
            </span>
          </h1>

          <p className='text-white/60 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-2'>
            Temukan tema sempurna untuk momen spesial Anda dengan koleksi
            eksklusif yang telah dipilih khusus
          </p>
        </div>
      </div>

      {/* Marquee Section */}
      <div className='relative flex h-200 w-full flex-row items-center justify-center gap-1 overflow-hidden [perspective:2000px] mb-20'>
        <div
          className='flex flex-row items-center gap-1'
          style={{
            transform:
              'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          <div className='group/marquee'>
            <Marquee
              pauseOnHover
              vertical
              className='[--duration:20s] [--gap:0rem]'
            >
              {firstRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              reverse
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {secondRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              reverse
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {thirdRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {fourthRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {fiveRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {sixRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {sevenRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {sevenRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
          <div className='group/marquee'>
            <Marquee
              pauseOnHover
              className='[--duration:20s] [--gap:0rem]'
              vertical
            >
              {sevenRow.map((phone) => (
                <PhoneCard key={phone.name} {...phone} />
              ))}
            </Marquee>
          </div>
        </div>

        <div className='pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background'></div>
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background'></div>
        <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background'></div>
        <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background'></div>
      </div>

      {/* Themes Section */}
      <div className='relative px-4 pb-20'>
        <div className='relative w-full h-[500px] flex items-center justify-center my-20'>
          {/* Garis Horizontal */}
          <div className='absolute top-1/2 left-0 w-full h-px bg-white/30 -translate-y-1/2' />

          {/* Garis Vertikal */}
          <div className='absolute left-1/2 top-0 h-full w-px bg-white/30 -translate-x-1/2' />

          {/* Tema di sekitar garis */}
          <div className='absolute grid grid-cols-2 grid-rows-2 gap-20 text-center text-white'>
            {/* Kiri Atas */}
            <div className=''>
              <h3 className='text-xl md:text-4xl bg-gradient-to-r from-pink-500 via-pink-400 to-pink-100 bg-clip-text text-transparent font-black'>
                Thema Adat
              </h3>
              <p className='text-white/60 mt-2'>
                10+ pilihan adat populer yang autentik dan berkesan.
              </p>
            </div>

            {/* Kanan Atas */}
            <div className=''>
              <h3 className='text-xl md:text-4xl bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent font-black'>
                Thema Agama
              </h3>
              <p className='text-white/60 mt-2'>
                Perpaduan budaya dan agama yang menawan.
              </p>
            </div>

            {/* Kiri Bawah */}
            <div className=''>
              <h3 className='text-xl md:text-4xl bg-gradient-to-r from-blue-500 via-blue-400 to-blue-100 bg-clip-text text-transparent font-black'>
                Thema Gen Z
              </h3>
              <p className='text-white/60 mt-2'>
                Desain modern yang cocok untuk generasi muda.
              </p>
            </div>

            {/* Kanan Bawah */}
            <div className=''>
              <h3 className='text-xl md:text-4xl bg-gradient-to-r from-purple-100 via-purple-400 to-purple-500 bg-clip-text text-transparent font-black'>
                Thema Luxury
              </h3>
              <p className='text-white/60 mt-2'>
                Nuansa mewah dan elegan yang tak terlupakan.
              </p>
            </div>
          </div>
        </div>

        {/* Background decorative elements for themes section */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute bottom-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl'></div>
          <div className='absolute top-40 right-20 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl'></div>
        </div>
        <div className='max-w-4xl mx-auto text-center mt-16 md:mt-20'>
          <div className='bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12'>
            <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4'>
              <span className='bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent'>
                Siap untuk memulai?
              </span>
            </h3>

            <p className='text-gray-300 text-lg md:text-xl mb-8 leading-relaxed'>
              Bergabunglah dengan ribuan keluarga yang telah merasakan
              kebahagiaan bersama kami
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className='group bg-gradient-to-r from-pink-700 to-pink-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-pink-300 transition-all duration-300 transform shadow-lg shadow-pink-500/25'>
                <span className='flex items-center gap-2'>
                  Mulai Sekarang
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>
                    →
                  </span>
                </span>
              </button>

              <button className='group text-white border border-pink-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink hover:border-pink-300 transition-all duration-300'>
                <span className='flex items-center gap-2'>
                  Pelajari Lebih Lanjut
                  <span className='group-hover:rotate-45 transition-transform duration-300'>
                    ↗
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
