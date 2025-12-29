'use client';

import { useState, useEffect } from 'react';
import GlassesDesign from '@/theme/gold/elegan/elegan-1/main';
import { AllInvitationData } from '@/types/all-invitation-data';
import {
  Save,
  Eye,
  Users,
  Calendar,
  Music,
  Image as ImageIcon,
} from 'lucide-react';
import supabase from '@/lib/supabase/client';
import Link from 'next/link';

/* ======================================================
   TYPES
====================================================== */

interface Props {
  data: AllInvitationData;
}

type PreviewMode = 'none' | 'mobile' | 'fullscreen';

/* ======================================================
   DEVICE PREVIEW (REUSABLE)
====================================================== */

function DevicePreview({ children }: { children: React.ReactNode }) {
    
  return (
    <div className='flex items-center justify-center w-full h-full overflow-hidden'>
      <div className='origin-top scale-[0.9] xl:scale-100'>
        <div className='relative rounded-[36px] border border-white/20 bg-black shadow-2xl'>
          {/* Speaker */}
          <div className='absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/20 rounded-full z-20' />

          {/* Screen */}
          <div className='w-[390px] aspect-[390/780] rounded-[28px] overflow-hidden bg-black'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN LAYOUT
====================================================== */

export default function InvitationEditorLayout({ data }: Props) {
  const [activeTab, setActiveTab] = useState<
    'basic' | 'event' | 'gallery' | 'music'
  >('basic');

  const [previewMode, setPreviewMode] = useState<PreviewMode>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [currenctUserId, setCurrenctUserId] = useState('')

 useEffect(() => {
   async function load() {
     const {
       data: { session },
     } = await supabase.auth.getSession();

     if (!session?.user?.id) {
       throw new Error('User Unauthorized');
     }

     setCurrenctUserId(session.user.id)

   }

   load();
 }, []);

 if(data.userId != currenctUserId) {
  return (
    <div className=' font-bold justify-center text-white text-9xl text-center items-center'>
      <h1>BUKAN UNDANGAN KAMU!, KAMU DILARANG AKSES UNDANGAN INI</h1>
      <Link href={'/dashboard'} className='text-sm'>kembali ke dashboard</Link>
      
    </div>
  );
 }

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  return (
    <>
      {/* ================= ROOT ================= */}
      <div className='flex h-screen bg-gray-900 overflow-hidden'>
        {/* ================= EDITOR ================= */}
        <aside className='flex-1 flex flex-col border-r border-white/10'>
          {/* Header */}
          <div className='px-6 py-4 border-b border-white/10 flex justify-between items-center'>
            <div className='min-w-0'>
              <h2 className='text-white font-semibold'>Edit Undangan</h2>
              <p className='text-xs text-white/60 truncate'>
                {data.invitationDataUser.groomNickName} &{' '}
                {data.invitationDataUser.brideNickName}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <button
                onClick={() => setPreviewMode('mobile')}
                className='lg:hidden flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-xs'
              >
                <Eye size={14} />
                Preview
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className='flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded text-sm'
              >
                <Save size={14} />
                {isSaving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex border-b border-white/10'>
            {[
              { id: 'basic', label: 'Mempelai', icon: Users },
              { id: 'event', label: 'Acara', icon: Calendar },
              { id: 'gallery', label: 'Galeri', icon: ImageIcon },
              { id: 'music', label: 'Musik', icon: Music },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex-1 py-3 text-sm flex items-center justify-center gap-2
                    transition
                    ${
                      activeTab === tab.id
                        ? 'text-pink-400 border-b-2 border-pink-500'
                        : 'text-white/50 hover:text-white'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Editor Content */}
          <div className='flex-1 overflow-y-auto p-6 text-white/70'>
            <p>
              Konten editor <b>{activeTab}</b> diisi di sini.
            </p>
          </div>
        </aside>

        {/* ================= PREVIEW (DESKTOP) ================= */}
        <section className='hidden lg:flex w-[420px] border-l border-white/10'>
          <div className='flex flex-col w-full'>
            {/* Preview Header */}
            <div className='px-4 py-3 flex justify-between items-center'>
              <div className='flex items-center gap-2 text-white text-sm'>
                <Eye size={14} className='text-pink-400' />
                Preview
              </div>

              <button
                onClick={() => setPreviewMode('fullscreen')}
                className='text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded'
              >
                Fullscreen
              </button>
            </div>

            {/* Preview Body */}
            <div className='flex-1'>
              <DevicePreview>
                <GlassesDesign data={data} isEditorMode />
              </DevicePreview>
            </div>
          </div>
        </section>
      </div>

      {/* ================= MOBILE PREVIEW ================= */}
      {previewMode === 'mobile' && (
        <div className='fixed inset-0 z-[999] bg-black'>
          <button
            onClick={() => setPreviewMode('none')}
            className='fixed top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded z-10'
          >
            ✕ Tutup
          </button>

          <DevicePreview>
            <GlassesDesign data={data} />
          </DevicePreview>
        </div>
      )}

      {/* ================= FULLSCREEN PREVIEW ================= */}
      {previewMode === 'fullscreen' && (
        <div className='fixed inset-0 z-[999] bg-black'>
          <button
            onClick={() => setPreviewMode('none')}
            className='fixed top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded z-10'
          >
            ✕ Tutup
          </button>

          <GlassesDesign data={data} />
        </div>
      )}
    </>
  );
}
