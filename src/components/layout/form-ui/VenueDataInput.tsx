import React from 'react';
import { InvitationEvent } from '@/types/interface';

type Props = {
  events: InvitationEvent[];
  onChange: (updatedEvents: InvitationEvent[]) => void;
};

export default function VenueDataInput({ events, onChange }: Props) {
  
  const akadEvent = events.find((e) => e.eventType === 'AKAD');
  const resepsiEvents = events.filter((e) => e.eventType === 'RESEPSI');

  const handleEventChange = (
    eventId: string,
    field: keyof InvitationEvent,
    value: string
  ) => {
    const updatedEvents = events.map((event) =>
      event.eventId === eventId ? { ...event, [field]: value } : event
    );
    onChange(updatedEvents);
  };

  const handleDateTimeChange = (
    eventId: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    if (!value) return;
    handleEventChange(eventId, field, value);
  };

  const addResepsi = () => {
    const newResepsi: InvitationEvent = {
      eventId: `resepsi-${Date.now()}`,
      invitationId: akadEvent?.invitationId || '',
      eventType: 'RESEPSI',
      location: '',
      locationDetail: '',
      mapsUrl: '',
      startTime: '',
      endTime: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onChange([...events, newResepsi]);
  };

  const removeResepsi = (eventId: string) => {
    const updatedEvents = events.filter((e) => e.eventId !== eventId);
    onChange(updatedEvents);
  };

  return (
    <div className='space-y-6'>
      {/* === Akad Nikah === */}
      {akadEvent && (
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-pink-400 mb-4'>
            Akad Nikah
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Tempat
              </label>
              <input
                type='text'
                value={akadEvent.location}
                onChange={(e) =>
                  handleEventChange(
                    akadEvent.eventId,
                    'location',
                    e.target.value
                  )
                }
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Masjid Al-Ikhlas'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Alamat Lengkap
              </label>
              <textarea
                value={akadEvent.locationDetail}
                onChange={(e) =>
                  handleEventChange(
                    akadEvent.eventId,
                    'locationDetail',
                    e.target.value
                  )
                }
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
                value={akadEvent.mapsUrl}
                onChange={(e) =>
                  handleEventChange(
                    akadEvent.eventId,
                    'mapsUrl',
                    e.target.value
                  )
                }
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
                  value={akadEvent.startTime}
                  onChange={(e) =>
                    handleDateTimeChange(
                      akadEvent.eventId,
                      'startTime',
                      e.target.value
                    )
                  }
                  className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Waktu Selesai
                </label>
                <input
                  type='datetime-local'
                  value={akadEvent.endTime}
                  onChange={(e) =>
                    handleDateTimeChange(
                      akadEvent.eventId,
                      'endTime',
                      e.target.value
                    )
                  }
                  className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === Resepsi (Optional) === */}
      <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-lg font-semibold text-blue-400'>
              Resepsi (Opsional)
            </h3>
            <p className='text-sm text-gray-400 mt-1'>
              Anda bisa skip bagian ini jika tidak ada resepsi
            </p>
          </div>
          <button
            type='button'
            onClick={addResepsi}
            className='px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors'
          >
            + Tambah Resepsi
          </button>
        </div>

        {resepsiEvents.length === 0 && (
          <p className='text-gray-400 text-sm text-center py-8 bg-gray-700/30 rounded-lg'>
            Tidak ada resepsi. Klik "Tambah Resepsi" jika diperlukan.
          </p>
        )}

        <div className='space-y-6'>
          {resepsiEvents.map((resepsi, index) => (
            <div
              key={resepsi.eventId}
              className='bg-gray-700/50 rounded-lg p-5 border border-gray-600 relative'
            >
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-md font-semibold text-blue-300'>
                  Resepsi {index + 1}
                </h4>
                <button
                  type='button'
                  onClick={() => removeResepsi(resepsi.eventId)}
                  className='text-red-400 hover:text-red-300 text-sm font-medium transition-colors'
                >
                  Hapus
                </button>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Nama Tempat
                  </label>
                  <input
                    type='text'
                    value={resepsi.location}
                    onChange={(e) =>
                      handleEventChange(
                        resepsi.eventId,
                        'location',
                        e.target.value
                      )
                    }
                    className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='Contoh: Gedung Serbaguna'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={resepsi.locationDetail}
                    onChange={(e) =>
                      handleEventChange(
                        resepsi.eventId,
                        'locationDetail',
                        e.target.value
                      )
                    }
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
                    onChange={(e) =>
                      handleEventChange(
                        resepsi.eventId,
                        'mapsUrl',
                        e.target.value
                      )
                    }
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
                      value={resepsi.startTime}
                      onChange={(e) =>
                        handleDateTimeChange(
                          resepsi.eventId,
                          'startTime',
                          e.target.value
                        )
                      }
                      className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Waktu Selesai
                    </label>
                    <input
                      type='datetime-local'
                      value={resepsi.endTime}
                      onChange={(e) =>
                        handleDateTimeChange(
                          resepsi.eventId,
                          'endTime',
                          e.target.value
                        )
                      }
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
