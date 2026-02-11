'use client';
import { InvitationDataUser } from '@/types/interface';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface Props {
  data: InvitationDataUser;
  onChange: (data: InvitationDataUser) => void;
  invitationId: string;
}

export default function EditorGallery({ data, onChange, invitationId }: Props) {
  const handleAddPhoto = () => {
    const newGallery = [...(data.galleryPhotos || []), ''];
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
    <div className='space-y-6'>
      <div className="flex items-center justify-between">
        <h3 className='text-white font-bold flex items-center gap-2 text-lg'>
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
            <ImageIcon size={18} />
          </div>
          Galeri Foto
        </h3>
        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full text-white/40 font-medium uppercase tracking-wider">
          {data.galleryPhotos?.length || 0} Foto
        </span>
      </div>

      <div className='grid gap-6'>
        {(data.galleryPhotos || []).map((photo, index) => (
          <ImageUploadField
            key={index}
            label={`Foto #${index + 1}`}
            value={photo}
            onChange={(url) => handleChangePhoto(index, url)}
            invitationId={invitationId}
            path="gallery"
          />
        ))}

        <button
          onClick={handleAddPhoto}
          className='w-full flex items-center justify-center gap-2 border border-dashed border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 hover:text-pink-400 py-4 rounded-xl text-sm text-gray-500 transition-all duration-300 group'
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Tambah Slot Foto
        </button>
      </div>
    </div>
  );
}
