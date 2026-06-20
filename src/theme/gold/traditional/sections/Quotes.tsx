'use client';

export default function Quotes() {
  return (
    <section className='relative bg-gradient-to-b from-[#3d2b1f] to-[#2d1f14] px-8 py-20 text-center'>
      <div className='max-w-sm mx-auto space-y-6'>
        <svg className='w-10 h-10 mx-auto text-[#c9a96e]' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z' />
        </svg>
        <p className='text-lg font-serif italic text-[#e8dcc8] leading-relaxed'>
          &ldquo;Semoga Allah memberkati kalian berdua dalam suka dan duka, dan mengikat kalian berdua dalam kebaikan.&rdquo;
        </p>
        <p className='text-sm text-[#c9a96e]'>Doa untuk Kedua Mempelai</p>
      </div>
    </section>
  );
}
