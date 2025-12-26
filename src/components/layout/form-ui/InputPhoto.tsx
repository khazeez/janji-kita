import { PhotoData } from '@/types/interface';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { convertToWebP, batchConvertToWebP } from '@/lib/imageConverter';
import { useState } from 'react';

type PhotoInputProps = {
  data: PhotoData;
  onChange: (data: PhotoData) => void;
};

export default function PhotoInput({ data, onChange }: PhotoInputProps) {
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (
    field: 'bridePhoto' | 'groomPhoto',
    file: File | null
  ) => {
    if (file) {
      try {
        setIsConverting(true);
        // Convert to WebP with 80% quality
        const webpBase64 = await convertToWebP(file, 0.8);
        onChange({ ...data, [field]: webpBase64 });
      } catch (error) {
        console.error('Failed to convert image:', error);
        alert('Gagal mengkonversi gambar. Silakan coba lagi.');
      } finally {
        setIsConverting(false);
      }
    } else {
      onChange({ ...data, [field]: null });
    }
  };

  const handleGalleryChange = async (files: FileList | null) => {
    if (!files) return;

    const currentGalleryLength = data.gallery?.length || 0;
    const remainingSlots = 15 - currentGalleryLength;
    const filesToAdd = Math.min(files.length, remainingSlots);

    // Convert FileList to Array
    const filesArray = Array.from(files).slice(0, filesToAdd);

    try {
      setIsConverting(true);
      // Batch convert all images to WebP
      const webpImages = await batchConvertToWebP(filesArray, 0.8);

      onChange({
        ...data,
        gallery: [...(data.gallery || []), ...webpImages],
      });
    } catch (error) {
      console.error('Failed to convert gallery images:', error);
      alert('Gagal mengkonversi beberapa gambar. Silakan coba lagi.');
    } finally {
      setIsConverting(false);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    const newGallery = data.gallery?.filter((_, i) => i !== index) || [];
    onChange({ ...data, gallery: newGallery });
  };

  const renderPhotoUpload = (
    title: string,
    field: 'bridePhoto' | 'groomPhoto',
    color: string,
    photo: string | null
  ) => (
    <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
      <h3 className={`text-lg font-semibold ${color} mb-4`}>{title}</h3>
      <div className='space-y-4'>
        {photo ? (
          <div className='relative'>
            <img
              src={photo}
              alt={title}
              className='w-full h-64 object-cover rounded-lg'
            />
            <button
              onClick={() => handleFileChange(field, null)}
              className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors'
              disabled={isConverting}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors ${
              isConverting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              {isConverting ? (
                <>
                  <div className='w-12 h-12 mb-3 border-4 border-gray-400 border-t-pink-500 rounded-full animate-spin'></div>
                  <p className='text-sm text-gray-300'>
                    Mengkonversi gambar...
                  </p>
                </>
              ) : (
                <>
                  <Upload className='w-12 h-12 mb-3 text-gray-400' />
                  <p className='mb-2 text-sm text-gray-300'>
                    <span className='font-semibold'>Klik untuk upload</span>{' '}
                    atau drag and drop
                  </p>
                  <p className='text-xs text-gray-400'>
                    PNG, JPG, JPEG (MAX. 5MB)
                  </p>
                  <p className='text-xs text-green-400 mt-1'>
                    Otomatis dikonversi ke WebP
                  </p>
                </>
              )}
            </div>
            <input
              type='file'
              className='hidden'
              accept='image/png,image/jpeg,image/jpg'
              onChange={(e) =>
                handleFileChange(field, e.target.files?.[0] || null)
              }
              disabled={isConverting}
            />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      <div className='grid md:grid-cols-2 gap-6'>
        {renderPhotoUpload(
          'Foto Mempelai Pria',
          'groomPhoto',
          'text-blue-400',
          data.groomPhoto
        )}
        {renderPhotoUpload(
          'Foto Mempelai Wanita',
          'bridePhoto',
          'text-pink-400',
          data.bridePhoto
        )}
      </div>

      <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
        <h3 className='text-lg font-semibold text-purple-400 mb-4'>
          Galeri Foto ({data.gallery?.length || 0}/15)
        </h3>

        {(data.gallery?.length || 0) < 15 && (
          <label
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors mb-4 ${
              isConverting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className='flex flex-col items-center justify-center'>
              {isConverting ? (
                <>
                  <div className='w-10 h-10 mb-2 border-4 border-gray-400 border-t-purple-500 rounded-full animate-spin'></div>
                  <p className='text-sm text-gray-300'>
                    Mengkonversi gambar...
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className='w-10 h-10 mb-2 text-gray-400' />
                  <p className='text-sm text-gray-300'>
                    <span className='font-semibold'>Upload Foto Galeri</span>
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    Maksimal {15 - (data.gallery?.length || 0)} foto lagi
                  </p>
                  <p className='text-xs text-green-400 mt-1'>
                    Otomatis dikonversi ke WebP
                  </p>
                </>
              )}
            </div>
            <input
              type='file'
              className='hidden'
              accept='image/png,image/jpeg,image/jpg'
              multiple
              onChange={(e) => handleGalleryChange(e.target.files)}
              disabled={isConverting}
            />
          </label>
        )}

        {data.gallery && data.gallery.length > 0 && (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {data.gallery.map((photo, index) => (
              <div key={index} className='relative group'>
                <img
                  src={photo}
                  alt={`Gallery ${index + 1}`}
                  className='w-full h-32 object-cover rounded-lg'
                />
                <button
                  onClick={() => removeGalleryPhoto(index)}
                  className='absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  disabled={isConverting}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
