'use client';
import { InvitationDataUser } from '@/types/interface';
import { User, Instagram, Image as ImageIcon } from 'lucide-react';

interface Props {
  data: InvitationDataUser;
  onChange: (data: InvitationDataUser) => void;
}

export default function EditorBasic({ data, onChange }: Props) {
  const handleChange = (field: keyof InvitationDataUser, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-8'>
      {/* GROOM */}
      <div className='space-y-4'>
        <h3 className='text-pink-400 font-medium flex items-center gap-2'>
          <User size={16} /> Data Mempelai Pria
        </h3>
        
        <div className='grid gap-4'>
          <div>
            <label className='block text-xs text-gray-400 mb-1'>Nama Lengkap</label>
            <input
              type='text'
              value={data.groomFullName}
              onChange={(e) => handleChange('groomFullName', e.target.value)}
              className='w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-gray-400 mb-1'>Nama Panggilan</label>
              <input
                type='text'
                value={data.groomNickName}
                onChange={(e) => handleChange('groomNickName', e.target.value)}
                className='w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-400 mb-1'>Instagram</label>
              <div className="relative">
                <Instagram size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type='text'
                  value={data.groomInstagram || ''}
                  onChange={(e) => handleChange('groomInstagram', e.target.value)}
                  className='w-full bg-black/20 border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
                  placeholder='username'
                />
              </div>
            </div>
          </div>

          <div>
            <label className='block text-xs text-gray-400 mb-1'>Nama Orang Tua</label>
            <textarea
              value={data.groomParentName || ''}
              onChange={(e) => handleChange('groomParentName', e.target.value)}
              className='w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition h-20 resize-none'
              placeholder='Putra dari Bpk... dan Ibu...'
            />
          </div>
          
           <div>
            <label className='block text-xs text-gray-400 mb-1'>Foto URL</label>
             <div className="relative">
                <ImageIcon size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type='text'
                  value={data.groomPhotoUrl || ''}
                  onChange={(e) => handleChange('groomPhotoUrl', e.target.value)}
                  className='w-full bg-black/20 border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
                  placeholder='https://...'
                />
              </div>
          </div>
        </div>
      </div>

      <div className='w-full h-px bg-white/10' />

      {/* BRIDE */}
      <div className='space-y-4'>
        <h3 className='text-pink-400 font-medium flex items-center gap-2'>
          <User size={16} /> Data Mempelai Wanita
        </h3>
        
        <div className='grid gap-4'>
          <div>
            <label className='block text-xs text-gray-400 mb-1'>Nama Lengkap</label>
            <input
              type='text'
              value={data.brideFullName}
              onChange={(e) => handleChange('brideFullName', e.target.value)}
              className='w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-gray-400 mb-1'>Nama Panggilan</label>
              <input
                type='text'
                value={data.brideNickName}
                onChange={(e) => handleChange('brideNickName', e.target.value)}
                className='w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-400 mb-1'>Instagram</label>
              <div className="relative">
                <Instagram size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type='text'
                  value={data.brideInstagram || ''}
                  onChange={(e) => handleChange('brideInstagram', e.target.value)}
                  className='w-full bg-black/20 border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
                  placeholder='username'
                />
              </div>
            </div>
          </div>

          <div>
            <label className='block text-xs text-gray-400 mb-1'>Nama Orang Tua</label>
            <textarea
              value={data.brideParentName || ''}
              onChange={(e) => handleChange('brideParentName', e.target.value)}
              className='w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition h-20 resize-none'
              placeholder='Putri dari Bpk... dan Ibu...'
            />
          </div>

           <div>
            <label className='block text-xs text-gray-400 mb-1'>Foto URL</label>
             <div className="relative">
                <ImageIcon size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type='text'
                  value={data.bridePhotoUrl || ''}
                  onChange={(e) => handleChange('bridePhotoUrl', e.target.value)}
                  className='w-full bg-black/20 border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
                  placeholder='https://...'
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
