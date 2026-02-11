'use client';
import { InvitationEvent } from '@/types/interface';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface Props {
  events: InvitationEvent[];
  onChange: (events: InvitationEvent[]) => void;
}

export default function EditorEvent({ events, onChange }: Props) {
  const handleChange = (index: number, field: keyof InvitationEvent, value: string) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    onChange(newEvents);
  };

  return (
    <div className='space-y-8'>
      {events.map((event, index) => (
        <div key={event.eventId || index} className='space-y-4'>
          <h3 className='text-pink-400 font-medium flex items-center gap-2 uppercase'>
            <Calendar size={16} /> {event.eventType}
          </h3>

          <div className='grid gap-4'>
            <div>
              <label className='block text-xs text-gray-400 mb-1'>Nama Lokasi / Gedung</label>
              <input
                type='text'
                value={event.location}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
              />
            </div>

            <div>
              <label className='block text-xs text-gray-400 mb-1'>Alamat Lengkap</label>
              <textarea
                value={event.locationDetail}
                onChange={(e) => handleChange(index, 'locationDetail', e.target.value)}
                className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 h-24 resize-none'
              />
            </div>

            <div>
              <label className='block text-xs text-gray-400 mb-1'>Google Maps URL</label>
               <div className="relative">
                <MapPin size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type='text'
                  value={event.mapsUrl}
                  onChange={(e) => handleChange(index, 'mapsUrl', e.target.value)}
                  className='w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
                  placeholder='https://goo.gl/maps/...'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs text-gray-400 mb-1'>Waktu Mulai</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type='datetime-local'
                    value={event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleChange(index, 'startTime', new Date(e.target.value).toISOString())}
                    className='w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs text-gray-400 mb-1'>Waktu Selesai</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type='datetime-local'
                    value={event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleChange(index, 'endTime', new Date(e.target.value).toISOString())}
                    className='w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
                  />
                </div>
              </div>
            </div>
          </div>
           {index < events.length - 1 && <div className='w-full h-px bg-white/10 mt-6' />}
        </div>
      ))}
    </div>
  );
}
