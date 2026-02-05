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
                className='w-full bg-black/20 border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition h-32 resize-none'
                placeholder='Masukkan alamat lengkap untuk pengiriman kado fisik...'
              />
            </div>
        </div>
      </div>
      
       <div className='bg-yellow-500/10 border border-yellow-500/20 rounded p-4 text-xs text-yellow-200 mt-4'>
        Catatan: Pengaturan Rekening Bank dan E-Wallet belum tersedia di editor ini. Hubungi admin jika perlu perubahan mendesak.
      </div>
    </div>
  );
}
