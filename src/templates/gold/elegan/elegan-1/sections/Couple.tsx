'use client';

import { InvitationDataUser } from '@/types/interface';
import { Instagram } from 'lucide-react';

export interface Props {
  data: InvitationDataUser;
}

export default function Couple({ data }: Props) {
  // Array foto untuk marquee (bisa ganti sesuai kebutuhan)
  const photos = [
    '/images/imam22.webp',
    '/images/imam31.webp',
    '/images/imam39.png',
    '/images/imam53.webp',
    '/images/imam73.webp',
    '/images/imam81.webp',
    '/images/imam110.webp',
  ];

  return (
    <div className='relative py-16 bg-transparent mx-2'>
      {/* Marquee Foto dengan Gradient Mask */}
      <div className='relative overflow-hidden mb-12'>
        {/* Gradient Overlay Kiri */}
        {/* Gradient dengan opacity fade */}
        <div className='absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none'>
          <div className='w-full h-full bg-gradient-to-r from-black/60 via-black/20 to-transparent'></div>
        </div>

        <div className='absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none'>
          <div className='w-full h-full bg-gradient-to-l from-black/60 via-black/20 to-transparent'></div>
        </div>
        {/* Marquee Container */}
        <div className='flex gap-0 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]'>
          {/* Render foto 2x untuk infinite loop */}
          {[...photos, ...photos].map((photo, index) => (
            <div
              key={index}
              className='flex-shrink-0 w-20 h-30 border-2 border-white overflow-hidden shadow-lg '
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detail Mempelai */}
      <div className=' py-20 px-2 space-y-12 backdrop-blur-xs text-white'>
        {/* Groom */}
        <div className='w-full'>
          <div className='groom flex items-start gap-4 justify-start'>
            <div className='flex-shrink-0'>
              <img
                src={'/images/groom.webp'}
                alt={data.brideNickName}
                className='w-68 h-88 border-4 border-b-30 border-white object-cover shadow-xl'
              />
            </div>
            <div className='flex'>
              <p className='text-5xl font-bold ml-8 text-white tracking-widest font-brown-sugar whitespace-nowrap origin-left rotate-90'>
                THE GROOM
              </p>
            </div>
          </div>

          <div className='detail text-left mt-4'>
            <h2 className='text-xl font-amalfi mb-2 text-white'>
              {data.groomFullName}
            </h2>
            {data.groomParentName && (
              <p className='text-sm mt-2'>Putra dari {data.groomParentName}</p>
            )}
            {data.groomInstagram && (
              <a
                href={`https://instagram.com/${data.groomInstagram.replace(
                  '@',
                  ''
                )}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 mt-2 text-sm hover:text-gray-300 transition-colors'
              >
                <Instagram size={16} />
                <span>{data.groomInstagram}</span>
              </a>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className='flex items-center justify-center'>
          <div className='h-px bg-gray-300 w-24'></div>
          <span className='mx-4 text-2xl font-brown-sugar'>&</span>
          <div className='h-px bg-gray-300 w-24'></div>
        </div>

        {/* Bride */}
        {/* Bride */}
        <div className='w-full'>
          <div className='bride flex items-start gap-4 justify-end'>
            <div className='flex'>
              <p className='text-5xl font-bold mr-8 text-white tracking-widest font-brown-sugar whitespace-nowrap origin-right -rotate-90'>
                THE BRIDE
              </p>
            </div>
            <div className='flex-shrink-0'>
              <img
                src={'/images/bride.webp'}
                alt={data.brideNickName}
                className='w-68 h-88 border-4 border-b-30 border-white object-cover shadow-xl'
              />
            </div>
          </div>

          <div className='detail text-right mt-4'>
            <h2 className='text-xl font-amalfi mb-2 text-white'>
              {data.brideFullName}
            </h2>
            {data.brideParentName && (
              <p className='text-sm mt-2'>Putri dari {data.brideParentName}</p>
            )}
            {data.brideInstagram && (
              <a
                href={`https://instagram.com/${data.brideInstagram.replace(
                  '@',
                  ''
                )}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 mt-2 text-sm hover:text-gray-300 transition-colors'
              >
                <Instagram size={16} />
                <span>{data.brideInstagram}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
