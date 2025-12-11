import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const texts = [
    'Assalamualaikum....',
    'Dengan penuh hormat, kami ingin menghadirkanmu dalam kebahagiaan kami',
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const typingSpeed = 40; // Dipercepat dari 80 ke 40
    const fullText = texts[currentLine];

    if (currentChar <= fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, currentChar));
        setCurrentChar(currentChar + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else {
      // selesai mengetik satu baris
      const timer = setTimeout(() => {
        setShowCursor(false);

        if (currentLine === 0) {
          // Teks pertama tampil 1 detik, lalu fade (dipercepat dari 2 detik)
          const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);

            // lanjut ke teks kedua setelah fade 0.5s (dipercepat dari 0.8s)
            const nextLineTimer = setTimeout(() => {
              setIsFadingOut(false);
              setCurrentLine(1);
              setCurrentChar(0);
              setDisplayText('');
              setShowCursor(true);
            }, 500);
            return () => clearTimeout(nextLineTimer);
          }, 1000);
          return () => clearTimeout(fadeTimer);
        } else {
          // Teks kedua tampil 1.5 detik, fade + slide (dipercepat dari 3 detik)
          const finalFadeTimer = setTimeout(() => {
            setIsFadingOut(true);

            // Setelah fade, mulai slide
            const slideTimer = setTimeout(() => {
              setIsSliding(true);

              // Setelah slide selesai, panggil onComplete
              const completeTimer = setTimeout(() => {
                if (onComplete) onComplete();
              }, 1000);

              return () => clearTimeout(completeTimer);
            }, 500);

            return () => clearTimeout(slideTimer);
          }, 1500);
          return () => clearTimeout(finalFadeTimer);
        }
      }, 300); // Dipercepat dari 500

      return () => clearTimeout(timer);
    }
  }, [currentChar, currentLine, onComplete]);

  return (
    <div
      className={`
        min-h-screen bg-black flex items-center justify-center text-[#f0f0f0] font-serif
        transition-all duration-[1200ms] ease-in-out origin-bottom
        ${
          isSliding
            ? 'scale-y-0 -translate-y-full opacity-0'
            : 'scale-y-100 translate-y-0 opacity-100'
        }
      `}
      style={{
        transformOrigin: 'bottom center',
      }}
    >
      <div className='text-center p-10 max-w-3xl'>
        <div
          className={`
            text-sm leading-relaxed italic min-h-[1.5em] mb-8
            transition-opacity duration-[500ms]
            ${isFadingOut ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {displayText}
          {showCursor && (
            <span className='inline-block w-[3px] h-[1em] bg-white ml-[2px] align-text-bottom animate-blink' />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 0.7s infinite;
        }

        @media (max-width: 768px) {
          .text-xl {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
