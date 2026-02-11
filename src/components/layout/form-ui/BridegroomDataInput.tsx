import { InvitationDataUser } from '@/types/interface';
import { User, Instagram } from 'lucide-react';

type BrideGroomInputProps = {
  data: InvitationDataUser;
  onChange: (data: InvitationDataUser) => void;
};

export default function BrideGroomDataInput({ data, onChange }: BrideGroomInputProps) {
  const handleChange = (field: keyof InvitationDataUser, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const inputClasses = "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300";

  return (
    <div className='space-y-10'>
      {/* GROOM DATA */}
      <div className='space-y-6'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <User size={20} />
          </div>
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Mempelai Pria</h3>
            <p className='text-xs text-white/40'>Lengkapi data calon mempelai pria</p>
          </div>
        </div>

        <div className='grid gap-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6'>
          <div className="space-y-1.5">
            <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Lengkap</label>
            <input
              type='text'
              value={data.groomFullName}
              onChange={(e) => handleChange('groomFullName', e.target.value)}
              className={inputClasses}
              placeholder='Contoh: Muhammad Rizki'
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Panggilan</label>
              <input
                type='text'
                value={data.groomNickName}
                onChange={(e) => handleChange('groomNickName', e.target.value)}
                className={inputClasses}
                placeholder='Contoh: Rizki'
              />
            </div>
            <div className="space-y-1.5">
              <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Instagram</label>
              <div className="relative">
                <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type='text'
                  value={data.groomInstagram || ''}
                  onChange={(e) => handleChange('groomInstagram', e.target.value)}
                  className={`${inputClasses} pl-10`}
                  placeholder='@rizkimuhammad'
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Orang Tua</label>
            <input
              type='text'
              value={data.groomParentName}
              onChange={(e) => handleChange('groomParentName', e.target.value)}
              className={inputClasses}
              placeholder='Contoh: Bapak Budi dan Ibu Sari'
            />
          </div>
        </div>
      </div>

      {/* BRIDE DATA */}
      <div className='space-y-6'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
            <User size={20} />
          </div>
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Mempelai Wanita</h3>
            <p className='text-xs text-white/40'>Lengkapi data calon mempelai wanita</p>
          </div>
        </div>

        <div className='grid gap-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6'>
          <div className="space-y-1.5">
            <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Lengkap</label>
            <input
              type='text'
              value={data.brideFullName}
              onChange={(e) => handleChange('brideFullName', e.target.value)}
              className={inputClasses}
              placeholder='Contoh: Siti Aisyah'
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Panggilan</label>
              <input
                type='text'
                value={data.brideNickName}
                onChange={(e) => handleChange('brideNickName', e.target.value)}
                className={inputClasses}
                placeholder='Contoh: Aisyah'
              />
            </div>
            <div className="space-y-1.5">
              <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Instagram</label>
              <div className="relative">
                <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type='text'
                  value={data.brideInstagram || ''}
                  onChange={(e) => handleChange('brideInstagram', e.target.value)}
                  className={`${inputClasses} pl-10`}
                  placeholder='@sitiaisyah'
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Nama Orang Tua</label>
            <input
              type='text'
              value={data.brideParentName}
              onChange={(e) => handleChange('brideParentName', e.target.value)}
              className={inputClasses}
              placeholder='Contoh: Bapak Ahmad dan Ibu Fatimah'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
