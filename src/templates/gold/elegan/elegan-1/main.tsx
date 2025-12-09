import React, { useState, useEffect, useRef } from 'react';
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
} from '@/templates/gold/elegan/elegan-1/sections';
import { Invitation } from '@/types/interface';
import SplashScreen from '@/components/ui/SplashScreen';

export interface Props {
  data: Invitation;
}

export default function GlassesDesign({ data }: Props) {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [guestName, setGuestName] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  // 🔹 Ambil nama tamu dari URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (name) setGuestName(decodeURIComponent(name));
  }, []);

  // 🔹 Fungsi untuk fullscreen
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if ((elem as any).webkitRequestFullscreen)
      (elem as any).webkitRequestFullscreen();
    else if ((elem as any).mozRequestFullScreen)
      (elem as any).mozRequestFullScreen();
    else if ((elem as any).msRequestFullscreen)
      (elem as any).msRequestFullscreen();
  };

  // 🔹 Ketika tombol buka undangan diklik
  const handleOpenInvitation = () => {
    setShowSplash(true); // tampilkan splash
    requestFullscreen();

    setTimeout(() => {
      setShowSplash(false); // hilangkan splash setelah 3 detik
      setIsCoverOpen(true); // buka halaman undangan
      setTimeout(() => toggleMusic(), 500); // nyalakan musik sedikit setelahnya
    }, 3000);
  };

  // 🔹 Toggle musik
  const toggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  // 🔹 Play / pause musik
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  // 🔹 Background slideshow
  const images = [
    '/images/imam81.webp',
    '/images/imam22.webp',
    '/images/imam53.webp',
    '/images/imam73.webp',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='flex justify-center min-h-screen'>
      <div className='lg:w-[390px] w-full min-h-screen shadow-lg relative overflow-hidden'>
        {/* 🔹 Splash Screen (muncul saat loading awal / setelah klik buka undangan) */}
        {showSplash && (
          <div className='absolute inset-0 z-[100] bg-black flex items-center justify-center'>
            <SplashScreen />
          </div>
        )}

        {/* 🔹 Cover Undangan */}
        {!isCoverOpen && !showSplash && (
          <div className='absolute inset-0 z-50'>
            <Cover
              isOpen={isCoverOpen}
              onOpen={handleOpenInvitation}
              guestName={guestName}
            />
          </div>
        )}

        {/* 🔹 Main Content */}
        {isCoverOpen && (
          <>
            {/* Fixed Background */}
            {images.map((img, index) => (
              <div
                key={index}
                className={`fixed inset-0 lg:left-[calc(50%-195px)] lg:right-[calc(50%-195px)] transition-opacity duration-[2000ms] ease-in-out ${
                  currentImage === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img}
                  alt={`Background ${index + 1}`}
                  className={`w-full h-full object-cover brightness-60 transition-transform duration-[6000ms] ease-linear ${
                    currentImage === index ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>
            ))}

            {/* Tombol Musik */}
            <button
              onClick={toggleMusic}
              className={`fixed bottom-38 right-5 lg:right-110 z-[90] w-10 h-10 border border-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isPlaying
                  ? 'bg-transparent hover:bg-green-600'
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
              aria-label='Toggle Music'
            >
              {isPlaying ? (
                <FaMusic className='text-md animate-pulse text-white' />
              ) : (
                <FaVolumeMute className='text-md text-white' />
              )}
            </button>

            {/* Konten Utama */}
            <main className='relative z-10 animate-fade-in'>
              <Introduction data={data} />
              <Quotes />
              <Couple data={data.invitationDataUser} />
              <Gallery />
              <Event data={data.invitationEvent} />
              <Gift data={data.invitationGift} />
              <Thanks data={data.invitationDataUser} />
              <RSVP invitationId={data.invitationId} />
            </main>
          </>
        )}

        {/* Audio Player */}
        <audio ref={audioRef} src='/audio/wedding-music.mp3' loop />
      </div>
    </div>
  );
}
