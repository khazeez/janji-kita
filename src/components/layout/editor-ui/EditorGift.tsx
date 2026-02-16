'use client';
import { InvitationGift } from '@/types/interface';
import { Gift, MapPin } from 'lucide-react';

interface Props {
  data: InvitationGift;
  onChange: (data: InvitationGift) => void;
}

export default function EditorGift({ data, onChange }: Props) {
  const handleChange = (field: keyof InvitationGift, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-pink-400 font-medium flex items-center gap-2'>
        <Gift size={16} /> Informasi Hadiah Fisik
      </h3>

      <div className='grid gap-4'>
        <div>
          <label className='block text-xs text-gray-400 mb-1'>Alamat Kirim Hadiah</label>
           <div className="relative">
              <MapPin size={14} className="absolute left-3 top-2.5 text-gray-500" />
              <textarea
                value={data.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className='w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 h-32 resize-none'
                placeholder='Masukkan alamat lengkap untuk pengiriman kado fisik...'
              />
            </div>
        </div>
      </div>
      
       <div className='bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 text-xs text-orange-200/80 mt-6 leading-relaxed flex gap-3 items-start'>
         <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">!</div>
         <p>Catatan: Pengaturan Rekening Bank dan E-Wallet belum tersedia di editor ini. Hubungi admin jika perlu perubahan mendesak.</p>
      </div>
    </div>
  );
}
