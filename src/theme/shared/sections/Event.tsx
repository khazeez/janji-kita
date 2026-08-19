import { InvitationEvent } from '@/types/interface';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import type { EventClasses } from '../types';

export interface EventProps {
  data: InvitationEvent[];
  classes?: EventClasses;
}

export default function Event({ data, classes = {} }: EventProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`relative py-16 px-4 ${classes.container || ''}`}>
      <div className='text-center mb-12'>
        <h1 className={`text-4xl font-amalfi text-white mb-2 ${classes.title || ''}`}>Our Events</h1>
        <div className={`flex items-center justify-center gap-4 ${classes.titleDivider || ''}`}>
          <div className='h-px bg-white/30 w-16' />
          <p className={`text-white/80 text-sm ${classes.subtitle || ''}`}>Save the Date</p>
          <div className='h-px bg-white/30 w-16' />
        </div>
      </div>

      <div className='max-w-4xl rounded-t-full mx-auto space-y-10'>
        {data.map((event, index) => (
          <div key={event.eventId || index} className={`group relative transition-all duration-300 overflow-hidden backdrop-blur-sm border-2 border-white py-10 rounded-t-full ${classes.card || ''}`}>
            <div className='p-5 space-y-4'>
              <h2 className={`text-2xl text-center mb-10 font-bold text-white font-brown-sugar tracking-widest uppercase ${classes.cardTitle || ''}`}>
                {event.eventType}
              </h2>

              <div className='flex items-start gap-3'>
                <div className={`flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center ${classes.iconBox || ''}`}>
                  <MapPin className={`w-5 h-5 text-white ${classes.icon || ''}`} />
                </div>
                <div className='flex-1'>
                  <p className={`text-xs text-white/60 uppercase tracking-wider ${classes.label || ''}`}>Lokasi</p>
                  <p className={`text-white font-semibold mt-1 ${classes.value || ''}`}>{event.location}</p>
                  <p className={`text-white/80 text-sm mt-1 ${classes.value || ''}`}>{event.locationDetail}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className={`flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center ${classes.iconBox || ''}`}>
                  <Calendar className={`w-5 h-5 text-white ${classes.icon || ''}`} />
                </div>
                <div>
                  <p className={`text-xs text-white/60 uppercase tracking-wider ${classes.label || ''}`}>Tanggal</p>
                  <p className={`text-white font-medium mt-1 ${classes.value || ''}`}>{formatDate(event.startTime)}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className={`flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center ${classes.iconBox || ''}`}>
                  <Clock className={`w-5 h-5 text-white ${classes.icon || ''}`} />
                </div>
                <div>
                  <p className={`text-xs text-white/60 uppercase tracking-wider ${classes.label || ''}`}>Waktu</p>
                  <p className={`text-white font-medium mt-1 ${classes.value || ''}`}>{formatTime(event.startTime)} - {formatTime(event.endTime)} WIB</p>
                </div>
              </div>

              <div className='pt-4'>
                <a href={event.mapsUrl} target='_blank' rel='noopener noreferrer' className={`inline-flex items-center gap-1 bg-white text-gray-800 p-2 rounded-full text-sm transition-all duration-300 ${classes.mapsButton || ''}`}>
                  <Navigation className={`w-4 h-4 transition-transform ${classes.mapsIcon || ''}`} />
                  <span>Lihat Lokasi di Maps</span>
                </a>
              </div>
            </div>

            <div className='absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-full blur-xl' />
          </div>
        ))}
      </div>
    </div>
  );
}
