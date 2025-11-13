'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Music,
  Video,
  Clock,
  Mail,
  Calendar,
  MapPin,
  Gift,
  Image,
  Sparkles,
  QrCode,
} from 'lucide-react';

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
  image?: string;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  {
    color: '#060010',
    title: 'Music',
    description: 'Putar musik untuk acara spesial Anda',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'Countdown',
    description: 'Hitung mundur ke hari istimewa',
    image:
      'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'Gift',
    description: 'Kiriman hadiah spesial',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'Animation',
    description: 'Animasi interaktif yang memukau',
    image:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'Gallery',
    description: 'Koleksi foto kenangan indah',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'Video',
    description: 'Video momen berharga',
    // image:
    //   'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'QR Code',
    description: 'Scan untuk info lebih lanjut',
    // image:
    //   'https://images.unsplash.com/photo-1617039487629-24c5ee56c8f1?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'RSVP',
    description: 'Konfirmasi kehadiran Anda',
    image:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'Calendar',
    description: 'Tandai tanggal penting',
    image:
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop',
  },
  {
    color: '#060010',
    title: 'Location',
    description: 'Temukan lokasi acara',
    // image:
    //   'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400&h=300&fit=crop',
  },
];

const getCardIcon = (title: string) => {
  const iconProps = { size: 120, strokeWidth: 1, className: 'opacity-20' };
  switch (title) {
    // case 'Music':
    //   return <Music {...iconProps} />;
    case 'Video':
      return <Video {...iconProps} />;
    // case 'Countdown':
    //   return <Clock {...iconProps} />;
    // case 'RSVP':
    //   return <Mail {...iconProps} />;
    // case 'Calendar':
    //   return <Calendar {...iconProps} />;
    case 'Location':
      return <MapPin {...iconProps} />;
    // case 'Gift':
    //   return <Gift {...iconProps} />;
    // case 'Gallery':
    //   return <Image {...iconProps} />;
    // case 'Animation':
    //   return <Sparkles {...iconProps} />;
    case 'QR Code':
      return <QrCode {...iconProps} />;
    default:
      return null;
  }
};

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      particle.parentNode?.removeChild(particle);
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        spotlightRef.current.style.opacity = '0';
        cards.forEach((card) => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          cardElement,
          e.clientX,
          e.clientY,
          glowIntensity,
          spotlightRadius
        );
      });

      spotlightRef.current.style.left = `${e.clientX}px`;
      spotlightRef.current.style.top = `${e.clientY}px`;

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
          : 0;

      spotlightRef.current.style.opacity = targetOpacity.toString();
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach((card) => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className='bento-section grid gap-2 p-3 max-w-[100rem] select-none relative'
    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
            --pink-primary: rgba(132, 0, 255, 1);
            --pink-glow: rgba(132, 0, 255, 0.2);
            --pink-border: rgba(132, 0, 255, 0.8);
          }
          
          .card-responsive {
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
            margin: 0 auto;
            padding: 0.5rem;
          }
          
          @media (min-width: 700px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
              width: 100%;
            }
            
            .card-responsive .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            
            .card-responsive .card:nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 7px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .card--border-glow:hover::after {
            opacity: 1;
          }
          
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          @media (max-width: 699px) {
            .card-responsive {
              grid-template-columns: 2fr;
              width: 100%;
              margin: 0 auto;
              padding: 0.5rem;
            }
            
            .card-responsive .card {
              width: 100%;
              min-height: 180px;
            }
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className='card-responsive grid gap-2'>
          {cardData.map((card, index) => {
            const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? 'card--border-glow' : ''
            }`;

            const cardStyle = {
              backgroundColor: card.color || 'var(--background-dark)',
              borderColor: 'var(--border-color)',
              color: 'var(--white)',
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '200px',
            } as React.CSSProperties;

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {card.image && (
                    <div className='absolute inset-0 z-0'>
                      <img
                        src={card.image}
                        alt={card.title}
                        className='w-full h-full object-cover opacity-30'
                        loading='lazy'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
                    </div>
                  )}
                  <div className='card__header flex justify-between items-start gap-3 relative text-white z-10'>
                    <div className='flex items-center gap-2'>
                      {getCardIcon(card.title || '')}
                      <span className='card__label text-base'>
                        {card.label}
                      </span>
                    </div>
                  </div>
                  <div className='card__content flex flex-col relative text-white z-10'>
                    <h3
                      className={`card__title font-semibold text-xl m-0 mb-2 ${
                        textAutoHide ? 'text-clamp-1' : ''
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`card__description text-xs leading-5 opacity-90 ${
                        textAutoHide ? 'text-clamp-2' : ''
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </ParticleCard>
              );
            }

            return (
              <div key={index} className={baseClassName} style={cardStyle}>
                {card.image && (
                  <div className='absolute inset-0 z-0'>
                    <img
                      src={card.image}
                      alt={card.title}
                      className='w-full h-full object-cover opacity-30'
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
                  </div>
                )}
                <div className='card__header flex justify-between items-start gap-3 relative text-white z-10'>
                  <div className='flex items-center gap-2'>
                    {getCardIcon(card.title || '')}
                    <span className='card__label text-base'>{card.label}</span>
                  </div>
                </div>
                <div className='card__content flex flex-col relative text-white z-10'>
                  <h3
                    className={`card__title font-semibold text-xl m-0 mb-2 ${
                      textAutoHide ? 'text-clamp-1' : ''
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`card__description text-xs leading-5 opacity-90 ${
                      textAutoHide ? 'text-clamp-2' : ''
                    }`}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
