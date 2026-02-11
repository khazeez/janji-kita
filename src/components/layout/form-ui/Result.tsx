import { CheckCircle, CreditCard, ExternalLink, LayoutDashboard, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Props {
  data: string | undefined;
}

export default function ResultScreenSuccsess({ data }: Props) {
  return (
    <div className='fixed inset-0 bg-[#030712]/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animation-in fade-in duration-500'>
      <div className='bg-[#030712] border border-white/5 rounded-[2.5rem] max-w-md w-full p-10 shadow-3xl relative overflow-hidden group animate-in zoom-in-95 duration-500'>
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Success Icon */}
        <div className='flex justify-center mb-8 relative'>
          <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full scale-75 animate-pulse" />
          <div className='w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/40 relative rotate-6 group-hover:rotate-0 transition-transform duration-500'>
            <CheckCircle size={48} className='text-white' />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center text-pink-600 shadow-xl">
              <Sparkles size={16} />
            </div>
          </div>
        </div>

        {/* Title & Content */}
        <div className="text-center space-y-3 mb-10">
          <h2 className='text-3xl font-bold text-white tracking-tight'>
            Hore! Undangan Berhasil Dibuat
          </h2>
          <p className='text-sm text-white/40 leading-relaxed font-medium px-4'>
            Lakukan aktivasi dengan melakukan pembayaran untuk mempublikasikan undangan Anda ke tamu tercinta.
          </p>
        </div>

        {/* Actions */}
        <div className='space-y-4 relative'>
          <Link
            href={`/payment`}
            className='w-full flex items-center justify-center gap-3 px-8 py-5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-pink-600/20 hover:shadow-pink-500/40 hover:-translate-y-1 active:translate-y-0'
          >
            <CreditCard size={20} />
            <span>Lanjutkan Pembayaran</span>
          </Link>

          <Link
            href={`/invitation/${data}/preview`}
            className='w-full flex items-center justify-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all duration-300 border border-white/5 group/btn'
          >
            <ExternalLink size={20} className="text-pink-500/50 group-hover/btn:text-pink-500 transition-colors" />
            <span>Pratinjau Undangan</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest pt-2"
          >
            <LayoutDashboard size={14} />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className='text-[10px] text-white/20 font-bold uppercase tracking-wider'>
            Data Anda tetap aman dan dapat diubah setelah aktivasi
          </p>
        </div>
      </div>
    </div>
  );
}
