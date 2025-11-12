import React from 'react';
import { LinkData } from '@/types/form';


type Props = {
  data: LinkData;
  onChange: (data: LinkData) => void;
};

export default function LinkDataInput({ data, onChange }: Props) {
  const handleChange = (field: keyof LinkData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <>
      <div className='space-y-6'>
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-white mb-4'>
            Buat Link Undangan Anda
          </h3>
          <p className='text-gray-400 text-sm mb-6'>
            Link ini akan digunakan untuk mengakses undangan digital Anda
          </p>

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Custom Link
            </label>
            <div className='flex items-stretch'>
              <span className='px-4 flex items-center bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-gray-400 whitespace-nowrap text-sm'>
                janjikita.art/
              </span>
              <input
                type='text'
                value={data.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className='flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-r-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='nama-mempelai'
              />
            </div>
            <p className='text-xs text-gray-500 mt-2'>
              Hanya huruf kecil, angka, dan tanda hubung
            </p>
          </div>

          {data.link && (
            <div className='mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600'>
              <p className='text-xs text-gray-400 mb-1'>Preview Link:</p>
              <p className='text-pink-400 font-medium break-all text-sm'>
                https://janjikita.art/{data.link}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
