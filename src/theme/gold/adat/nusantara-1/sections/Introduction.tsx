import { motion } from 'framer-motion';
import { AllInvitationData } from '@/types/interface';

interface Props {
  data: AllInvitationData;
}

export function Introduction({ data }: Props) {
  const { groomNickName, brideNickName } = data.invitationDataUser;

  return (
    <section className="relative px-6 pt-24 pb-12 text-center overflow-hidden">
      {/* Background Ornament - Subtle Pattern */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-700/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-yellow-900/20 to-transparent rounded-full blur-3xl" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-6 relative z-10"
      >
        {/* Basmalah */}
        <h2 className="font-serif text-3xl text-yellow-500 mb-8 font-medium tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </h2>

        <p className="font-serif text-gray-400 text-sm leading-loose max-w-xs mx-auto">
          Dengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan
          resepsi pernikahan putra-putri kami:
        </p>

        <div className="py-8">
          <div className="w-1 h-16 bg-gradient-to-b from-transparent via-yellow-600/50 to-transparent mx-auto rounded-full" />
        </div>

        <h3 className="font-serif text-4xl text-yellow-100 drop-shadow-sm">
          {groomNickName} <span className="text-yellow-600 text-2xl mx-2">&</span> {brideNickName}
        </h3>
        
        <p className="font-serif text-gray-500 text-xs tracking-widest uppercase mt-4">
          Insya Allah akan dilaksanakan pada:
        </p>
      </motion.div>
    </section>
  );
}

export function Quotes() {
  return (
    <section className="relative px-8 py-16 bg-gray-900/40 text-center border-y border-yellow-900/20">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        <div className="w-8 h-[1px] bg-yellow-600/50 mx-auto mb-6" />
        
        <p className="font-serif text-yellow-100/90 text-sm italic leading-relaxed">
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
        </p>
        
        <p className="font-serif text-yellow-600 text-xs font-bold tracking-widest mt-4">
          QS. AR-RUM: 21
        </p>
        
        <div className="w-8 h-[1px] bg-yellow-600/50 mx-auto mt-6" />
      </motion.div>
    </section>
  );
}
