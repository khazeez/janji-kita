import { Invitation } from '@/types/interface';
import { getSlug } from '@/models/invitations';
import { useEffect, useState, useRef } from 'react';
import { Link2, Globe, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type Props = {
  data: Invitation;
  onChange: (data: Invitation) => void;
  onValidationChange?: (isValid: boolean) => void;
};

export default function LinkDataInput({
  data,
  onChange,
  onValidationChange,
}: Props) {
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [validationMessage, setValidationMessage] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const slugs = await getSlug();
        setExistingSlugs(slugs);
      } catch (error) {
        console.error('Error fetching slugs:', error);
      }
    };

    fetchSlugs();
  }, []);

  const handleChange = (field: keyof Invitation, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const validateSlug = (slug: string) => {
    setValidationMessage(null);

    if (!slug) {
      setValidationMessage({
        type: 'info',
        message: 'Silakan masukkan link undangan Anda',
      });
      onValidationChange?.(false);
      return false;
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setValidationMessage({
        type: 'error',
        message: 'Hanya huruf kecil, angka, dan dash (-)',
      });
      onValidationChange?.(false);
      return false;
    }

    if (slug.length < 3) {
      setValidationMessage({
        type: 'error',
        message: 'Link minimal 3 karakter',
      });
      onValidationChange?.(false);
      return false;
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
      setValidationMessage({
        type: 'error',
        message: 'Tanda hubung tidak boleh di awal atau akhir',
      });
      onValidationChange?.(false);
      return false;
    }

    if (slug.includes('--')) {
      setValidationMessage({
        type: 'error',
        message: 'Tidak boleh ada tanda hubung ganda (--)',
      });
      onValidationChange?.(false);
      return false;
    }

    const isSlugTaken = existingSlugs.some(
      (existingSlug) =>
        existingSlug.toLowerCase() === slug.toLowerCase() &&
        existingSlug !== data.invitationUrl
    );

    if (isSlugTaken) {
      setValidationMessage({
        type: 'error',
        message: 'Link sudah digunakan. Silakan buat yang lain.',
      });
      onValidationChange?.(false);
      return false;
    }

    setValidationMessage({
      type: 'success',
      message: 'Link tersedia!',
    });
    onValidationChange?.(true);
    return true;
  };

  const handleSlugChange = (value: string) => {
    const cleanedValue = value.toLowerCase().replace(/\s+/g, '-');
    handleChange('invitationUrl', cleanedValue);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setIsChecking(true);
    if (cleanedValue) {
      setValidationMessage({
        type: 'info',
        message: 'Memeriksa...',
      });
    }

    onValidationChange?.(false);
    debounceTimeout.current = setTimeout(() => {
      validateSlug(cleanedValue);
      setIsChecking(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const inputClasses = "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300";

  return (
    <div className='space-y-10'>
      <div className='space-y-6'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
            <Globe size={20} />
          </div>
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>URL Undangan</h3>
            <p className='text-xs text-white/40'>Buat link unik untuk undangan digital Anda</p>
          </div>
        </div>

        <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-8 space-y-8'>
          <div className="space-y-3">
            <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Custom Link</label>
            <div className='flex items-stretch group'>
              <div className='px-4 flex items-center bg-white/[0.05] border border-r-0 border-white/10 rounded-l-xl text-white/40 whitespace-nowrap text-sm font-medium transition-colors group-focus-within:border-pink-500/50 group-focus-within:bg-white/[0.08]'>
                janjikita.art/
              </div>
              <input
                type='text'
                value={data.invitationUrl}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={`flex-1 px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-r-xl text-white focus:outline-none transition-all font-medium ${
                  validationMessage?.type === 'error'
                    ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5 focus:ring-red-500/10'
                    : validationMessage?.type === 'success'
                    ? 'border-green-500/50 focus:border-green-500 focus:bg-green-500/5 focus:ring-green-500/10'
                    : 'focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-pink-500/10'
                }`}
                placeholder='nama-mempelai'
              />
            </div>

            <div className='mt-2 flex items-center gap-2 px-1'>
              {isChecking ? (
                <div className='text-[10px] text-white/40 flex items-center gap-1.5 font-bold uppercase tracking-wider'>
                  <Loader2 size={12} className="animate-spin" />
                  Memeriksa...
                </div>
              ) : validationMessage ? (
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  validationMessage.type === 'error' ? 'text-red-400' : 
                  validationMessage.type === 'success' ? 'text-green-400' : 'text-white/40'
                }`}>
                  {validationMessage.type === 'error' && <AlertCircle size={12} />}
                  {validationMessage.type === 'success' && <CheckCircle2 size={12} />}
                  {validationMessage.message}
                </div>
              ) : (
                <p className='text-[10px] text-white/20 font-bold uppercase tracking-wider'>
                  Minimal 3 karakter, huruf kecil dan angka saja
                </p>
              )}
            </div>
          </div>

          {data.invitationUrl && validationMessage?.type === 'success' && (
            <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden group'>
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
              
              <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                  <p className='text-[10px] text-green-500/60 font-bold uppercase tracking-widest'>Link Anda sudah siap</p>
                  <p className='text-white font-bold break-all text-xl selection:bg-green-500/30'>
                    janjikita.art/<span className="text-green-400">{data.invitationUrl}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
                  <Link2 size={20} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
