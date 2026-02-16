import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AllInvitationData } from '@/types/interface';

interface CoupleProps {
  data: AllInvitationData['invitationDataUser'];
}

export default function Couple({ data }: CoupleProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={ref} className="relative py-24 px-6 overflow-hidden bg-gray-950">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="motif" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="#EAB308" strokeWidth="0.5" fill="none"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#motif)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-16">
        {/* GROOM */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="relative w-48 h-64 border border-yellow-800/40 p-2 rounded-t-full rotate-2">
            <div className="absolute inset-0 border border-yellow-600/30 rounded-t-full -rotate-4 scale-105 pointer-events-none" />
            <img 
              src={data.groomPhotoUrl || "/images/placeholder-groom.jpg"} 
              alt={data.groomFullName} 
              className="w-full h-full object-cover rounded-t-full filter sepia-[0.2]"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm">
              {data.groomFullName}
            </h3>
            <p className="font-serif text-gray-400 text-sm italic">
              Putra {data.groomParentName}
            </p>
            {data.groomInstagram && (
              <a 
                href={`https://instagram.com/${data.groomInstagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-4 py-1 text-[10px] tracking-widest text-yellow-600 border border-yellow-900/30 rounded-full hover:bg-yellow-900/10 transition-colors mt-2"
              >
                @{data.groomInstagram}
              </a>
            )}
          </div>
        </motion.div>

        {/* AND SYMBOL */}
        <motion.div 
          style={{ y }}
          className="text-center"
        >
          <span className="font-serif text-6xl text-gray-800 font-bold">&</span>
        </motion.div>

        {/* BRIDE */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="relative w-48 h-64 border border-yellow-800/40 p-2 rounded-t-full -rotate-2">
            <div className="absolute inset-0 border border-yellow-600/30 rounded-t-full rotate-4 scale-105 pointer-events-none" />
            <img 
              src={data.bridePhotoUrl || "/images/placeholder-bride.jpg"} 
              alt={data.brideFullName} 
              className="w-full h-full object-cover rounded-t-full filter sepia-[0.2]"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm">
              {data.brideFullName}
            </h3>
            <p className="font-serif text-gray-400 text-sm italic">
              Putri {data.brideParentName}
            </p>
            {data.brideInstagram && (
              <a 
                href={`https://instagram.com/${data.brideInstagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-4 py-1 text-[10px] tracking-widest text-yellow-600 border border-yellow-900/30 rounded-full hover:bg-yellow-900/10 transition-colors mt-2"
              >
                @{data.brideInstagram}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
