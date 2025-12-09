import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export default function JanjiKitaLoading() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-float"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative text-center">
        <div className="relative inline-block">
          {/* Outline text */}
          <div className="logo-text">
            <span>Janji</span>
            <span>Kita</span>
          </div>

          {/* Fill text */}
          <div className="logo-text-fill">
            <span style={{ color: 'white' }}>Janji</span>
            <span style={{ color: '#FF1493' }}>Kita</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-text {
          font-size: 5rem;
          font-weight: 900;
          letter-spacing: 1px;
          -webkit-text-stroke: 0.5px white;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        .logo-text-fill {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 5rem;
          font-weight: 900;
          letter-spacing: 1px;
          overflow: hidden;
          width: 0;
          /* Durasi tetap 3s, tapi percepatan melambat di akhir */
          animation: fillText 3s cubic-bezier(0.9, 0, 0.3, 1) forwards;
        }

        /* 80% awal cepat, 20% akhir lambat */
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

        .animate-float {
          animation: float 3s infinite;
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

        @media (max-width: 768px) {
          .logo-text,
          .logo-text-fill {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
