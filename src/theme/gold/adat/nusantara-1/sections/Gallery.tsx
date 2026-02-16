import { motion } from 'framer-motion';

interface Props {
  photos: string[];
}

export default function Gallery({ photos }: Props) {
  if (!photos || photos.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-gray-950 border-t border-yellow-900/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 space-y-4"
      >
        <span className="text-yellow-600 text-xs font-bold uppercase tracking-[0.2em] font-serif">
          Galeri
        </span>
        <h2 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm">
          Momen Bahagia
        </h2>
        <div className="w-16 h-[1px] bg-yellow-600 mx-auto mt-4" />
      </motion.div>

      <div className="grid grid-cols-2 gap-4 auto-rows-[200px]">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`
              relative overflow-hidden group 
              border border-yellow-900/30 rounded-lg shadow-lg
              ${index % 3 === 0 ? 'col-span-2 row-span-2 h-[400px]' : ''}
              ${index % 3 === 1 ? 'col-span-1 row-span-1' : ''}
              ${index % 3 === 2 ? 'col-span-1 row-span-1' : ''}
            `}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            
            <img
              src={photo}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { Copy, Gift as GiftIcon, Wallet } from 'lucide-react';
import { AllInvitationData } from '@/types/interface';

interface GiftProps {
  data: AllInvitationData['invitationGift'];
}

export function Gift({ data }: GiftProps) {
  const { address, invitationGiftBank, invitationGiftWallet } = data;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nomor rekening berhasil disalin!');
  };

  if (!invitationGiftBank.length && !invitationGiftWallet.length && !address) return null;

  return (
    <section className="py-24 px-6 bg-gray-900 border-t border-yellow-900/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 space-y-4"
      >
        <GiftIcon className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
        <h2 className="font-serif text-3xl font-bold text-yellow-100 drop-shadow-sm">
          Tanda Kasih
        </h2>
        <p className="font-serif text-gray-400 text-sm leading-loose max-w-sm mx-auto">
          Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
        </p>
      </motion.div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* BANK ACCOUNTS */}
        {invitationGiftBank.map((bank, idx) => (
          <motion.div
            key={bank.giftBankId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-800/50 border border-yellow-700/30 rounded-xl p-6 text-center shadow-lg relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-600/10 to-transparent rounded-bl-full transform rotate-180 transition-transform group-hover:scale-125 duration-500" />
            
            <p className="text-yellow-600 font-serif text-sm font-bold tracking-widest uppercase mb-2">BANK TRANSFER</p>
            <h3 className="text-2xl font-bold text-white mb-1 tracking-wider">{bank.bankName}</h3>
            <p className="text-gray-400 text-xs mb-4 uppercase tracking-widest">{bank.owner}</p>
            
            <div className="bg-gray-950/80 rounded-lg py-3 px-4 mb-4 flex items-center justify-between border border-yellow-900/20 group-hover:border-yellow-500/30 transition-colors">
              <span className="text-xl text-yellow-500 font-mono tracking-wider">{bank.account}</span>
              <button 
                onClick={() => handleCopy(bank.account)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Salin Nomor Rekening"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* E-WALLETS */}
        {invitationGiftWallet.map((wallet, idx) => (
          <motion.div
            key={wallet.giftWalletId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-800/50 border border-yellow-700/30 rounded-xl p-6 text-center shadow-lg relative overflow-hidden group"
          >
            <p className="text-yellow-600 font-serif text-sm font-bold tracking-widest uppercase mb-2">E-WALLET</p>
            <h3 className="text-2xl font-bold text-white mb-1 tracking-wider">{wallet.walletName}</h3>
            <p className="text-gray-400 text-xs mb-4 uppercase tracking-widest">{wallet.owner}</p>
            
            <div className="bg-gray-950/80 rounded-lg py-3 px-4 mb-4 flex items-center justify-between border border-yellow-900/20 group-hover:border-yellow-500/30 transition-colors">
              <span className="text-xl text-yellow-500 font-mono tracking-wider">{wallet.account}</span>
              <button 
                onClick={() => handleCopy(wallet.account)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Salin Nomor"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
