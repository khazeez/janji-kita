'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaMusic, FaVolumeMute } from 'react-icons/fa';

import {
  Cover,
  Couple,
  Gift,
  Event,
  Introduction,
  Quotes,
  Thanks,
  RSVP,
  Gallery,
} from '@/theme/gold/traditional/sections';

import SplashScreen from '@/components/ui/SplashScreen';
import { AllInvitationData } from '@/types/interface';

import './main.css';

type Phase = 'cover' | 'splash' | 'main';

interface Props {
  data: AllInvitationData;
  isEditorMode?: boolean;
}

export default function AdatDesign({ data, isEditorMode = false }: Props) {
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
  }, [isPlaying, data.invitationDataUser.audioUrl]);

  return (
    <div className={`min-h-screen ${isEditorMode ? '' : 'flex justify-center'}`}>
      <div className='relative w-full max-w-[360px] min-h-screen bg-white shadow-xl'>
        <Cover
          guestName={guestName}
          bridePhoto={data.invitationDataUser.bridePhotoUrl}
          groomPhoto={data.invitationDataUser.groomPhotoUrl}
          onOpen={() => {
            setIsPlaying(true);
            setPhase('splash');
          }}
        />

        {phase === 'splash' && (
          <div className='absolute inset-0 z-40'>
            <SplashScreen onComplete={() => setPhase('main')} />
          </div>
        )}

        {phase === 'main' && (
          <div className='relative z-10'>
            <Introduction />
            <Couple data={data.invitationDataUser} />
            <Gallery photos={data.invitationDataUser.galleryPhotos} />
            <Event data={data.invitationEvent} />
            <Gift data={data.invitationGift} />
            <Quotes />
            <Thanks data={data.invitationDataUser} />
            <RSVP invitationId={data.invitationId} />
          </div>
        )}

        {phase === 'main' && (
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className='fixed bottom-6 right-4 z-50 w-10 h-10 rounded-full bg-[#c9a96e] text-white flex items-center justify-center shadow-lg'
          >
            {isPlaying ? <FaMusic className='animate-pulse' /> : <FaVolumeMute />}
          </button>
        )}

        <audio ref={audioRef} src={data.invitationDataUser.audioUrl || '/audio/anugerah-terindah.mp3'} loop />
      </div>
    </div>
  );
}
