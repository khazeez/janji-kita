'use client';

import React, { useState } from 'react';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { convertToWebP } from '@/lib/imageConverter';
import { uploadToR2, deleteFromR2 } from '@/lib/uploadToR2';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  invitationId: string;
  path: string; // e.g. "bride-groom" or "gallery"
  fileName?: string; // specific filename if needed
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  invitationId,
  path,
  fileName,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      
      // 1. Convert to WebP
      const compressedBase64 = await convertToWebP(file, 0.8, 1200, 1200);
      const blob = await (await fetch(compressedBase64)).blob();

      // 2. Prepare Path
      const actualFileName = fileName || `img-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const fullPath = `invitations/${invitationId}/${path}/${actualFileName}`;

      // 3. Upload to R2
      const url = await uploadToR2(blob, fullPath);
      
      onChange(url);
      toast.success('Foto berhasil diupload');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal upload foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    
    try {
      // Extract key from URL
      const urlObj = new URL(value);
      const key = urlObj.pathname.substring(1); // Remove leading slash

      await deleteFromR2(key);
      onChange('');
      toast.success('Foto dihapus');
    } catch (error) {
      console.error('Delete error:', error);
      // Even if delete fails (e.g. file not found), still clear the field
      onChange('');
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/50">{label}</label>
      
      <div className="relative group">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300"
              placeholder="https://... atau upload di samping"
            />
            <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          </div>

          <label className={`
            flex items-center justify-center w-11 h-11 rounded-xl transition-all cursor-pointer
            ${isUploading ? 'bg-pink-500/20 text-pink-500' : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/5'}
          `}>
            {isUploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>

          {value && (
            <button
              onClick={handleDelete}
              className="w-11 h-11 flex items-center justify-center bg-red-500/5 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 border border-red-500/10 rounded-xl transition-all"
              title="Hapus / Reset"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {value && (
          <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
