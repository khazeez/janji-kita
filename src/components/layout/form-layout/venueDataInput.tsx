import React from 'react';
import { VenueData, ResepsiEvent } from '@/types/form';

type Props = {
  data: VenueData;
  onChange: (updatedData: VenueData) => void;
};

export default function VenueDataInput({ data, onChange }: Props) {
  const handleChange = (field: keyof VenueData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleResepsiChange = (index: number, field: keyof ResepsiEvent, value: string) => {
    const updatedResepsi = [...(data.resepsiEvents || [])];
    updatedResepsi[index] = { ...updatedResepsi[index], [field]: value };
    onChange({ ...data, resepsiEvents: updatedResepsi });
  };

  const handleDateTimeChange = (
    type: 'akad' | 'resepsi',
    field: 'start' | 'end',
    value: string,
    resepsiIndex?: number
  ) => {
    if (!value) return;

    const [date, time] = value.split('T');
    
    if (type === 'akad') {
      if (field === 'start') {
        onChange({ 
          ...data, 
          akadStartDate: date || '', 
          akadStartTime: time || '' 
        });
      } else {
        onChange({ 
          ...data, 
          akadEndDate: date || '', 
          akadEndTime: time || '' 
        });
      }
    } else if (type === 'resepsi' && resepsiIndex !== undefined) {
      const updatedResepsi = [...(data.resepsiEvents || [])];
      if (field === 'start') {
        updatedResepsi[resepsiIndex] = {
          ...updatedResepsi[resepsiIndex],
          startDate: date || '',
          startTime: time || ''
        };
      } else {
        updatedResepsi[resepsiIndex] = {
          ...updatedResepsi[resepsiIndex],
          endDate: date || '',
          endTime: time || ''
        };
      }
      onChange({ ...data, resepsiEvents: updatedResepsi });
    }
  };

  const addResepsi = () => {
    const newResepsi: ResepsiEvent = {
      venue: '',
      address: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      mapsUrl: '',
      description: '',
    };
    onChange({ ...data, resepsiEvents: [...(data.resepsiEvents || []), newResepsi] });
  };

  const removeResepsi = (index: number) => {
    const updatedResepsi = (data.resepsiEvents || []).filter((_, i) => i !== index);
    onChange({ ...data, resepsiEvents: updatedResepsi });
  };

  const getCombinedDateTime = (date: string, time: string) => {
    if (!date || !time) return '';
    return `${date}T${time}`;
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

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Link Google Maps
            </label>
            <input
              type='url'
              value={data.akadMapsUrl}
              onChange={(e) => handleChange('akadMapsUrl', e.target.value)}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
              placeholder='https://maps.google.com/...'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Waktu Mulai
              </label>
              <input
                type='datetime-local'
                value={getCombinedDateTime(data.akadStartDate, data.akadStartTime)}
                onChange={(e) => handleDateTimeChange('akad', 'start', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Waktu Selesai
              </label>
              <input
                type='datetime-local'
                value={getCombinedDateTime(data.akadEndDate, data.akadEndTime)}
                onChange={(e) => handleDateTimeChange('akad', 'end', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
              />
            </div>
          </div>
        </div>
      </div>

      {/* === Resepsi (Optional) === */}
      <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-lg font-semibold text-blue-400'>Resepsi (Opsional)</h3>
            <p className='text-sm text-gray-400 mt-1'>Anda bisa skip bagian ini jika tidak ada resepsi</p>
          </div>
          <button
            type='button'
            onClick={addResepsi}
            className='px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors'
          >
            + Tambah Resepsi
          </button>
        </div>

        {(!data.resepsiEvents || data.resepsiEvents.length === 0) && (
          <p className='text-gray-400 text-sm text-center py-8 bg-gray-700/30 rounded-lg'>
            Tidak ada resepsi. Klik "Tambah Resepsi" jika diperlukan.
          </p>
        )}

        <div className='space-y-6'>
          {(data.resepsiEvents || []).map((resepsi, index) => (
            <div
              key={index}
              className='bg-gray-700/50 rounded-lg p-5 border border-gray-600 relative'
            >
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-md font-semibold text-blue-300'>
                  Resepsi {index + 1}
                </h4>
                <button
                  type='button'
                  onClick={() => removeResepsi(index)}
                  className='text-red-400 hover:text-red-300 text-sm font-medium transition-colors'
                >
                  Hapus
                </button>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Keterangan
                  </label>
                  <input
                    type='text'
                    value={resepsi.description}
                    onChange={(e) => handleResepsiChange(index, 'description', e.target.value)}
                    className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='Contoh: Resepsi Mempelai Pria'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Nama Tempat
                  </label>
                  <input
                    type='text'
                    value={resepsi.venue}
                    onChange={(e) => handleResepsiChange(index, 'venue', e.target.value)}
                    className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='Contoh: Gedung Serbaguna'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={resepsi.address}
                    onChange={(e) => handleResepsiChange(index, 'address', e.target.value)}
                    rows={3}
                    className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='Jl. Contoh No. 456, Jakarta Selatan'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Link Google Maps
                  </label>
                  <input
                    type='url'
                    value={resepsi.mapsUrl}
                    onChange={(e) => handleResepsiChange(index, 'mapsUrl', e.target.value)}
                    className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='https://maps.google.com/...'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Waktu Mulai
                    </label>
                    <input
                      type='datetime-local'
                      value={getCombinedDateTime(resepsi.startDate, resepsi.startTime)}
                      onChange={(e) => handleDateTimeChange('resepsi', 'start', e.target.value, index)}
                      className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Waktu Selesai
                    </label>
                    <input
                      type='datetime-local'
                      value={getCombinedDateTime(resepsi.endDate, resepsi.endTime)}
                      onChange={(e) => handleDateTimeChange('resepsi', 'end', e.target.value, index)}
                      className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}