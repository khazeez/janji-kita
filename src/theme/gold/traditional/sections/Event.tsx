'use client';

import { InvitationEvent } from '@/types/interface';
import { MapPin, Clock } from 'lucide-react';

interface Props {
  data: InvitationEvent[];
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function Event({ data }: Props) {
  const akad = data.find((e) => e.eventType === 'AKAD');
  const resepsi = data.find((e) => e.eventType === 'RESEPSI');

  return (
    <section className='relative bg-[#f5f0e8] px-8 py-16'>
      <div className='traditional-ornament absolute inset-0 opacity-10' />
      <div className='relative z-10 max-w-sm mx-auto space-y-10'>
        <div className='text-center space-y-3'>
          <h2 className='text-2xl font-serif text-[#3d2b1f]'>Acara Pernikahan</h2>
          <div className='w-12 h-0.5 bg-[#c9a96e] mx-auto' />
        </div>

        {akad && (
          <div className='bg-white rounded-xl p-6 shadow-md border border-[#c9a96e]/30 space-y-4'>
            <div className='text-center'>
              <span className='text-xs tracking-[0.2em] text-[#c9a96e] uppercase font-bold'>Akad Nikah</span>
            </div>
            <div className='space-y-3'>
              <div className='flex items-start gap-3 text-sm text-[#6b5b4e]'>
                <Clock size={16} className='text-[#c9a96e] mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-[#3d2b1f]'>{formatDate(akad.startTime)}</p>
                  <p>{formatTime(akad.startTime)} - {formatTime(akad.endTime)}</p>
                </div>
              </div>
              <div className='flex items-start gap-3 text-sm text-[#6b5b4e]'>
                <MapPin size={16} className='text-[#c9a96e] mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-[#3d2b1f]'>{akad.location}</p>
                  <p>{akad.locationDetail}</p>
                </div>
              </div>
            </div>
            {akad.mapsUrl && (
              <a
                href={akad.mapsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='block w-full text-center py-2.5 bg-[#c9a96e] hover:bg-[#b8954d] text-white rounded-lg text-sm font-medium transition-all'
              >
                Buka Google Maps
              </a>
            )}
          </div>
        )}

        {resepsi && (
          <div className='bg-white rounded-xl p-6 shadow-md border border-[#c9a96e]/30 space-y-4'>
            <div className='text-center'>
              <span className='text-xs tracking-[0.2em] text-[#c9a96e] uppercase font-bold'>Resepsi</span>
            </div>
            <div className='space-y-3'>
              <div className='flex items-start gap-3 text-sm text-[#6b5b4e]'>
                <Clock size={16} className='text-[#c9a96e] mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-[#3d2b1f]'>{formatDate(resepsi.startTime)}</p>
                  <p>{formatTime(resepsi.startTime)} - {formatTime(resepsi.endTime)}</p>
                </div>
              </div>
              <div className='flex items-start gap-3 text-sm text-[#6b5b4e]'>
                <MapPin size={16} className='text-[#c9a96e] mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-[#3d2b1f]'>{resepsi.location}</p>
                  <p>{resepsi.locationDetail}</p>
                </div>
              </div>
            </div>
            {resepsi.mapsUrl && (
              <a
                href={resepsi.mapsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='block w-full text-center py-2.5 bg-[#c9a96e] hover:bg-[#b8954d] text-white rounded-lg text-sm font-medium transition-all'
              >
                Buka Google Maps
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
