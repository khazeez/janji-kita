'use client';

import { PhotoData } from '@/types/interface';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { convertToWebP, batchConvertToWebP } from '@/lib/imageConverter';
import { uploadToR2 } from '@/lib/uploadToR2';
import { useState } from 'react';

type PhotoInputProps = {
  data: PhotoData;
  onChange: (data: PhotoData) => void;
  mempelaiIndex: number; // <-- penting
};

export default function PhotoInput({
  data,
  onChange,
  mempelaiIndex,
}: PhotoInputProps) {
  const [isConverting, setIsConverting] = useState(false);

  const baseDir = `mempelai-${mempelaiIndex}`;

  /* ------------------ Bride / Groom ------------------ */
  const handleSingleUpload = async (
    field: 'bridePhoto' | 'groomPhoto',
    file: File | null
  ) => {
    if (!file) {
      onChange({ ...data, [field]: null });
      return;
    }

    try {
      setIsConverting(true);

      const base64 = await convertToWebP(file, 0.8);
      const blob = await (await fetch(base64)).blob();

      const filename = field === 'bridePhoto' ? 'bride.webp' : 'groom.webp';

      const url = await uploadToR2(blob, `${baseDir}/bride-groom/${filename}`);

      onChange({ ...data, [field]: url });
    } catch (err) {
      console.error(err);
      alert('Gagal upload foto');
    } finally {
      setIsConverting(false);
    }
  };

  /* ------------------ Gallery ------------------ */
  const handleGalleryChange = async (files: FileList | null) => {
    if (!files) return;

    const current = data.gallery?.length || 0;
    const remaining = 15 - current;
    const selected = Array.from(files).slice(0, remaining);

    try {
      setIsConverting(true);

      const base64Images = await batchConvertToWebP(selected, 0.8);

      const urls = await Promise.all(
        base64Images.map(async (b64, i) => {
          const blob = await (await fetch(b64)).blob();
          return uploadToR2(
            blob,
            `${baseDir}/gallery/photo-${current + i + 1}.webp`
          );
        })
      );

      onChange({
        ...data,
        gallery: [...(data.gallery || []), ...urls],
      });
    } catch (err) {
      console.error(err);
      alert('Gagal upload galeri');
    } finally {
      setIsConverting(false);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    onChange({
      ...data,
      gallery: data.gallery?.filter((_, i) => i !== index) || [],
    });
  };

  /* ------------------ UI ------------------ */
  const renderSingle = (
    title: string,
    field: 'bridePhoto' | 'groomPhoto',
    color: string,
    photo: string | null
  ) => (
    <div className='bg-gray-800 p-6 rounded-xl border border-gray-700'>
      <h3 className={`text-lg font-semibold ${color} mb-4`}>{title}</h3>

      {photo ? (
        <div className='relative'>
          <img src={photo} className='h-64 w-full object-cover rounded-lg' />
          <button
            onClick={() => handleSingleUpload(field, null)}
            className='absolute top-2 right-2 bg-red-500 p-2 rounded-full'
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className='flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer'>
          <Upload className='w-10 h-10 mb-2' />
          <input
            type='file'
            hidden
            accept='image/*'
            onChange={(e) =>
              handleSingleUpload(field, e.target.files?.[0] || null)
            }
            disabled={isConverting}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className='space-y-6'>
      <div className='grid md:grid-cols-2 gap-6'>
        {renderSingle(
          'Foto Mempelai Pria',
          'groomPhoto',
          'text-blue-400',
          data.groomPhoto
        )}
        {renderSingle(
          'Foto Mempelai Wanita',
          'bridePhoto',
          'text-pink-400',
          data.bridePhoto
        )}
      </div>

      <div className='bg-gray-800 p-6 rounded-xl border border-gray-700'>
        <h3 className='text-lg font-semibold text-purple-400 mb-4'>
          Galeri Foto ({data.gallery?.length || 0}/15)
        </h3>

        {(data.gallery?.length || 0) < 15 && (
          <label className='flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer mb-4'>
            <ImageIcon className='w-8 h-8 mb-2' />
            <input
              type='file'
              hidden
              multiple
              accept='image/*'
              onChange={(e) => handleGalleryChange(e.target.files)}
              disabled={isConverting}
            />
          </label>
        )}

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {data.gallery?.map((url, i) => (
            <div key={i} className='relative'>
              <img src={url} className='h-32 w-full object-cover rounded-lg' />
              <button
                onClick={() => removeGalleryPhoto(i)}
                className='absolute top-1 right-1 bg-red-500 p-1 rounded-full'
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
