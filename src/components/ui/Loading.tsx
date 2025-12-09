import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export default function JanjiKitaLoading() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fontSize, setFontSize] = useState('5rem');

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;

    // Tentukan ukuran font dinamis
    if (isMobile) setFontSize('2.5rem');
    else if (isTablet) setFontSize('4rem');
    else if (isDesktop) setFontSize('6rem');

    // Kurangi jumlah partikel di layar kecil
    const particleCount = isMobile ? 10 : isTablet ? 18 : 25;
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    }));
    setParticles(newParticles);

    // Update ukuran font jika layar di-resize
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setFontSize('2.5rem');
      else if (width < 1024) setFontSize('4rem');
      else setFontSize('6rem');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white rounded-full opacity-60 animate-float"
            style={{
              width: window.innerWidth < 768 ? '2px' : '4px',
              height: window.innerWidth < 768 ? '2px' : '4px',
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative text-center px-4">
        <div className="relative inline-block">
          {/* Outline text */}
          <div className="logo-text" style={{ fontSize }}>
            <span>Janji</span>
            <span>Kita</span>
          </div>

          {/* Fill text */}
          <div className="logo-text-fill" style={{ fontSize }}>
            <span style={{ color: 'white' }}>Janji</span>
            <span style={{ color: '#FF1493' }}>Kita</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-text {
          font-weight: 900;
          letter-spacing: 1px;
          -webkit-text-stroke: 0.5px white;
          -webkit-text-fill-color: transparent;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.1;
        }

        .logo-text-fill {
          position: absolute;
          top: 0;
          left: 0;
          font-weight: 900;
          letter-spacing: 1px;
          overflow: hidden;
          width: 0;
          animation: fillText 3s cubic-bezier(0.9, 0, 0.3, 1) forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.1;
        }

        /* Animasi 80% cepat, 20% lambat */
        @keyframes fillText {
          0% {
            width: 0;
          }
          80% {
            width: 85%;
          }
          100% {
            width: 100%;
          }
        }

        /* Partikel */
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(30px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
