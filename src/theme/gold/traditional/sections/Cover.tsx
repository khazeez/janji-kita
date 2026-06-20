'use client';

import { useState } from 'react';

interface Props {
  guestName: string;
  bridePhoto?: string;
  groomPhoto?: string;
  onOpen: () => void;
}

export default function Cover({ guestName, bridePhoto, groomPhoto, onOpen }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onOpen, 600);
  };

  return (
    <div
      className={`absolute inset-0 z-30 transition-all duration-700 ${
        isOpen ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100'
      }`}
    >
      <div className='traditional-cover h-full flex flex-col items-center justify-center px-8 relative overflow-hidden'>
        <div className='traditional-ornament absolute inset-0 opacity-30' />

        <div className='relative z-10 text-center space-y-6 animate-fade-in-up'>
          <div className='flex items-center justify-center gap-1'>
            <div className='h-px w-12 bg-[#c9a96e]' />
            <span className='text-[#c9a96e] text-xs tracking-[0.3em] uppercase font-serif'>The Wedding</span>
            <div className='h-px w-12 bg-[#c9a96e]' />
          </div>

          <div className='flex justify-center gap-4'>
            <div className='w-24 h-24 rounded-full overflow-hidden border-3 border-[#c9a96e] shadow-lg'>
              <img src={groomPhoto || '/images/groom.webp'} alt='' className='w-full h-full object-cover' />
            </div>
            <div className='flex items-center'>
              <span className='text-3xl text-[#3d2b1f] font-serif italic'>&</span>
            </div>
            <div className='w-24 h-24 rounded-full overflow-hidden border-3 border-[#c9a96e] shadow-lg'>
              <img src={bridePhoto || '/images/bride.webp'} alt='' className='w-full h-full object-cover' />
            </div>
          </div>

          <h1 className='text-3xl font-serif text-[#3d2b1f] tracking-wide'>
            Undangan Pernikahan
          </h1>

          <p className='text-[#6b5b4e] text-sm font-serif italic'>
            “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
          </p>
          <p className='text-[#6b5b4e] text-xs'>QS. Ar-Rum: 21</p>

          {guestName && (
            <p className='text-[#3d2b1f] text-sm'>
              Kepada Yth. Bapak/Ibu/Saudara/i <br />
              <span className='text-lg font-bold'>{guestName}</span>
            </p>
          )}

          <button
            onClick={handleOpen}
            className='px-8 py-3 bg-[#c9a96e] hover:bg-[#b8954d] text-white rounded-full transition-all font-serif tracking-wider shadow-lg'
          >
            Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );
}
