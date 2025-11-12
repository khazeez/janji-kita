import React from 'react';
import { VenueData } from '@/types/form';


type Props = {
  data: VenueData;
  onChange: (updatedData: VenueData) => void;
};

export default function VenueDataInput({ data, onChange }: Props) {
  const handleChange = (field: keyof VenueData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-6'>
      {/* === Akad Nikah === */}
      <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
        <h3 className='text-lg font-semibold text-pink-400 mb-4'>Akad Nikah</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Nama Tempat
            </label>
            <input
              type='text'
              value={data.akadVenue}
              onChange={(e) => handleChange('akadVenue', e.target.value)}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
              placeholder='Contoh: Masjid Al-Ikhlas'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Alamat Lengkap
            </label>
            <textarea
              value={data.akadAddress}
              onChange={(e) => handleChange('akadAddress', e.target.value)}
              rows={3}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
              placeholder='Jl. Contoh No. 123, Jakarta Selatan'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Tanggal
              </label>
              <input
                type='date'
                value={data.akadDate}
                onChange={(e) => handleChange('akadDate', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Waktu
              </label>
              <input
                type='time'
                value={data.akadTime}
                onChange={(e) => handleChange('akadTime', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
              />
            </div>
          </div>
        </div>
      </div>

      {/* === Resepsi (Opsional) === */}
      <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-blue-400'>
            Resepsi (Opsional)
          </h3>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={data.hasResepsi}
              onChange={(e) => handleChange('hasResepsi', e.target.checked)}
              className='w-5 h-5 rounded border-gray-600 text-pink-500 focus:ring-2 focus:ring-pink-500'
            />
            <span className='text-sm text-gray-300'>Ada Resepsi</span>
          </label>
        </div>

        {data.hasResepsi && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Tempat
              </label>
              <input
                type='text'
                value={data.resepsiVenue}
                onChange={(e) => handleChange('resepsiVenue', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Gedung Serbaguna'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Alamat Lengkap
              </label>
              <textarea
                value={data.resepsiAddress}
                onChange={(e) => handleChange('resepsiAddress', e.target.value)}
                rows={3}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Jl. Contoh No. 456, Jakarta Selatan'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Tanggal
                </label>
                <input
                  type='date'
                  value={data.resepsiDate}
                  onChange={(e) => handleChange('resepsiDate', e.target.value)}
                  className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Waktu
                </label>
                <input
                  type='time'
                  value={data.resepsiTime}
                  onChange={(e) => handleChange('resepsiTime', e.target.value)}
                  className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
