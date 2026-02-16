import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { AllInvitationData } from '@/types/interface';

interface Props {
  data: AllInvitationData['invitationEvent'];
}

export default function Event({ data }: Props) {
  const isOneDay = data.length === 1;

  return (
    <section className="relative py-24 px-6 bg-gray-900 border-t border-yellow-900/30">
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" stroke="#EAB308" strokeWidth="1" />
          <rect x="25" y="25" width="50" height="50" stroke="#EAB308" strokeWidth="0.5" transform="rotate(45 50 50)" />
        </svg>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 space-y-4"
      >
        <h2 className="font-serif text-3xl text-yellow-500 tracking-wide">
          Rangkaian Acara
        </h2>
        <p className="font-serif text-gray-400 text-sm">
          Dengan memohon rahmat Allah SWT, insya Allah kami akan menyelenggarakan acara:
        </p>
      </motion.div>

      <div className="space-y-12 max-w-lg mx-auto">
        {data.map((event, index) => (
          <motion.div
            key={event.eventId}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="relative bg-gray-950 border border-yellow-800/30 p-8 rounded-lg shadow-2xl"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-600/50 -translate-x-1 -translate-y-1 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-600/50 translate-x-1 -translate-y-1 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-600/50 -translate-x-1 translate-y-1 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-600/50 translate-x-1 translate-y-1 rounded-br-lg" />

            <div className="text-center space-y-6 relative z-10">
              <h3 className="font-serif text-3xl font-bold text-yellow-100 uppercase tracking-widest border-b border-yellow-900/40 pb-4 inline-block px-8">
                {event.eventType}
              </h3>

              <div className="flex flex-col items-center gap-2 font-serif">
                <div className="flex items-center gap-2 text-yellow-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide uppercase">
                    {new Date(event.startTime).toLocaleDateString('id-ID', { weekday: 'long' })}
                  </span>
                </div>
                
                <span className="text-5xl font-bold text-white drop-shadow-md">
                  {new Date(event.startTime).getDate()}
                </span>
                
                <span className="text-lg text-gray-300 uppercase tracking-widest">
                  {new Date(event.startTime).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-yellow-900/30">
                <div className="flex items-center justify-center gap-2 text-gray-300 font-serif">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm">
                    {new Date(event.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB 
                     - 
                    {event.endTime ? new Date(event.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : ' Selesai'}
                  </p>
                </div>

                <div className="text-gray-400 font-serif text-sm px-4">
                  <p className="font-bold text-yellow-600 mb-1 flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Lokasi:
                  </p>
                  <p className="px-6 leading-relaxed mb-2">{event.location}</p>
                  <p className="text-xs italic text-gray-500 opacity-80">{event.locationDetail}</p>
                </div>

                {event.mapsUrl && (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-2 bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-600/30 text-yellow-500 text-xs tracking-widest uppercase transition-all hover:scale-105 rounded"
                  >
                    Lihat Peta
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
