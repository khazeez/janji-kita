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
  const [showCover, setShowCover] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [isSplashRollingUp, setIsSplashRollingUp] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ambil nama tamu dari query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (name) setGuestName(decodeURIComponent(name));
  }, []);

  // Fungsi untuk masuk ke fullscreen
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

  // Fungsi saat undangan dibuka (dari cover)
  const handleOpenInvitation = () => {
    console.log('Button clicked, hiding cover...');
    setShowCover(false);
    setIsPlaying(true);

    // Delay sedikit lalu tampilkan splash dan main content
    setTimeout(() => {
      console.log('Showing splash screen and preparing main content...');
      setShowMain(true); // Main content sudah di-render di belakang splash
      setShowSplash(true);
      requestFullscreen();
    }, 100);
  };

  // Fungsi saat splash screen selesai - mulai animasi roll up
  const handleSplashComplete = () => {
    console.log('Splash complete, rolling up...');
    setIsSplashRollingUp(true);

    // Setelah animasi roll up selesai (1.2 detik), hapus splash screen
    setTimeout(() => {
      setShowSplash(false);
      console.log('Splash removed, main content fully visible');
    }, 1200);
  };

  // Toggle music
  const toggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  // Play / Pause music
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Background slideshow
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/images/imam81.webp',
    '/images/imam22.webp',
    '/images/imam53.webp',
    '/images/imam73.webp',
  ];

  useEffect(() => {
    if (!showMain) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [showMain, images.length]);

  return (
    <div className='flex justify-center min-h-screen'>
      {/* Cover - Full screen tanpa batasan width */}
      {showCover && (
        <div className='absolute inset-0 z-50'>
          <Cover
            isOpen={false}
            onOpen={handleOpenInvitation}
            guestName={guestName}
          />
        </div>
      )}

      {/* Mobile Frame */}
      <div className='lg:w-[390px] w-full min-h-screen shadow-lg relative overflow-hidden'>
        {/* 3. Main Content - Di-render di belakang splash */}
        {showMain && (
          <div className='relative'>
            {/* Background Gambar dengan animasi smooth */}
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

            {/* Bagian Utama Undangan */}
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
          </div>
        )}

        {/* 2. Splash Screen - Tampil di atas main content dengan animasi roll up */}
        {showSplash && (
          <div
            className={`fixed inset-0 z-[100] lg:left-[calc(50%-195px)] lg:right-[calc(50%-195px)] transition-all duration-[1200ms] ease-in-out ${
              isSplashRollingUp
                ? 'scale-y-0 -translate-y-full opacity-0'
                : 'scale-y-100 translate-y-0 opacity-100'
            }`}
            style={{
              transformOrigin: 'bottom center',
            }}
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </div>
        )}

        {/* Pemutar Audio */}
        <audio ref={audioRef} src='/audio/anugerah-terindah.mp3' loop />
      </div>
    </div>
  );
}
