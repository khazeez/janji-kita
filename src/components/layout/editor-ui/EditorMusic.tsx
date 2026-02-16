'use client';
import { InvitationDataUser } from '@/types/interface';
import { Music, AlertCircle } from 'lucide-react';
import MusicUploadField from './MusicUploadField';

interface Props {
  data: InvitationDataUser;
  onChange: (data: InvitationDataUser) => void;
  invitationId: string;
}

export default function EditorMusic({ data, onChange, invitationId }: Props) {
  const handleChange = (field: keyof InvitationDataUser, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-10'>
      <div className='space-y-6'>
        <h3 className='text-white font-bold flex items-center gap-2 text-lg'>
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
            <Music size={18} />
          </div>
          Pengaturan Musik
        </h3>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
           <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
           <p className="text-sm text-blue-300 leading-relaxed">
             Musik akan otomatis diputar ketika tamu membuka undangan (Autoplay). Pastikan format file adalah MP3 dengan ukuran maksimal 10MB.
           </p>
        </div>

        <div className='grid gap-6'>
          <MusicUploadField
            label="Upload Musik Latar (Background Music)"
            value={data.audioUrl || ''}
            onChange={(url) => handleChange('audioUrl', url)}
            invitationId={invitationId}
          />
        </div>
      </div>
    </div>
  );
}
