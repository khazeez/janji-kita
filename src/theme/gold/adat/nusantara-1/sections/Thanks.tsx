import { motion } from 'framer-motion';
import { AllInvitationData } from '@/types/interface';

interface Props {
  data: AllInvitationData['invitationDataUser'];
}

export default function Thanks({ data }: Props) {
  return (
    <section className="relative py-32 px-6 text-center overflow-hidden bg-gray-950">
      {/* Background Photo Parallax Effect */}
      {data.galleryPhotos?.[0] && (
        <div className="absolute inset-0 z-0">
          <img
            src={data.galleryPhotos[0]}
            alt="Closing"
            className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
        </div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 space-y-8 max-w-md mx-auto"
      >
        <p className="font-serif text-gray-300 text-sm leading-loose">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
        </p>

        <p className="font-serif text-gray-400 text-xs italic tracking-wider">
          Atas kehadiran dan doa restunya kami ucapkan terima kasih.
        </p>

        <h2 className="font-serif text-2xl text-yellow-500 font-medium tracking-wide my-8">
          Wassalamu'alaikum Wr. Wb.
        </h2>

        <div className="pt-8 space-y-4">
          <p className="font-serif text-gray-500 text-[10px] tracking-[0.3em] uppercase">
            KAMI YANG BERBAHAGIA
          </p>
          
          <h1 className="font-serif text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-lg leading-tight p-4">
            {data.groomNickName}
            <span className="block text-2xl text-yellow-600/50 my-2">&</span>
            {data.brideNickName}
          </h1>

          <p className="font-serif text-gray-500 text-xs mt-8">
            Beserta Keluarga Besar
          </p>
        </div>
        
        {/* Footer Credit */}
        <div className="mt-20 pt-8 border-t border-yellow-900/10">
           <p className="text-[10px] text-gray-600 font-mono tracking-widest">
             BUILT WITH LOVE BY <span className="text-yellow-600">JANJI KITA</span>
           </p>
        </div>
      </motion.div>
    </section>
  );
}
