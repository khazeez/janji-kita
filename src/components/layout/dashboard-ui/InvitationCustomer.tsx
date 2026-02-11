'use client';

import { useState, useEffect } from 'react';
import GlassesDesign from '@/theme/gold/elegan/elegan-1/main';
import { AllInvitationData } from '@/types/interface';
import {
  Save,
  Eye,
  Users,
  Calendar,
  Music,
  Image as ImageIcon,
  Gift,
  MessageSquare,
  Quote,
  ArrowLeft,
} from 'lucide-react';
import supabase from '@/lib/supabase/client';
import Link from 'next/link';
import { toast } from 'sonner';

// Models
import EditorModels from '@/models/editor';

// Editor Components
import EditorBasic from '../editor-ui/EditorBasic';
import EditorEvent from '../editor-ui/EditorEvent';
import EditorGallery from '../editor-ui/EditorGallery';
import EditorGift from '../editor-ui/EditorGift';

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
    <div className='flex items-center justify-center w-full h-full overflow-hidden p-2'>
      <div className='relative h-[96vh] max-h-[920px] aspect-[380/780] flex-shrink-0'>
        {/* Phone outer frame */}
        <div className='absolute inset-0 rounded-[44px] border-[3px] border-gray-700/80 bg-black shadow-[0_0_60px_rgba(236,72,153,0.08),0_20px_60px_rgba(0,0,0,0.6)]'>
          {/* Dynamic Island / Notch */}
          <div className='absolute top-[2.3%] left-1/2 -translate-x-1/2 w-[26%] h-[3.5%] bg-black rounded-full z-20 flex items-center justify-center'>
            <div className='w-2 h-2 rounded-full bg-gray-800 ring-1 ring-gray-700' />
          </div>

          {/* Side buttons (left) */}
          <div className='absolute -left-[4px] top-[12%] w-[3px] h-[3%] bg-gray-600 rounded-l-sm' />
          <div className='absolute -left-[4px] top-[17%] w-[3px] h-[5%] bg-gray-600 rounded-l-sm' />
          <div className='absolute -left-[4px] top-[23%] w-[3px] h-[5%] bg-gray-600 rounded-l-sm' />
          {/* Side button (right) */}
          <div className='absolute -right-[4px] top-[19%] w-[3px] h-[6.5%] bg-gray-600 rounded-r-sm' />

          {/* Screen */}
          <div className='absolute inset-[10px] rounded-[34px] overflow-hidden bg-black'>
            {children}
            {/* Home Indicator */}
            <div className='absolute bottom-2 left-1/2 -translate-x-1/2 w-[32%] h-[4px] bg-white/30 rounded-full z-30' />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN LAYOUT
====================================================== */

export default function InvitationEditorLayout({ data: initialData }: Props) {
  // Local state untuk data yang sedang diedit
  const [data, setData] = useState<AllInvitationData>(initialData);

  const [activeTab, setActiveTab] = useState<
    'basic' | 'event' | 'gallery' | 'music' | 'gift' | 'greeting' | 'quotes'
  >('basic');

  const [previewMode, setPreviewMode] = useState<PreviewMode>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setCurrentUserId(session?.user?.id || '');
      } catch (err) {
        console.error('Auth check error:', err);
        setCurrentUserId('');
      }
    }

    load();
  }, []);

  if (currentUserId === null) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
        <div className='flex flex-col items-center gap-3'>
           <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
           <p className="text-white/60 text-sm">Validasi Sesi...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update Basic Info
      const updateBasic = await EditorModels.updateInvitationDataUser(
        data.invitationDataUser
      );
      if (!updateBasic.success) throw new Error('Gagal update data mempelai');

      // 2. Update Events
      // Loop update setiap event
      const eventPromises = data.invitationEvent.map((evt) =>
        EditorModels.updateInvitationEvent(evt)
      );
      const eventResults = await Promise.all(eventPromises);
      if (eventResults.some((r) => !r.success)) throw new Error('Gagal update event');

      // 3. Update Gift Address
      const updateGift = await EditorModels.updateInvitationGift(
        data.invitationGift
      );
      if (!updateGift.success) throw new Error('Gagal update hadiah');

      toast.success('Perubahan berhasil disimpan!');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render content editor berdasarkan active tab
  const renderEditorContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <EditorBasic
            data={data.invitationDataUser}
            onChange={(newData) =>
              setData({ ...data, invitationDataUser: newData })
            }
          />
        );
      case 'event':
        return (
          <EditorEvent
            events={data.invitationEvent}
            onChange={(newEvents) =>
              setData({ ...data, invitationEvent: newEvents })
            }
          />
        );
      case 'gallery':
        return (
          <EditorGallery
            data={data.invitationDataUser}
            onChange={(newData) =>
              setData({ ...data, invitationDataUser: newData })
            }
          />
        );
      case 'gift':
        return (
          <EditorGift
            data={data.invitationGift}
            onChange={(newGift) =>
              setData({ ...data, invitationGift: newGift })
            }
          />
        );
      case 'music':
      case 'quotes':
      case 'greeting':
        return (
          <div className='flex flex-col items-center justify-center h-64 text-center p-8 border border-dashed border-white/10 rounded-xl bg-white/5'>
            <p className='text-gray-400 mb-2'>Fitur ini belum tersedia untuk diedit.</p>
            <span className='text-xs text-gray-500'>
              Pengaturan {activeTab} menggunakan default dari tema.
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  if (data.userId && currentUserId && data.userId !== currentUserId) {
    return (
      <div className='min-h-screen flex flex-col font-bold justify-center text-white text-center items-center px-4'>
        <h1 className='text-2xl md:text-4xl lg:text-6xl mb-4'>
          BUKAN UNDANGAN KAMU!
        </h1>
        <p className='text-base md:text-xl mb-6'>
          KAMU DILARANG AKSES UNDANGAN INI
        </p>
        <Link
          href={'/dashboard'}
          className='text-sm bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded'
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className='hidden md:block'>
      {/* ================= ROOT ================= */}
      <div className='flex h-screen bg-gray-900 overflow-hidden'>
        {/* ================= TABS SIDEBAR (Desktop & Tablet) ================= */}
        <div className='hidden md:flex w-20 border-r border-white/10 flex-col justify-center py-4'>
          {[
            { id: 'basic', label: 'Mempelai', icon: Users },
            { id: 'event', label: 'Acara', icon: Calendar },
            { id: 'gallery', label: 'Galeri', icon: ImageIcon },
            { id: 'gift', label: 'Hadiah', icon: Gift },
            { id: 'music', label: 'Musik', icon: Music },
            { id: 'greeting', label: 'Ucapan', icon: MessageSquare },
            { id: 'quotes', label: 'Quotes', icon: Quote },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-3 px-2 text-xs flex flex-col items-center justify-center gap-1.5
                  transition border-l-2
                  ${
                    activeTab === tab.id
                      ? 'text-pink-400 border-pink-500 bg-pink-500/10'
                      : 'text-white/50 hover:text-white border-transparent hover:bg-white/5'
                  }
                `}
              >
                <Icon size={18} />
                <span className='text-[10px] leading-tight text-center'>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ================= EDITOR ================= */}
        <aside className='flex-1 flex flex-col border-r border-white/10 max-w-xl'>
          {/* Header */}
          <div className='px-4 md:px-6 py-3 md:py-4 border-b border-white/10 flex justify-between items-center'>
            <div className='min-w-0 flex-1 flex items-center gap-3'>
              <Link
                href='/dashboard'
                className='flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition'
                title='Kembali ke Dashboard'
              >
                <ArrowLeft size={18} />
              </Link>

              <div className='min-w-0'>
                <h2 className='text-white font-semibold text-sm md:text-base'>
                  Edit Undangan
                </h2>
                <p className='text-xs text-white/60 truncate'>
                  {data.invitationDataUser.groomNickName} &{' '}
                  {data.invitationDataUser.brideNickName}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button
                onClick={() => setPreviewMode('mobile')}
                className='md:hidden flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-xs'
              >
                <Eye size={14} />
                <span className='hidden sm:inline'>Preview</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className='flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-3 md:px-4 py-2 rounded text-xs md:text-sm disabled:opacity-50 transition'
              >
                <Save size={14} />
                {isSaving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className='flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide'>
            {renderEditorContent()}
          </div>
        </aside>

        {/* ================= PREVIEW (RIGHT - Desktop Only) ================= */}
        <section className='hidden md:flex flex-1 bg-gray-950/50'>
          <div className='flex flex-col w-full h-full'>

            {/* Preview Body */}
            <div className='flex-1 relative flex items-center justify-center' style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(236,72,153,0.04) 0%, transparent 70%)' }}>
              {/* Subtle grid pattern */}
              <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <DevicePreview>
                <GlassesDesign data={data} isEditorMode />
              </DevicePreview>
            </div>
          </div>
        </section>
      </div>
      </div>

       {/* ================= MOBILE VIEW (Redirect or Simplified) ================= */}
       <div className="md:hidden min-h-screen bg-gray-900 text-white flex flex-col">
          {/* Header Mobile */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900 z-50">
             <Link href="/dashboard" className="p-2"><ArrowLeft size={20}/></Link>
             <span className="font-semibold">Edit Undangan</span>
             <button onClick={handleSave} disabled={isSaving} className="text-pink-500 font-medium text-sm">
               {isSaving ? '...' : 'Simpan'}
             </button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex overflow-x-auto border-b border-white/10 bg-gray-800/50 scrollbar-hide">
             {[
              { id: 'basic', label: 'Basic', icon: Users },
              { id: 'event', label: 'Event', icon: Calendar },
              { id: 'gallery', label: 'Gallery', icon: ImageIcon },
              { id: 'gift', label: 'Pub', icon: Gift }, // Shortened for mobile
            ].map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[80px] py-3 text-xs flex flex-col items-center gap-1
                    ${activeTab === tab.id ? 'text-pink-400 border-b-2 border-pink-500' : 'text-gray-400'}
                  `}
               >
                 <tab.icon size={16} />
                 <span>{tab.label}</span>
               </button>
            ))}
          </div>

          {/* Mobile Editor Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
             {renderEditorContent()}
          </div>
          
          {/* Mobile Preview FAB */}
          <button 
            onClick={() => setPreviewMode('mobile')}
            className="fixed bottom-6 right-6 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-lg text-white z-40"
          >
            <Eye size={20} />
          </button>
       </div>

      {/* ================= MOBILE PREVIEW OVERLAY ================= */}
      {previewMode === 'mobile' && (
        <div className='fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center'>
          
          {/* Close Button - Fixed to viewport, ensure z-index is highest */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewMode('none');
            }}
            className='fixed top-6 right-6 z-[2002] bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-xl transition-transform active:scale-95'
            aria-label="Tutup Preview"
          >
            ✕ Tutup
          </button>

          {/* Device Frame Container */}
          <div className='relative w-full h-full flex items-center justify-center p-4 animate-in zoom-in-95 duration-300'>
            <div className="w-full max-w-[360px] h-full shadow-2xl overflow-hidden rounded-[28px] bg-black">
               <GlassesDesign data={data} isEditorMode />
            </div>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN PREVIEW ================= */}
      {previewMode === 'fullscreen' && (
        <div className='fixed inset-0 z-[999] bg-black animate-in zoom-in-95 duration-200'>
          <button
            onClick={() => setPreviewMode('none')}
            className='fixed top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-6 py-2 rounded-full z-50 text-sm backdrop-blur-md border border-white/10'
          >
            ✕ Close Preview
          </button>

          <GlassesDesign data={data} />
        </div>
      )}
    </>
  );
}
