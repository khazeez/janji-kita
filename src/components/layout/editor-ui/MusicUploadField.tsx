'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, Music } from 'lucide-react';
import { uploadToR2, deleteFromR2 } from '@/lib/uploadToR2';
import { toast } from 'sonner';

interface MusicUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  invitationId: string;
  fileName?: string;
}

export default function MusicUploadField({
  label,
  value,
  onChange,
  invitationId,
  fileName,
}: MusicUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate if it is an audio file
    if (!file.type.startsWith('audio/')) {
        toast.error('File harus berupa audio/musik');
        return;
    }

    // Limit file size (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 10MB');
        return;
    }

    try {
      setIsUploading(true);
      
      // Prepare Path
      const extension = file.name.split('.').pop() || 'mp3';
      const actualFileName = fileName || `music-${Date.now()}.${extension}`;
      const fullPath = `invitations/${invitationId}/music/${actualFileName}`;

      // Upload to R2 directly (no conversion needed for audio usually, unless user wants to)
      const url = await uploadToR2(file, fullPath, file.type);
      
      onChange(url);
      toast.success('Musik berhasil diupload');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal upload musik');
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
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
      }
      toast.success('Musik dihapus');
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
              value={value ? 'Musik Terpasang' : ''}
              readOnly
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white/50 focus:outline-none cursor-not-allowed placeholder:text-white/20"
              placeholder="Upload musik..."
            />
            <Music size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
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
              accept="audio/*"
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
          <div className="mt-3 bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
                <Music size={20} />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">Preview Musik</p>
                <audio ref={audioRef} controls src={value} className="w-full h-8 mt-1 opacity-80 scale-[0.95] origin-left" />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
