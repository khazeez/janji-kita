import React from 'react';

export default function Device() {
  return (
    <div className="relative flex justify-center items-start">
      <div
        className='relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden'
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      >
        <div className='w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute'></div>
        <div className='h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg'></div>
        <div className='h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg'></div>
        <div className='h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg'></div>

        <div className='rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800'>
          <img
            src='../../public/wedding.jpg'
            className='dark:hidden w-[272px] h-[572px]'
            alt='Mockup Light'
          />
          <img
            src='/wedding3.jpg'
            className='hidden dark:block w-[272px] h-[572px]'
            alt='Mockup Dark'
          />
        </div>
      </div>
    </div>
  );
}
