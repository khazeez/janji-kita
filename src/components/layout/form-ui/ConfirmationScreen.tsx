import React from 'react';
import {
  InvitationDataUser,
  InvitationEvent,
  InvitationGift,
} from '@/types/interface';
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Link2, 
  AlertTriangle, 
  Heart,
  ExternalLink,
  Wallet,
  Landmark,
  Home
} from 'lucide-react';

type Props = {
  brideGroomData: InvitationDataUser;
  venueData: InvitationEvent[];
  giftData: InvitationGift;
  invitationUrl: string;
};

export default function ConfirmationScreen({
  brideGroomData,
  venueData,
  giftData,
  invitationUrl,
}: Props) {
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '-';
    const dateObj = new Date(dateTime);
    return dateObj.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBrideBank = () => giftData.invitationGiftBank.find((b) => b.owner === 'BRIDE');
  const getGroomBank = () => giftData.invitationGiftBank.find((b) => b.owner === 'GROOM');
  const getBrideWallet = () => giftData.invitationGiftWallet.find((w) => w.owner === 'BRIDE');
  const getGroomWallet = () => giftData.invitationGiftWallet.find((w) => w.owner === 'GROOM');

  const getChainLabel = (chain: string) => {
    const chains: Record<string, string> = {
      bitcoin: 'Bitcoin (BTC)',
      ethereum: 'Ethereum (ETH)',
      usdt: 'USDT (EVM)',
      polygon: 'Polygon (MATIC)',
      bsc: 'BNB Smart Chain (BSC)',
      arbitrum: 'Arbitrum (ARB)',
      optimism: 'Optimism (OP)',
      avalanche: 'Avalanche C-Chain (AVAX)',
      base: 'Base',
      fantom: 'Fantom (FTM)',
    };
    return chains[chain] || chain;
  };

  const akadEvent = venueData.find((e) => e.eventType === 'AKAD');
  const resepsiEvents = venueData.filter((e) => e.eventType === 'RESEPSI');

  const SectionIcon = ({ icon: Icon, colorClass, bgClass }: { icon: any, colorClass: string, bgClass: string }) => (
    <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} border border-current/10`}>
      <Icon size={20} />
    </div>
  );

  return (
    <div className='space-y-10'>
      {/* DATA MEMPELAI */}
      <div className='space-y-6'>
        <div className="flex items-center gap-3">
          <SectionIcon icon={Heart} colorClass="text-pink-400" bgClass="bg-pink-500/10" />
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Data Mempelai</h3>
            <p className='text-xs text-white/40'>Informasi utama pasangan mempelai</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mempelai Wanita */}
          <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5 relative overflow-hidden group'>
             <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                 <User size={16} />
               </div>
               <span className="text-xs font-bold text-pink-400/80 uppercase tracking-widest">Mempelai Wanita</span>
             </div>
             <div className="space-y-3">
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Nama Lengkap</span>
                 <span className="text-white font-semibold">{brideGroomData.brideFullName || '-'}</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Panggilan</span>
                   <span className="text-white font-medium">{brideGroomData.brideNickName || '-'}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Instagram</span>
                   <span className="text-pink-400/80 font-medium">{brideGroomData.brideInstagram ? `@${brideGroomData.brideInstagram}` : '-'}</span>
                 </div>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Nama Orang Tua</span>
                 <span className="text-white/70 text-sm italic">{brideGroomData.brideParentName || '-'}</span>
               </div>
             </div>
          </div>

          {/* Mempelai Pria */}
          <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5 relative overflow-hidden group'>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                 <User size={16} />
               </div>
               <span className="text-xs font-bold text-blue-400/80 uppercase tracking-widest">Mempelai Pria</span>
             </div>
             <div className="space-y-3">
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Nama Lengkap</span>
                 <span className="text-white font-semibold">{brideGroomData.groomFullName || '-'}</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Panggilan</span>
                   <span className="text-white font-medium">{brideGroomData.groomNickName || '-'}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Instagram</span>
                   <span className="text-blue-400/80 font-medium">{brideGroomData.groomInstagram ? `@${brideGroomData.groomInstagram}` : '-'}</span>
                 </div>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Nama Orang Tua</span>
                 <span className="text-white/70 text-sm italic">{brideGroomData.groomParentName || '-'}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* TEMPAT ACARA */}
      <div className='space-y-6'>
        <div className="flex items-center gap-3">
          <SectionIcon icon={MapPin} colorClass="text-blue-400" bgClass="bg-blue-500/10" />
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Rangkaian Acara</h3>
            <p className='text-xs text-white/40'>Jadwal dan lokasi pelaksanaan acara</p>
          </div>
        </div>

        <div className="grid gap-4">
          {/* Akad Nikah */}
          {akadEvent && (
            <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6'>
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-widest border border-pink-500/20">Akad Nikah</span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-white/30"><MapPin size={14} /></div>
                      <div>
                        <p className="text-sm font-bold text-white">{akadEvent.location}</p>
                        <p className="text-xs text-white/40 leading-relaxed">{akadEvent.locationDetail}</p>
                      </div>
                    </div>
                    {akadEvent.mapsUrl && (
                      <a href={akadEvent.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-pink-500 hover:text-pink-400 uppercase tracking-wider transition-colors ml-6">
                        Lihat di Maps <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-white/30"><Calendar size={14} /></div>
                      <div>
                        <p className="text-xs font-bold text-white/60 mb-1">Jadwal Acara</p>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Clock size={12} className="text-pink-500/50" />
                          <span>{formatDateTime(akadEvent.startTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resepsi Events */}
          {resepsiEvents.map((resepsi, index) => (
             <div key={resepsi.eventId} className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6'>
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                    Resepsi {resepsiEvents.length > 1 ? index + 1 : ''}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-white/30"><MapPin size={14} /></div>
                      <div>
                        <p className="text-sm font-bold text-white">{resepsi.location}</p>
                        <p className="text-xs text-white/40 leading-relaxed">{resepsi.locationDetail}</p>
                      </div>
                    </div>
                    {resepsi.mapsUrl && (
                      <a href={resepsi.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider transition-colors ml-6">
                        Lihat di Maps <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-white/30"><Calendar size={14} /></div>
                      <div>
                        <p className="text-xs font-bold text-white/60 mb-1">Jadwal Acara</p>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Clock size={12} className="text-blue-500/50" />
                          <span>{formatDateTime(resepsi.startTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KADO DIGITAL & ALAMAT */}
      <div className='space-y-6'>
        <div className="flex items-center gap-3">
          <SectionIcon icon={CreditCard} colorClass="text-emerald-400" bgClass="bg-emerald-500/10" />
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Informasi Kado</h3>
            <p className='text-xs text-white/40'>Tujuan pengiriman hadiah fisik & digital</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Alamat Fisik */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
             <div className="flex items-center gap-2">
               <Home size={14} className="text-emerald-400" />
               <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Alamat Pengiriman</h4>
             </div>
             <div className="bg-white/5 rounded-xl p-4">
               <p className="text-sm text-white/80 leading-relaxed">{giftData.address || 'Hanya kado digital'}</p>
             </div>
          </div>

          {/* Accounts Summary */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
             <div className="flex items-center gap-2">
               <CreditCard size={14} className="text-emerald-400" />
               <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Digital Accounts</h4>
             </div>
             <div className="space-y-3">
               {[...getBrideBank()?.account || [], ...getGroomBank()?.account || []].slice(0, 2).map((acc: any, i) => (
                 <div key={i} className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-white/20 uppercase">{acc.bankName}</span>
                     <span className="text-xs text-white font-medium">{acc.accountNumber}</span>
                   </div>
                   <Landmark size={14} className="text-white/20" />
                 </div>
               ))}
               {[...getBrideWallet()?.address || [], ...getGroomWallet()?.address || []].slice(0, 1).map((w: any, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                    <div className="flex flex-col flex-1 min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-white/20 uppercase">{getChainLabel(w.chain)}</span>
                      <span className="text-[10px] text-white/60 font-mono truncate">{w.address}</span>
                    </div>
                    <Wallet size={14} className="text-white/20 flex-shrink-0" />
                  </div>
               ))}
               {(!getBrideBank()?.account.length && !getGroomBank()?.account.length && !getBrideWallet()?.address.length && !getGroomWallet()?.address.length) && (
                 <p className="text-xs text-white/20 text-center py-2 italic">Tidak ada rekening terdaftar</p>
               )}
               {([...getBrideBank()?.account || [], ...getGroomBank()?.account || []].length + [...getBrideWallet()?.address || [], ...getGroomWallet()?.address || []].length > 3) && (
                 <p className="text-[10px] text-white/40 text-center uppercase tracking-widest font-bold">+ data lainnya</p>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* LINK PUBLIKASI */}
      <div className='bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden group'>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full translate-x-32 -translate-y-32" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link2 size={18} className="text-purple-400" />
              <h3 className='text-lg font-bold text-white tracking-tight'>Link Undangan Publik</h3>
            </div>
            <p className='text-sm text-white/40'>Inilah link yang akan Anda sebarkan kepada tamu undangan</p>
          </div>
          <div className='bg-[#030712] border border-white/10 px-6 py-4 rounded-2xl shadow-2xl group-hover:border-purple-500/30 transition-all'>
            <p className='text-purple-400 font-bold tracking-tight text-xl'>
              janjikita.art/<span className="text-white">{invitationUrl}</span>
            </p>
          </div>
        </div>
      </div>

      {/* FINAL WARNING */}
      <div className='bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start'>
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/30 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Satu langkah lagi</h4>
          <p className='text-xs text-amber-500/80 leading-relaxed font-medium'>
            Pastikan seluruh informasi di atas sudah benar. Setelah menekan tombol "Publish", 
            undangan Anda akan segera aktif dan dapat diakses oleh publik.
          </p>
        </div>
      </div>
    </div>
  );
}
