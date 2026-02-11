import React from 'react';
import { InvitationEvent } from '@/types/interface';
import { MapPin, Calendar, Clock, Plus, Trash2, Heart } from 'lucide-react';

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

  const inputClasses = "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300";

  return (
    <div className='space-y-10'>
      {/* === Akad Nikah === */}
      {akadEvent && (
        <div className='space-y-6'>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
              <Heart size={20} />
            </div>
            <div>
              <h3 className='text-lg font-bold text-white tracking-tight'>Akad Nikah</h3>
              <p className='text-xs text-white/40'>Informasi detail waktu dan lokasi akad</p>
            </div>
          </div>

          <div className='grid gap-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6'>
            <div className="space-y-1.5">
              <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Tempat</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type='text'
                  value={akadEvent.location}
                  onChange={(e) => handleEventChange(akadEvent.eventId, 'location', e.target.value)}
                  className={`${inputClasses} pl-10`}
                  placeholder='Contoh: Masjid Al-Ikhlas'
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Alamat Lengkap</label>
              <textarea
                value={akadEvent.locationDetail}
                onChange={(e) => handleEventChange(akadEvent.eventId, 'locationDetail', e.target.value)}
                rows={3}
                className={`${inputClasses} resize-none`}
                placeholder='Jl. Contoh No. 123, Jakarta Selatan'
              />
            </div>

            <div className="space-y-1.5">
              <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Link Google Maps</label>
              <input
                type='url'
                value={akadEvent.mapsUrl}
                onChange={(e) => handleEventChange(akadEvent.eventId, 'mapsUrl', e.target.value)}
                className={inputClasses}
                placeholder='https://maps.google.com/...'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className="space-y-1.5">
                <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Waktu Mulai</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type='datetime-local'
                    value={akadEvent.startTime}
                    onChange={(e) => handleDateTimeChange(akadEvent.eventId, 'startTime', e.target.value)}
                    className={`${inputClasses} pl-10 [color-scheme:dark]`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Waktu Selesai</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type='datetime-local'
                    value={akadEvent.endTime}
                    onChange={(e) => handleDateTimeChange(akadEvent.eventId, 'endTime', e.target.value)}
                    className={`${inputClasses} pl-10 [color-scheme:dark]`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === Resepsi === */}
      <div className='space-y-6'>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className='text-lg font-bold text-white tracking-tight'>Resepsi</h3>
              <p className='text-xs text-white/40'>Informasi detail waktu dan lokasi resepsi</p>
            </div>
          </div>
          <button
            type='button'
            onClick={addResepsi}
            className='flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/5'
          >
            <Plus size={14} /> Tambah
          </button>
        </div>

        {resepsiEvents.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-10 px-6 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-center group transition-colors hover:border-white/10'>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-3 group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <p className='text-sm text-white/30 font-medium'>Belum ada data resepsi</p>
            <button 
              onClick={addResepsi}
              className="mt-3 text-xs text-pink-500 hover:text-pink-400 font-bold uppercase tracking-widest"
            >
              Klik untuk tambah
            </button>
          </div>
        ) : (
          <div className='space-y-6'>
            {resepsiEvents.map((resepsi, index) => (
              <div
                key={resepsi.eventId}
                className='relative grid gap-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6 group'
              >
                <div className='flex items-center justify-between mb-2'>
                  <span className='px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg'>
                    Resepsi {index + 1}
                  </span>
                  <button
                    type='button'
                    onClick={() => removeResepsi(resepsi.eventId)}
                    className='w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg transition-all'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Tempat</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type='text'
                      value={resepsi.location}
                      onChange={(e) => handleEventChange(resepsi.eventId, 'location', e.target.value)}
                      className={`${inputClasses} pl-10`}
                      placeholder='Contoh: Gedung Serbaguna'
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Alamat Lengkap</label>
                  <textarea
                    value={resepsi.locationDetail}
                    onChange={(e) => handleEventChange(resepsi.eventId, 'locationDetail', e.target.value)}
                    rows={3}
                    className={`${inputClasses} resize-none`}
                    placeholder='Jl. Contoh No. 456, Jakarta Selatan'
                  />
                </div>

                <div className="space-y-1.5">
                  <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Link Google Maps</label>
                  <input
                    type='url'
                    value={resepsi.mapsUrl}
                    onChange={(e) => handleEventChange(resepsi.eventId, 'mapsUrl', e.target.value)}
                    className={inputClasses}
                    placeholder='https://maps.google.com/...'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div className="space-y-1.5">
                    <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Waktu Mulai</label>
                    <div className="relative">
                      <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type='datetime-local'
                        value={resepsi.startTime}
                        onChange={(e) => handleDateTimeChange(resepsi.eventId, 'startTime', e.target.value)}
                        className={`${inputClasses} pl-10 [color-scheme:dark]`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Waktu Selesai</label>
                    <div className="relative">
                      <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type='datetime-local'
                        value={resepsi.endTime}
                        onChange={(e) => handleDateTimeChange(resepsi.eventId, 'endTime', e.target.value)}
                        className={`${inputClasses} pl-10 [color-scheme:dark]`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
