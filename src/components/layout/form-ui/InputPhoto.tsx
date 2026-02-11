'use client';

import { PhotoData } from '@/types/interface';
import { Upload, X, Image as ImageIcon, Loader2, Camera, User } from 'lucide-react';
import { convertToWebP, batchConvertToWebP } from '@/lib/imageConverter';
import { uploadToR2, deleteFromR2 } from '@/lib/uploadToR2';
import { useState } from 'react';

type PhotoInputProps = {
  data: PhotoData;
  onChange: (data: PhotoData) => void;
  invitationId?: string;
  userId?: string;
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

  const baseDir = invitationId
    ? `invitations/${invitationId}`
    : userId
    ? `users/${userId}/temp`
    : `temp/${Date.now()}`;

  const handleSingleUpload = async (
    field: 'bridePhoto' | 'groomPhoto',
    file: File | null
  ) => {
    if (!file) {
      if (data[field]) {
        try {
          setLoadingField(field);
          setUploadProgress({ field, message: 'Menghapus foto...' });
          const filename = field === 'bridePhoto' ? 'bride.webp' : 'groom.webp';
          await deleteFromR2(`${baseDir}/bride-groom/${filename}`);
          onChange({ ...data, [field]: null });
        } catch (err) {
          console.error('Delete error:', err);
        } finally {
          setLoadingField(null);
          setUploadProgress(null);
        }
      }
      return;
    }

    try {
      setLoadingField(field);
      setUploadProgress({ field, message: `Mengkompress...` });

      const base64 = await convertToWebP(file, 0.85, 1920, 1080);
      const blob = await (await fetch(base64)).blob();

      const filename = field === 'bridePhoto' ? 'bride.webp' : 'groom.webp';
      const key = `${baseDir}/bride-groom/${filename}`;

      setUploadProgress({ field, message: `Mengupload...` });

      if (data[field]) {
        await deleteFromR2(key);
      }

      const url = await uploadToR2(blob, key);

      onChange({ ...data, [field]: url });
      setUploadProgress({ field, message: 'Berhasil!' });

      setTimeout(() => setUploadProgress(null), 1500);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadProgress(null);
      alert('Gagal upload foto');
    } finally {
      setLoadingField(null);
    }
  };

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
        message: `Kompresi...`,
      });

      const base64Images = await batchConvertToWebP(selected, 0.75, 1600, 1200);
      const urls: string[] = [];

      for (let i = 0; i < base64Images.length; i++) {
        setUploadProgress({
          field: 'gallery',
          message: `${i + 1}/${base64Images.length}`,
        });

        const blob = await (await fetch(base64Images[i])).blob();
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
        message: 'Upload Selesai!',
      });
      setTimeout(() => setUploadProgress(null), 1500);
    } catch (err) {
      console.error('Gallery upload error:', err);
      setUploadProgress(null);
    } finally {
      setLoadingField(null);
    }
  };

  const removeGalleryPhoto = async (index: number) => {
    try {
      setDeletingIndex(index);
      const photoUrl = data.gallery?.[index];
      if (!photoUrl) return;

      const urlObj = new URL(photoUrl);
      const key = urlObj.pathname.substring(1);

      await deleteFromR2(key);

      onChange({
        ...data,
        gallery: data.gallery?.filter((_, i) => i !== index) || [],
      });
    } catch (err) {
      console.error('Delete gallery photo error:', err);
    } finally {
      setDeletingIndex(null);
    }
  };

  const renderSingle = (
    title: string,
    subtitle: string,
    field: 'bridePhoto' | 'groomPhoto',
    iconColor: string,
    photo: string | null
  ) => {
    const isLoading = loadingField === field;
    const progress = uploadProgress?.field === field ? uploadProgress : null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 ml-1">
          <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${iconColor}`}>
            <User size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{subtitle}</p>
          </div>
        </div>

        <div className="relative group aspect-[4/5] rounded-2xl overflow-hidden bg-white/[0.02] border-2 border-dashed border-white/5 transition-all hover:border-pink-500/20">
          {photo ? (
            <>
              {isLoading && (
                <div className='absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center gap-4'>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-t-2 border-pink-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-b-2 border-pink-500/30 animate-spin-reverse" />
                    </div>
                  </div>
                  {progress && (
                    <span className='text-xs font-bold text-white uppercase tracking-widest'>{progress.message}</span>
                  )}
                </div>
              )}
              <img
                src={photo}
                alt={title}
                className='w-full h-full object-cover grayscale-[0.2] transition-all group-hover:grayscale-0 group-hover:scale-105 duration-700'
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => handleSingleUpload(field, null)}
                  disabled={isLoading}
                  className='w-full py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-md'
                >
                  <X size={14} /> Hapus Foto
                </button>
              </div>
            </>
          ) : (
            <label className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-6 transition-all ${
              isLoading ? 'bg-white/5 cursor-not-allowed' : 'hover:bg-white/[0.04]'
            }`}>
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                  {progress && (
                    <span className='text-[10px] font-bold text-pink-500 uppercase tracking-widest'>{progress.message}</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 border border-white/10 group-hover:scale-110 group-hover:text-pink-500 group-hover:border-pink-500/20 transition-all duration-500">
                    <Camera size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white/60">Upload Foto</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">JPG, PNG, WEBP (Maks 5MB)</p>
                  </div>
                </div>
              )}
              <input
                type='file'
                hidden
                accept='image/jpeg,image/png,image/webp,image/jpg'
                onChange={(e) => handleSingleUpload(field, e.target.files?.[0] || null)}
                disabled={isLoading}
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Profile Photos */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {renderSingle(
          'Mempelai Pria',
          'Calon Mempelai Pria',
          'groomPhoto',
          'text-blue-400',
          data.groomPhoto
        )}
        {renderSingle(
          'Mempelai Wanita',
          'Calon Mempelai Wanita',
          'bridePhoto',
          'text-pink-400',
          data.bridePhoto
        )}
      </div>

      {/* Gallery Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between ml-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className='text-lg font-bold text-white tracking-tight'>Galeri Undangan</h3>
              <p className='text-xs text-white/40'>Upload momen kebahagiaan Anda ({data.gallery?.length || 0}/15)</p>
            </div>
          </div>
          {(data.gallery?.length || 0) < 15 && (
             <label className={`flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              loadingField === 'gallery' ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
              <Upload size={14} /> 
              {loadingField === 'gallery' ? 'Uploading...' : 'Tambah Foto'}
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data.gallery?.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 transition-all hover:border-pink-500/20">
              {deletingIndex === i ? (
                <div className='absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-2 text-center gap-2'>
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                  <span className='text-[10px] font-bold text-white uppercase tracking-wider'>Hapus...</span>
                </div>
              ) : (
                <>
                  <img
                    src={url}
                    alt={`Gallery photo ${i + 1}`}
                    className='w-full h-full object-cover transition-all group-hover:scale-110 duration-500'
                  />
                  <button
                    onClick={() => removeGalleryPhoto(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                  >
                    <X size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
          
          {(data.gallery?.length || 0) < 15 && (
            <label className={`group relative aspect-square rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] hover:border-purple-500/20 transition-all ${
              loadingField === 'gallery' ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
              {loadingField === 'gallery' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-white/10 animate-spin" />
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{uploadProgress?.message}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-white/20 group-hover:text-purple-400 transition-colors">
                  <Upload size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                </div>
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
        </div>
      </div>
    </div>
  );
}
