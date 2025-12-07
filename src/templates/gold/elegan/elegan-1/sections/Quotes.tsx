import { motion } from 'framer-motion';

export default function Quotes() {
  return (
    <section className='relative text-center overflow-hidden p-2'>
      {/* Konten utama */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className='max-w-3xl mx-auto border border-white rounded-2xl py-8 px-2'
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          viewport={{ once: true }}
          className='text-sm text-shadow-black leading-relaxed text-white'
        >
          Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu
          mengingat (kebesaran Allah).
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className='font-bold text-sm italic text-white'
        >
          Adz-Dzariyat · Ayat 49
        </motion.p>
      </motion.div>
    </section>
  );
}
