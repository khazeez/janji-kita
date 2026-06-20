'use client';

import { InvitationGift } from '@/types/interface';
import { Gift as GiftIcon, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  data: InvitationGift;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className='p-1.5 rounded-lg bg-[#c9a96e]/10 hover:bg-[#c9a96e]/20 text-[#c9a96e] transition-all'
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default function Gift({ data }: Props) {
  const hasData = data?.address || data?.invitationGiftBank?.length > 0 || data?.invitationGiftWallet?.length > 0;
  if (!hasData) return null;

  return (
    <section className='relative bg-white px-8 py-16'>
      <div className='max-w-sm mx-auto space-y-8'>
        <div className='text-center space-y-3'>
          <GiftIcon size={24} className='text-[#c9a96e] mx-auto' />
          <h2 className='text-2xl font-serif text-[#3d2b1f]'>Kirim Hadiah</h2>
          <div className='w-12 h-0.5 bg-[#c9a96e] mx-auto' />
        </div>

        {data.address && (
          <div className='bg-[#f5f0e8] rounded-xl p-6 space-y-3'>
            <h3 className='text-sm font-bold text-[#3d2b1f]'>Alamat</h3>
            <p className='text-sm text-[#6b5b4e] leading-relaxed'>{data.address}</p>
          </div>
        )}

        {data.invitationGiftBank?.map((bank, i) => (
          <div key={i} className='bg-[#f5f0e8] rounded-xl p-6 space-y-4'>
            <h3 className='text-sm font-bold text-[#3d2b1f]'>Transfer Bank {bank.owner === 'GROOM' ? '(Mempelai Pria)' : '(Mempelai Wanita)'}</h3>
            {bank.account?.map((acc, j) => (
              <div key={j} className='flex items-center justify-between bg-white rounded-lg px-4 py-3'>
                <div>
                  <p className='text-xs text-[#6b5b4e]'>{acc.bankName}</p>
                  <p className='text-sm font-bold text-[#3d2b1f]'>{acc.accountNumber}</p>
                  <p className='text-xs text-[#6b5b4e]'>a.n. {acc.accountName}</p>
                </div>
                <CopyButton text={acc.accountNumber} />
              </div>
            ))}
          </div>
        ))}

        {data.invitationGiftWallet?.map((wallet, i) => (
          <div key={i} className='bg-[#f5f0e8] rounded-xl p-6 space-y-4'>
            <h3 className='text-sm font-bold text-[#3d2b1f]'>Dompet Digital {wallet.owner === 'GROOM' ? '(Mempelai Pria)' : '(Mempelai Wanita)'}</h3>
            {wallet.address?.map((addr, j) => (
              <div key={j} className='flex items-center justify-between bg-white rounded-lg px-4 py-3'>
                <div>
                  <p className='text-xs text-[#6b5b4e]'>{addr.walletName}</p>
                  <p className='text-sm font-bold text-[#3d2b1f]'>{addr.walletNumber}</p>
                  <p className='text-xs text-[#6b5b4e]'>a.n. {addr.walletHolder}</p>
                </div>
                <CopyButton text={addr.walletNumber} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
