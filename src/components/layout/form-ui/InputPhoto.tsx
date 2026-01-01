'use client';

import { PhotoData } from '@/types/interface';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { convertToWebP, batchConvertToWebP } from '@/lib/imageConverter';
import { uploadToR2, deleteFromR2 } from '@/lib/uploadToR2';
import { useState } from 'react';

type PhotoInputProps = {
  data: PhotoData;
  onChange: (data: PhotoData) => void;
  invitationId?: string; // Tambahkan prop ini
  userId?: string; // Optional, jika mau pakai userId juga
};

export default function PhotoInput({
  data,
  onChange,
  invitationId,
  userId,
}: PhotoInputProps) {
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    field: string;
    message: string;
  } | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Generate dynamic baseDir berdasarkan invitationId atau userId
  const baseDir = invitationId
    ? `invitations/${invitationId}`
    : userId
    ? `users/${userId}/temp`
    : `temp/${Date.now()}`; // Fallback jika belum ada ID

  /* ------------------ Bride / Groom ------------------ */
  const handleSingleUpload = async (
    field: 'bridePhoto' | 'groomPhoto',
    file: File | null
  ) => {
    if (!file) {
      // Delete old photo if exists
      if (data[field]) {
        try {
          setLoadingField(field);
          setUploadProgress({ field, message: 'Menghapus foto...' });
          const filename = field === 'bridePhoto' ? 'bride.webp' : 'groom.webp';
          await deleteFromR2(`${baseDir}/bride-groom/${filename}`);
          onChange({ ...data, [field]: null });
        } catch (err) {
          console.error('Delete error:', err);
          alert('Gagal menghapus foto');
        } finally {
          setLoadingField(null);
          setUploadProgress(null);
        }
      }
      return;
    }

    try {
      setLoadingField(field);
      setUploadProgress({ field, message: `Mengkompress ${file.name}...` });

      // Kompress dengan kualitas tinggi untuk foto mempelai
      const base64 = await convertToWebP(file, 0.85, 1920, 1080);
      const blob = await (await fetch(base64)).blob();

      const filename = field === 'bridePhoto' ? 'bride.webp' : 'groom.webp';
      const key = `${baseDir}/bride-groom/${filename}`;

      setUploadProgress({ field, message: `Mengupload ${filename}...` });

      // Delete old photo if exists before uploading new one
      if (data[field]) {
        await deleteFromR2(key);
      }

      const url = await uploadToR2(blob, key);

      onChange({ ...data, [field]: url });
      setUploadProgress({ field, message: 'Upload berhasil!' });

      setTimeout(() => setUploadProgress(null), 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadProgress(null);
      alert(
        `Gagal upload foto: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      setLoadingField(null);
    }
  };

  /* ------------------ Gallery ------------------ */
  const handleGalleryChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const current = data.gallery?.length || 0;
    const remaining = 15 - current;

    if (remaining <= 0) {
      alert('Galeri sudah penuh (maksimal 15 foto)');
      return;
    }

    const selected = Array.from(files).slice(0, remaining);

    try {
      setLoadingField('gallery');
      setUploadProgress({
        field: 'gallery',
        message: `Mengkompress ${selected.length} foto...`,
      });

      // Kompress dengan kualitas sedang untuk galeri
      const base64Images = await batchConvertToWebP(selected, 0.75, 1600, 1200);

      const urls: string[] = [];

      for (let i = 0; i < base64Images.length; i++) {
        setUploadProgress({
          field: 'gallery',
          message: `Mengupload foto ${i + 1} dari ${base64Images.length}...`,
        });

        const blob = await (await fetch(base64Images[i])).blob();

        // Generate unique filename untuk gallery
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 9);
        const filename = `photo-${timestamp}-${randomId}.webp`;

        const url = await uploadToR2(blob, `${baseDir}/gallery/${filename}`);
        urls.push(url);
      }

      onChange({
        ...data,
        gallery: [...(data.gallery || []), ...urls],
      });

      setUploadProgress({
        field: 'gallery',
        message: 'Semua foto berhasil diupload!',
      });
      setTimeout(() => setUploadProgress(null), 2000);
    } catch (err) {
      console.error('Gallery upload error:', err);
      setUploadProgress(null);
      alert(
        `Gagal upload galeri: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      setLoadingField(null);
    }
  };

  const removeGalleryPhoto = async (index: number) => {
    if (!confirm('Hapus foto ini dari galeri?')) return;

    try {
      setDeletingIndex(index);

      const photoUrl = data.gallery?.[index];
      if (!photoUrl) return;

      // Extract key from URL
      // Contoh URL: https://cdn.yourdomain.com/invitations/abc123/gallery/photo-123.webp
      // Extract: invitations/abc123/gallery/photo-123.webp
      const urlObj = new URL(photoUrl);
      const key = urlObj.pathname.substring(1); // Remove leading slash

      await deleteFromR2(key);

      onChange({
        ...data,
        gallery: data.gallery?.filter((_, i) => i !== index) || [],
      });
    } catch (err) {
      console.error('Delete gallery photo error:', err);
      alert(
        `Gagal menghapus foto: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      setDeletingIndex(null);
    }
  };

  /* ------------------ UI ------------------ */
  const renderSingle = (
    title: string,
    field: 'bridePhoto' | 'groomPhoto',
    color: string,
    photo: string | null
  ) => {
    const isLoading = loadingField === field;
    const progress = uploadProgress?.field === field ? uploadProgress : null;

    return (
      <div className='bg-gray-800 p-6 rounded-xl border border-gray-700'>
        <h3 className={`text-lg font-semibold ${color} mb-4`}>{title}</h3>

        {photo ? (
          <div className='relative group'>
            {isLoading && (
              <div className='absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center z-10 gap-2'>
                <Loader2 className='w-8 h-8 animate-spin text-white' />
                {progress && (
                  <span className='text-sm text-white'>{progress.message}</span>
                )}
              </div>
            )}
            <img
              src={photo}
              alt={title}
              className='h-64 w-full object-cover rounded-lg'
              onError={(e) => {
                console.error('Image load error:', photo);
                e.currentTarget.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EError%3C/text%3E%3C/svg%3E';
              }}
            />
            <button
              onClick={() => handleSingleUpload(field, null)}
              disabled={isLoading}
              className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
              title='Hapus foto'
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg transition-colors ${
              isLoading
                ? 'border-blue-500 bg-blue-500/10 cursor-not-allowed'
                : 'border-gray-600 hover:border-gray-500 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className='w-10 h-10 mb-2 animate-spin text-blue-400' />
                {progress && (
                  <span className='text-sm text-blue-400 text-center px-4'>
                    {progress.message}
                  </span>
                )}
              </>
            ) : (
              <>
                <Upload className='w-10 h-10 mb-2 text-gray-400' />
                <span className='text-sm text-gray-400'>Klik untuk upload</span>
              </>
            )}
            <input
              type='file'
              hidden
              accept='image/jpeg,image/png,image/webp,image/jpg'
              onChange={(e) =>
                handleSingleUpload(field, e.target.files?.[0] || null)
              }
              disabled={isLoading}
            />
          </label>
        )}
      </div>
    );
  };

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
          <label
            className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg mb-4 transition-colors ${
              loadingField === 'gallery'
                ? 'border-purple-500 bg-purple-500/10 cursor-not-allowed'
                : 'border-gray-600 hover:border-gray-500 cursor-pointer'
            }`}
          >
            {loadingField === 'gallery' ? (
              <>
                <Loader2 className='w-8 h-8 mb-2 animate-spin text-purple-400' />
                {uploadProgress?.field === 'gallery' && (
                  <span className='text-sm text-purple-400 text-center px-4'>
                    {uploadProgress.message}
                  </span>
                )}
              </>
            ) : (
              <>
                <ImageIcon className='w-8 h-8 mb-2 text-gray-400' />
                <span className='text-sm text-gray-400'>
                  Pilih hingga {15 - (data.gallery?.length || 0)} foto
                </span>
              </>
            )}
            <input
              type='file'
              hidden
              multiple
              accept='image/jpeg,image/png,image/webp,image/jpg'
              onChange={(e) => handleGalleryChange(e.target.files)}
              disabled={loadingField === 'gallery'}
            />
          </label>
        )}

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {data.gallery?.map((url, i) => (
            <div key={i} className='relative group'>
              {deletingIndex === i && (
                <div className='absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center z-10 gap-2'>
                  <Loader2 className='w-6 h-6 animate-spin text-white' />
                  <span className='text-xs text-white'>Menghapus...</span>
                </div>
              )}
              <img
                src={url}
                alt={`Gallery photo ${i + 1}`}
                className='h-32 w-full object-cover rounded-lg'
                onError={(e) => {
                  console.error('Gallery image load error:', url);
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EError%3C/text%3E%3C/svg%3E';
                }}
              />
              <button
                onClick={() => removeGalleryPhoto(i)}
                disabled={deletingIndex === i}
                className='absolute top-1 right-1 bg-red-500 hover:bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
                title='Hapus foto'
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
