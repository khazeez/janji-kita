'use client';
import { InvitationDataUser } from '@/types/interface';
import { User, Instagram, Image as ImageIcon } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface Props {
  data: InvitationDataUser;
  onChange: (data: InvitationDataUser) => void;
  invitationId: string;
}

export default function EditorBasic({ data, onChange, invitationId }: Props) {
  const handleChange = (field: keyof InvitationDataUser, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-10'>
      {/* GROOM */}
      <div className='space-y-6'>
        <h3 className='text-white font-bold flex items-center gap-2 text-lg'>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <User size={18} />
          </div>
          Mempelai Pria
        </h3>
        
        <div className='grid gap-6'>
          <div className="space-y-1.5">
            <label className='block text-xs font-medium text-white/50'>Nama Lengkap</label>
            <input
              type='text'
              value={data.groomFullName}
              onChange={(e) => handleChange('groomFullName', e.target.value)}
              className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
              placeholder="Masukkan nama lengkap..."
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-1.5">
              <label className='block text-xs font-medium text-white/50'>Nama Panggilan</label>
              <input
                type='text'
                value={data.groomNickName}
                onChange={(e) => handleChange('groomNickName', e.target.value)}
                className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
                placeholder="Panggilan..."
              />
            </div>
            <div className="space-y-1.5">
              <label className='block text-xs font-medium text-white/50'>Instagram</label>
              <div className="relative">
                <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type='text'
                  value={data.groomInstagram || ''}
                  onChange={(e) => handleChange('groomInstagram', e.target.value)}
                  className='w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
                  placeholder='username'
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className='block text-xs font-medium text-white/50'>Nama Orang Tua</label>
            <textarea
              value={data.groomParentName || ''}
              onChange={(e) => handleChange('groomParentName', e.target.value)}
              className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 h-24 resize-none'
              placeholder='Putra dari Bpk... dan Ibu...'
            />
          </div>
          
          <ImageUploadField
            label="Foto Mempelai Pria"
            value={data.groomPhotoUrl || ''}
            onChange={(url) => handleChange('groomPhotoUrl', url)}
            invitationId={invitationId}
            path="bride-groom"
            fileName="groom.webp"
          />
        </div>
      </div>

      <div className='w-full h-px bg-white/5' />

      {/* BRIDE */}
      <div className='space-y-6'>
        <h3 className='text-white font-bold flex items-center gap-2 text-lg'>
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
            <User size={18} />
          </div>
          Mempelai Wanita
        </h3>
        
        <div className='grid gap-6'>
          <div className="space-y-1.5">
            <label className='block text-xs font-medium text-white/50'>Nama Lengkap</label>
            <input
              type='text'
              value={data.brideFullName}
              onChange={(e) => handleChange('brideFullName', e.target.value)}
              className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
              placeholder="Masukkan nama lengkap..."
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-1.5">
              <label className='block text-xs font-medium text-white/50'>Nama Panggilan</label>
              <input
                type='text'
                value={data.brideNickName}
                onChange={(e) => handleChange('brideNickName', e.target.value)}
                className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
                placeholder="Panggilan..."
              />
            </div>
            <div className="space-y-1.5">
              <label className='block text-xs font-medium text-white/50'>Instagram</label>
              <div className="relative">
                <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type='text'
                  value={data.brideInstagram || ''}
                  onChange={(e) => handleChange('brideInstagram', e.target.value)}
                  className='w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300'
                  placeholder='username'
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className='block text-xs font-medium text-white/50'>Nama Orang Tua</label>
            <textarea
              value={data.brideParentName || ''}
              onChange={(e) => handleChange('brideParentName', e.target.value)}
              className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 h-24 resize-none'
              placeholder='Putri dari Bpk... dan Ibu...'
            />
          </div>

          <ImageUploadField
            label="Foto Mempelai Wanita"
            value={data.bridePhotoUrl || ''}
            onChange={(url) => handleChange('bridePhotoUrl', url)}
            invitationId={invitationId}
            path="bride-groom"
            fileName="bride.webp"
          />
        </div>
      </div>
    </div>
  );
}
