import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  const texts = [
    "Assalamualaikum...."
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const typingSpeed = 80;
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
          // Teks pertama tampil 3 detik, lalu fade
          const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);

            // lanjut ke teks kedua setelah fade 0.8s
            const nextLineTimer = setTimeout(() => {
              setIsFadingOut(false);
              setCurrentLine(1);
              setCurrentChar(0);
              setDisplayText("");
              setShowCursor(true);
            }, 800);
            return () => clearTimeout(nextLineTimer);
          }, 3000);
          return () => clearTimeout(fadeTimer);
        } else {
          // Teks kedua tampil 4 detik, fade terakhir
          const finalFadeTimer = setTimeout(() => {
            setIsFadingOut(true);
          }, 4000);
          return () => clearTimeout(finalFadeTimer);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentChar, currentLine]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#f0f0f0] font-serif">
      <div className="text-center p-10 max-w-3xl">
        <div
          className={`
            text-xl leading-relaxed italic min-h-[1.5em] mb-8
            transition-opacity duration-1000
            ${isFadingOut ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {displayText}
          {showCursor && (
            <span className="inline-block w-[3px] h-[1em] bg-white ml-[2px] align-text-bottom animate-blink" />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
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
