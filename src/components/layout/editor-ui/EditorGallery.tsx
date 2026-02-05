'use client';
import { InvitationDataUser } from '@/types/interface';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';

interface Props {
  data: InvitationDataUser;
  onChange: (data: InvitationDataUser) => void;
}

export default function EditorGallery({ data, onChange }: Props) {
  const handleAddPhoto = () => {
    const newGallery = [...data.galleryPhotos, ''];
    onChange({ ...data, galleryPhotos: newGallery });
  };

  const handleRemovePhoto = (index: number) => {
    const newGallery = data.galleryPhotos.filter((_, i) => i !== index);
    onChange({ ...data, galleryPhotos: newGallery });
  };

  const handleChangePhoto = (index: number, value: string) => {
    const newGallery = [...data.galleryPhotos];
    newGallery[index] = value;
    onChange({ ...data, galleryPhotos: newGallery });
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-pink-400 font-medium flex items-center gap-2'>
        <ImageIcon size={16} /> Galeri Foto
      </h3>

      <div className='grid gap-4'>
        {data.galleryPhotos.map((photo, index) => (
          <div key={index} className='flex gap-2 items-center'>
            <div className='flex-1'>
               <div className="relative">
                <ImageIcon size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type='text'
                  value={photo}
                  onChange={(e) => handleChangePhoto(index, e.target.value)}
                  className='w-full bg-black/20 border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition'
                  placeholder='https://...'
                />
              </div>
            </div>
             <button
              onClick={() => handleRemovePhoto(index)}
              className='p-2 text-red-400 hover:bg-white/5 rounded-lg transition'
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <button
          onClick={handleAddPhoto}
          className='flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-pink-500/50 hover:text-pink-400 p-4 rounded-lg text-sm text-gray-400 dashed transition'
        >
          <Plus size={16} /> Tambah Foto URL
        </button>
      </div>
    </div>
  );
}
