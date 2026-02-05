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
} from '@/theme/gold/elegan/elegan-1/sections';

import SplashScreen from '@/components/ui/SplashScreen';
import { AllInvitationData } from '@/types/interface';

type Phase = 'cover' | 'splash' | 'main';

const defaultBackgroundImages = [
  '/images/imam81.webp',
  '/images/imam22.webp',
  '/images/imam53.webp',
  '/images/imam73.webp',
];

interface Props {
  data: AllInvitationData;
  isEditorMode?: boolean;
}

export default function GlassesDesign({ data, isEditorMode = false }: Props) {
  const [phase, setPhase] = useState<Phase>('cover');
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [currentImage, setCurrentImage] = useState(0);

  // Use user photos if available, otherwise default
  const backgroundImages = data.invitationDataUser.galleryPhotos && data.invitationDataUser.galleryPhotos.length > 0
    ? data.invitationDataUser.galleryPhotos
    : defaultBackgroundImages;

  // Ref to keep track of images without triggering effect re-runs or HMR errors
  const backgroundImagesRef = useRef(backgroundImages);
  backgroundImagesRef.current = backgroundImages;

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (name) setGuestName(decodeURIComponent(name));
  }, []);

  useEffect(() => {
    if (phase !== 'main') return;
    const timer = setInterval(() => {
      setCurrentImage((p) => (p + 1) % backgroundImagesRef.current.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying]);

  return (
    <div
      className={`min-h-screen ${isEditorMode ? '' : 'flex justify-center'}`}
    >
      {/* ================= DEVICE FRAME ================= */}
      <div className='relative w-full max-w-[360px] h-screen overflow-hidden bg-black shadow-xl'>
        {/* ================= BACKGROUND ================= */}
        {phase === 'main' && (
          <div className='absolute inset-0 z-0'>
            {backgroundImages.map((img, i) => (
              <img
                key={img}
                src={img}
                alt=''
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-[2000ms]
                  ${currentImage === i ? 'opacity-100' : 'opacity-0'}
                `}
              />
            ))}
            <div className='absolute inset-0 bg-black/40' />
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
          <div className='absolute inset-0 z-40'>
            <SplashScreen onComplete={() => setPhase('main')} />
          </div>
        )}

        {/* ================= SCROLL AREA ================= */}
        {phase === 'main' && (
          <div className='relative z-10 h-full overflow-x-hidden scrollbar-hide'>
            <Introduction data={data} />
            <Quotes />
            <Couple data={data.invitationDataUser} />
            <Gallery photos={data.invitationDataUser.galleryPhotos} />
            <Event data={data.invitationEvent} />
            <Gift data={data.invitationGift} />
            <Thanks data={data.invitationDataUser} />
          </div>
        )}

        {/* ================= RSVP (FIXED) ================= */}
        {phase === 'main' && (
          <div className='absolute z-50'>
            <RSVP invitationId={data.invitationId} />
          </div>
        )}

        {/* ================= AUDIO (FIXED) ================= */}
        {phase === 'main' && (
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className='
              absolute bottom-6 right-4 z-50
              w-10 h-10 rounded-full
              border border-white
              flex items-center justify-center
              bg-black/40 backdrop-blur
            '
          >
            {isPlaying ? (
              <FaMusic className='text-white animate-pulse' />
            ) : (
              <FaVolumeMute className='text-white' />
            )}
          </button>
        )}

        <audio ref={audioRef} src='/audio/anugerah-terindah.mp3' loop />
      </div>
    </div>
  );
}
