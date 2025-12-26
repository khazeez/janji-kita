import { Invitation } from '@/types/interface';
import { getSlug } from '@/models/invitations';
import { useEffect, useState, useRef } from 'react';

type Props = {
  data: Invitation;
  onChange: (data: Invitation) => void;
  onValidationChange?: (isValid: boolean) => void; // Prop baru untuk komunikasi dengan parent
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

  // Ref untuk menyimpan timeout ID
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch existing slugs saat component mount
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

  // Validasi slug format dan ketersediaan
  const validateSlug = (slug: string) => {
    // Reset message
    setValidationMessage(null);

    if (!slug) {
      setValidationMessage({
        type: 'info',
        message: 'Silakan masukkan link undangan Anda',
      });
      onValidationChange?.(false);
      return false;
    }

    // Validasi format: hanya huruf kecil, angka, dan dash
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setValidationMessage({
        type: 'error',
        message:
          'Link hanya boleh mengandung huruf kecil, angka, dan tanda hubung (-)',
      });
      onValidationChange?.(false);
      return false;
    }

    // Validasi panjang minimum
    if (slug.length < 3) {
      setValidationMessage({
        type: 'error',
        message: 'Link minimal 3 karakter',
      });
      onValidationChange?.(false);
      return false;
    }

    // Validasi tidak boleh diawali atau diakhiri dengan dash
    if (slug.startsWith('-') || slug.endsWith('-')) {
      setValidationMessage({
        type: 'error',
        message: 'Link tidak boleh diawali atau diakhiri dengan tanda hubung',
      });
      onValidationChange?.(false);
      return false;
    }

    // Validasi tidak boleh ada double dash
    if (slug.includes('--')) {
      setValidationMessage({
        type: 'error',
        message: 'Link tidak boleh mengandung tanda hubung ganda (--)',
      });
      onValidationChange?.(false);
      return false;
    }

    // Check if slug already exists (exclude current invitation's slug if editing)
    const isSlugTaken = existingSlugs.some(
      (existingSlug) =>
        existingSlug.toLowerCase() === slug.toLowerCase() &&
        existingSlug !== data.invitationUrl // Allow keeping the same slug when editing
    );

    if (isSlugTaken) {
      setValidationMessage({
        type: 'error',
        message: 'Link ini sudah digunakan. Silakan buat link lain.',
      });
      onValidationChange?.(false);
      return false;
    }

    // Slug valid dan tersedia
    setValidationMessage({
      type: 'success',
      message: 'Link tersedia! ✓',
    });
    onValidationChange?.(true);
    return true;
  };

  // Handle input change dengan debounce untuk validasi
  const handleSlugChange = (value: string) => {
    // Konversi ke lowercase dan replace space dengan dash
    const cleanedValue = value.toLowerCase().replace(/\s+/g, '-');

    handleChange('invitationUrl', cleanedValue);

    // Clear timeout sebelumnya jika ada
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set status checking
    setIsChecking(true);

    // Set validasi dengan status info sementara user mengetik
    if (cleanedValue) {
      setValidationMessage({
        type: 'info',
        message: 'Memeriksa ketersediaan...',
      });
    }

    // Informasikan ke parent bahwa sedang dalam proses validasi
    onValidationChange?.(false);

    // Validasi setelah user berhenti mengetik (debounce)
    debounceTimeout.current = setTimeout(() => {
      validateSlug(cleanedValue);
      setIsChecking(false);
    }, 500);
  };

  // Cleanup timeout saat component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <>
      <div className='space-y-6'>
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-white mb-4'>
            Buat Link Undangan Anda
          </h3>
          <p className='text-gray-400 text-sm mb-6'>
            Link ini akan digunakan untuk mengakses undangan digital Anda
          </p>

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Custom Link
            </label>
            <div className='flex items-stretch'>
              <span className='px-4 flex items-center bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-gray-400 whitespace-nowrap text-sm'>
                janjikita.art/
              </span>
              <input
                type='text'
                value={data.invitationUrl}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={`flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-r-lg text-white focus:ring-2 focus:outline-none transition-all ${
                  validationMessage?.type === 'error'
                    ? 'border-red-500 focus:ring-red-500'
                    : validationMessage?.type === 'success'
                    ? 'border-green-500 focus:ring-green-500'
                    : 'focus:ring-pink-500'
                }`}
                placeholder='nama-mempelai'
              />
            </div>

            <div className='mt-2 min-h-[20px]'>
              {isChecking ? (
                <p className='text-xs text-gray-400 flex items-center gap-2'>
                  <span className='animate-spin'>⏳</span>
                  Memeriksa ketersediaan...
                </p>
              ) : validationMessage ? (
                <p
                  className={`text-xs font-medium ${
                    validationMessage.type === 'error'
                      ? 'text-red-400'
                      : validationMessage.type === 'success'
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  {validationMessage.message}
                </p>
              ) : (
                <p className='text-xs text-gray-500'>
                  Hanya huruf kecil, angka, dan tanda hubung
                </p>
              )}
            </div>
          </div>

          {data.invitationUrl && validationMessage?.type === 'success' && (
            <div className='mt-6 p-4 bg-gray-700 rounded-lg border border-green-500/30'>
              <p className='text-xs text-gray-400 mb-1'>Preview Link:</p>
              <div className='flex items-center justify-between gap-4'>
                <p className='text-green-400 font-medium break-all text-xl'>
                  https://janjikita.art/{data.invitationUrl}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
