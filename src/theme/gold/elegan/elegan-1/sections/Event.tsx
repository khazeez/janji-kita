import { InvitationEvent } from '@/types/interface';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';

export interface Props {
  data: InvitationEvent[];
}

export default function Event({ data }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='relative py-16 px-4'>
      {/* Title Section */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-amalfi text-white mb-2'>Our Events</h1>
        <div className='flex items-center justify-center gap-4'>
          <div className='h-px bg-white/30 w-16'></div>
          <p className='text-white/80 text-sm'>Save the Date</p>
          <div className='h-px bg-white/30 w-16'></div>
        </div>
      </div>

      {/* Events Grid */}
      <div className='max-w-4xl rounded-t-full mx-auto space-y-10'>
          {data.map((event, index) => (
            <div
              key={event.eventId || index}
              className='group relative  transition-all duration-300 overflow-hidden backdrop-blur-sm  border-2 border-white py-10 rounded-t-full'
            >
              {/* Content */}
              <div className=' p-5 space-y-4'>
                <h2 className='text-2xl text-center mb-10 font-bold text-white font-brown-sugar tracking-widest uppercase'>
                  {event.eventType}
                </h2>

                {/* Location */}
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                    <MapPin className='w-5 h-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs text-white/60 uppercase tracking-wider'>
                      Lokasi
                    </p>
                    <p className='text-white font-semibold mt-1'>
                      {event.location}
                    </p>
                    <p className='text-white/80 text-sm mt-1'>
                      {event.locationDetail}
                    </p>
                  </div>
                </div>
                {/* Date */}
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                    <Calendar className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs text-white/60 uppercase tracking-wider'>
                      Tanggal
                    </p>
                    <p className='text-white font-medium mt-1'>
                      {formatDate(event.startTime)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                    <Clock className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs text-white/60 uppercase tracking-wider'>
                      Waktu
                    </p>
                    <p className='text-white font-medium mt-1'>
                      {formatTime(event.startTime)} -{' '}
                      {formatTime(event.endTime)} WIB
                    </p>
                  </div>
                </div>

                {/* Maps Button */}
                <div className='pt-4'>
                  <a
                    href={event.mapsUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 bg-white text-gray-800 p-2 rounded-full text-sm transition-all duration-300'
                  >
                    <Navigation className='w-4 h-4 transition-transform' />
                    <span>Lihat Lokasi di Maps</span>
                  </a>
                </div>
              </div>

              {/* Decorative Element */}
              <div className='absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-full blur-xl'></div>
            </div>
          ))}
        </div>
    </div>
  );
}
