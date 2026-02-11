'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
} from 'lucide-react';
import supabase from '@/lib/supabase/client';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.85);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerH = container.clientHeight;
      const containerW = container.clientWidth;
      // Frame = screen (360x740) + 4px border = 364x744
      const frameW = 364;
      const frameH = 720;
      const scaleH = (containerH - 40) / frameH;
      const scaleW = (containerW - 40) / frameW;
      setScale(Math.min(scaleH, scaleW, 1));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className='flex items-center justify-center w-full h-full overflow-hidden'>
      <div
        className='flex-shrink-0'
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {/* Fullscreen phone frame — no bezel */}
        <div className='relative rounded-[40px] border-[3px] border-gray-600/60 bg-black shadow-[0_0_80px_rgba(0,0,0,0.5),0_0_30px_rgba(236,72,153,0.06)]'>
          
          {/* Side buttons (left) */}
          <div className='absolute -left-[3px] top-[90px] w-[2.5px] h-[22px] bg-gray-600/80 rounded-l-sm' />
          <div className='absolute -left-[3px] top-[126px] w-[2.5px] h-[36px] bg-gray-600/80 rounded-l-sm' />
          <div className='absolute -left-[3px] top-[172px] w-[2.5px] h-[36px] bg-gray-600/80 rounded-l-sm' />
          {/* Side button (right — power) */}
          <div className='absolute -right-[3px] top-[148px] w-[2.5px] h-[44px] bg-gray-600/80 rounded-r-sm' />

          {/* Screen — fullscreen 360×740 */}
          <div className='w-[360px] h-[740px] rounded-[36px] overflow-hidden bg-black relative'>
            {children}

            {/* Dynamic Island (floating on screen) */}
            <div className='absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-black rounded-full z-30 flex items-center justify-center'>
              <div className='w-[6px] h-[6px] rounded-full bg-gray-900 ring-1 ring-gray-800' />
            </div>

            {/* Home Indicator */}
            <div className='absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/40 rounded-full z-30' />
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
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {(() => {
            switch (activeTab) {
              case 'basic':
                return (
                  <EditorBasic
                    data={data.invitationDataUser}
                    invitationId={data.invitationId}
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
                    invitationId={data.invitationId}
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
                  <div className='flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/5'>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Sparkles className="text-white/20" size={32} />
                    </div>
                    <p className='text-white font-medium mb-1'>Segera Hadir</p>
                    <p className='text-gray-500 text-sm max-w-[200px]'>
                      Fitur {activeTab} sedang dalam pengembangan.
                    </p>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
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
        <div className='hidden md:flex w-24 border-r border-white/5 flex-col justify-center py-6 bg-gray-900/50 backdrop-blur-xl'>
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
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  relative py-3 px-2 flex flex-col items-center justify-center
                  transition-all duration-300 group
                  ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white/80'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabSidebar"
                    className="absolute right-0 top-1 bottom-1 w-[3px] bg-pink-500 rounded-l-full shadow-[0_0_12px_rgba(236,72,153,0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${isActive ? 'bg-pink-500/10 text-pink-500' : 'bg-transparent group-hover:bg-white/5'}
                `}>
                  <Icon size={20} className={isActive ? 'animate-pulse-slow' : ''} />
                </div>
                <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ================= EDITOR ================= */}
        <aside className='flex-1 flex flex-col border-r border-white/5 max-w-xl bg-gray-900/40'>
          {/* Header */}
          <div className='px-6 py-5 border-b border-white/5 flex justify-between items-center bg-gray-900/30 backdrop-blur-sm'>
            <div className='min-w-0 flex-1 flex items-center gap-3'>
              <Link
                href='/dashboard'
                className='flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/5 hover:scale-105 active:scale-95'
                title='Kembali ke Dashboard'
              >
                <ArrowLeft size={20} />
              </Link>

              <div className='min-w-0'>
                <h2 className='text-white font-bold text-lg leading-tight tracking-tight'>
                  Editor
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className='text-[10px] text-white/40 font-medium uppercase tracking-widest'>
                    {data.invitationDataUser.groomNickName} & {data.invitationDataUser.brideNickName}
                  </p>
                </div>
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
                className='relative group overflow-hidden flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-pink-600/20 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]'
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Save size={16} className="relative z-10" />
                <span className="relative z-10">{isSaving ? 'Menyimpan…' : 'Simpan'}</span>
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className='flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide'>
            {renderEditorContent()}
          </div>
        </aside>

        {/* ================= PREVIEW (RIGHT - Desktop Only) ================= */}
        <section className='hidden md:flex flex-1 items-center justify-center bg-gray-950/50 relative overflow-hidden'>
          {/* Subtle grid pattern */}
          <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className='absolute inset-0' style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(236,72,153,0.04) 0%, transparent 70%)' }} />
          <DevicePreview>
            <GlassesDesign data={data} isEditorMode />
          </DevicePreview>
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
