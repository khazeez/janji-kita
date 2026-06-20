'use client';

import { InvitationDataUser } from '@/types/interface';
import { Instagram } from 'lucide-react';

export interface Props {
  data: InvitationDataUser;
}

export default function Couple({ data }: Props) {
  return (
    <section className='relative bg-white px-8 py-16'>
      <div className='max-w-sm mx-auto space-y-12'>
        <div className='text-center space-y-3'>
          <h2 className='text-2xl font-serif text-[#3d2b1f]'>Kedua Mempelai</h2>
          <div className='w-12 h-0.5 bg-[#c9a96e] mx-auto' />
        </div>

        <div className='text-center space-y-4'>
          <div className='w-32 h-32 mx-auto rounded-full overflow-hidden border-3 border-[#c9a96e] shadow-md'>
            <img src={data.groomPhotoUrl || '/images/groom.webp'} alt='' className='w-full h-full object-cover' />
          </div>
          <div>
            <h3 className='text-xl font-serif text-[#3d2b1f]'>{data.groomFullName}</h3>
            <p className='text-sm text-[#6b5b4e] mt-1'>Putra dari {data.groomParentName}</p>
            {data.groomInstagram && (
              <a href={`https://instagram.com/${data.groomInstagram.replace('@', '')}`} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 text-xs text-[#c9a96e] hover:text-[#b8954d] mt-2'>
                <Instagram size={14} /> {data.groomInstagram}
              </a>
            )}
          </div>
        </div>

        <div className='flex items-center justify-center gap-4'>
          <div className='h-px flex-1 bg-[#c9a96e]' />
          <div className='w-10 h-10 rounded-full border-2 border-[#c9a96e] flex items-center justify-center text-[#c9a96e] font-serif text-lg italic'>&</div>
          <div className='h-px flex-1 bg-[#c9a96e]' />
        </div>

        <div className='text-center space-y-4'>
          <div className='w-32 h-32 mx-auto rounded-full overflow-hidden border-3 border-[#c9a96e] shadow-md'>
            <img src={data.bridePhotoUrl || '/images/bride.webp'} alt='' className='w-full h-full object-cover' />
          </div>
          <div>
            <h3 className='text-xl font-serif text-[#3d2b1f]'>{data.brideFullName}</h3>
            <p className='text-sm text-[#6b5b4e] mt-1'>Putri dari {data.brideParentName}</p>
            {data.brideInstagram && (
              <a href={`https://instagram.com/${data.brideInstagram.replace('@', '')}`} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 text-xs text-[#c9a96e] hover:text-[#b8954d] mt-2'>
                <Instagram size={14} /> {data.brideInstagram}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
