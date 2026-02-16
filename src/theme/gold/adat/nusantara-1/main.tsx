'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaMusic, FaVolumeMute } from 'react-icons/fa';
import SplashScreen from '@/components/ui/SplashScreen';
import { AllInvitationData } from '@/types/interface';
import {
  Cover,
  Introduction,
  Quotes,
  Couple,
  Event,
  Gallery,
  Gift,
  RSVP,
  Thanks,
} from './sections';

type Phase = 'cover' | 'splash' | 'main';

interface Props {
  data: AllInvitationData;
  isEditorMode?: boolean;
}

export default function NusantaraDesign({ data, isEditorMode = false }: Props) {
  const [phase, setPhase] = useState<Phase>('cover');
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (name) setGuestName(decodeURIComponent(name));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying]);

  return (
    <div className={`min-h-screen bg-gray-950 ${isEditorMode ? '' : 'flex justify-center'}`}>
      
      {/* ================= DEVICE FRAME ================= */}
      <div className="relative w-full max-w-[360px] h-screen overflow-hidden bg-gray-950 shadow-2xl border-x border-gray-900">
        
        {/* ================= BACKGROUND PATTERN ================= */}
        {phase === 'main' && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="batik" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="10" stroke="#EAB308" strokeWidth="1" fill="none"/>
                <circle cx="0" cy="0" r="20" stroke="#EAB308" strokeWidth="0.5" fill="none"/>
                <circle cx="60" cy="0" r="20" stroke="#EAB308" strokeWidth="0.5" fill="none"/>
                <circle cx="0" cy="60" r="20" stroke="#EAB308" strokeWidth="0.5" fill="none"/>
                <circle cx="60" cy="60" r="20" stroke="#EAB308" strokeWidth="0.5" fill="none"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#batik)" />
            </svg>
          </div>
        )}

        {/* ================= COVER ================= */}
        <Cover
          isOpen={phase !== 'cover'}
          guestName={guestName}
          bridePhoto={data.invitationDataUser.bridePhotoUrl}
          onOpen={() => {
            setIsPlaying(true);
            setPhase('splash');
          }}
        />

        {/* ================= SPLASH ================= */}
        {phase === 'splash' && (
          <div className="absolute inset-0 z-50">
            <SplashScreen onComplete={() => setPhase('main')} />
          </div>
        )}

        {/* ================= MAIN CONTENT SCROLL ================= */}
        {phase === 'main' && (
          <div className="relative z-10 h-full overflow-x-hidden scrollbar-hide bg-transparent">
            <Introduction data={data} />
            <Quotes />
            <Couple data={data.invitationDataUser} />
            <Event data={data.invitationEvent} />
            <Gallery photos={data.invitationDataUser.galleryPhotos} />
            <Gift data={data.invitationGift} />
            <RSVP invitationId={data.invitationId} />
            <Thanks data={data.invitationDataUser} />
            
            {/* Height Spacer for Bottom Audio Button */}
            <div className="h-24" />
          </div>
        )}

        {/* ================= AUDIO CONTROL ================= */}
        {phase === 'main' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-4">
             <button
              onClick={() => setIsPlaying((p) => !p)}
              className="w-12 h-12 rounded-full border border-yellow-600/30 bg-gray-900/80 backdrop-blur-md flex items-center justify-center shadow-lg shadow-yellow-900/20 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <FaMusic className="text-yellow-500 w-4 h-4 animate-pulse" />
              ) : (
                <FaVolumeMute className="text-gray-400 w-4 h-4" />
              )}
            </button>
          </div>
        )}

        <audio ref={audioRef} src="/audio/anugerah-terindah.mp3" loop />

      </div>
    </div>
  );
}
