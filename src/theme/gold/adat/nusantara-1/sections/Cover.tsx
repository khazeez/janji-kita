import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface CoverProps {
  isOpen: boolean;
  guestName: string;
  bridePhoto?: string;
  onOpen: () => void;
}

export default function Cover({ isOpen, guestName, bridePhoto, onOpen }: CoverProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 text-center bg-gray-950 overflow-hidden"
    >
      {/* Background Image with Dark Overlay */}
      {bridePhoto && (
        <div className="absolute inset-0 z-0">
          <img
            src={bridePhoto}
            alt="Bride"
            className="w-full h-full object-cover opacity-40 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950/90" />
        </div>
      )}

      {/* Decorative Border Adat */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-yellow-600/30 rounded-t-full rounded-b-2xl z-10 pointer-events-none" />
      <div className="absolute top-6 left-6 right-6 bottom-6 border border-yellow-500/20 rounded-t-full rounded-b-xl z-10 pointer-events-none" />

      {/* Top Section */}
      <div className="relative z-20 mt-8 space-y-4">
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-yellow-500/80 text-sm tracking-[0.2em] font-medium uppercase font-serif"
        >
          Undangan Pernikahan
        </motion.p>
      </div>

      {/* Center Section: Names */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center space-y-2">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-serif text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 drop-shadow-md"
        >
          Romeo
        </motion.h1>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-serif text-4xl text-yellow-500/60 italic"
        >
          &
        </motion.span>
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-serif text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 drop-shadow-md"
        >
          Juliet
        </motion.h1>
      </div>

      {/* Bottom Section: Gift Info & Button */}
      <div className="relative z-20 space-y-6 w-full max-w-xs">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          <p className="text-gray-400 text-xs font-medium tracking-wide">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl px-6 py-3 mx-auto w-full">
            <h3 className="text-white text-lg font-bold truncate">
              {guestName || 'Tamu Undangan'}
            </h3>
          </div>
          <p className="text-gray-500 text-[10px] leading-relaxed px-4">
            Mohon maaf apabila ada kesalahan penulisan nama maupun gelar
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onOpen}
          className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 p-[1px] shadow-lg shadow-yellow-900/20"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#500724_50%,#E2E8F0_100%)]" />
          <div className="relative flex h-full w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-8 py-3 transition-all group-hover:bg-gray-900">
            <Mail className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-100 tracking-wide">
              Buka Undangan
            </span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
