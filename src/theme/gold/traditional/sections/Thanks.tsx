'use client';

import { InvitationDataUser } from '@/types/interface';

interface Props {
  data: InvitationDataUser;
}

export default function Thanks({ data }: Props) {
  return (
    <section className='relative bg-[#f5f0e8] px-8 py-20 text-center'>
      <div className='traditional-ornament absolute inset-0 opacity-10' />
      <div className='relative z-10 max-w-sm mx-auto space-y-6'>
        <h2 className='text-2xl font-serif text-[#3d2b1f]'>Terima Kasih</h2>
        <div className='w-12 h-0.5 bg-[#c9a96e] mx-auto' />
        <p className='text-sm text-[#6b5b4e] leading-relaxed'>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
          Atas perhatiannya, kami ucapkan terima kasih.
        </p>
        <div className='pt-6'>
          <p className='text-base font-serif text-[#3d2b1f]'>Wassalamu&apos;alaikum Wr. Wb.</p>
        </div>
        <div className='pt-4'>
          <p className='text-lg font-serif text-[#3d2b1f]'>Hormat Kami,</p>
          <p className='text-xl font-bold font-serif text-[#3d2b1f] mt-2'>{data.groomNickName || data.groomFullName} & {data.brideNickName || data.brideFullName}</p>
        </div>
      </div>
    </section>
  );
}
