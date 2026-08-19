import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import type { LoveStoryClasses } from '../types';

export interface LoveStoryProps {
  classes?: LoveStoryClasses;
}

export default function LoveStoryTimeline({ classes = {} }: LoveStoryProps) {
  const [visibleMoments, setVisibleMoments] = useState<Set<number>>(new Set());
  const momentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    momentRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisibleMoments((prev) => new Set(prev).add(index)); },
        { threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const moments = [
    { id: 1, title: 'First Meeting', date: 'January 14, 2023', description: "Our eyes met across the crowded coffee shop.", image: '☕', color: 'from-pink-400 to-rose-500', bgGlow: 'bg-pink-500/10' },
    { id: 2, title: 'First Date', date: 'February 2, 2023', description: 'A walk in the park turned into hours of conversation.', image: '🌸', color: 'from-purple-400 to-pink-500', bgGlow: 'bg-purple-500/10' },
    { id: 3, title: 'First Kiss', date: 'March 15, 2023', description: 'Under the stars, everything felt perfect.', image: '⭐', color: 'from-blue-400 to-purple-500', bgGlow: 'bg-blue-500/10' },
    { id: 4, title: 'Adventure Together', date: 'June 20, 2023', description: 'Our first trip together. Mountains, laughter, and memories.', image: '🏔️', color: 'from-teal-400 to-blue-500', bgGlow: 'bg-teal-500/10' },
    { id: 5, title: 'Forever Promise', date: 'December 24, 2023', description: 'The day I knew I wanted to spend the rest of my life with you.', image: '💍', color: 'from-rose-400 to-red-500', bgGlow: 'bg-rose-500/10' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden ${classes.container || ''}`}>
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className={`absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl ${classes.bgOrb1 || ''}`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl ${classes.bgOrb2 || ''}`} />
      </div>

      <div className={`h-screen overflow-y-auto pt-20 md:pt-32 pb-20 relative ${classes.scrollContainer || ''}`}>
        <div className={`max-w-5xl mx-auto px-4 md:px-6 relative ${classes.innerContainer || ''}`}>
          <div className={`md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-rose-500 opacity-30 ${classes.timelineLine || ''}`} />

          <svg className={`hidden md:block absolute left-1/2 top-0 h-full w-full pointer-events-none ${classes.svgPath || ''}`}
            style={{ transform: 'translateX(-50%)', maxWidth: '900px' }}>
            <defs>
              <linearGradient id='pathGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor='#ec4899' /><stop offset='50%' stopColor='#a855f7' /><stop offset='100%' stopColor='#ef4444' />
              </linearGradient>
            </defs>
            <path d='M 450 50 C 200 200, 700 350, 450 550 S 200 800, 450 1000 S 700 1200, 450 1400' fill='none' stroke='rgba(255, 255, 255, 0.05)' strokeWidth='3' />
            <path d='M 450 50 C 200 200, 700 350, 450 550 S 200 800, 450 1000 S 700 1200, 450 1400' fill='none' stroke='url(#pathGradient)' strokeWidth='3' strokeLinecap='round' strokeDasharray='2000' strokeDashoffset='2000' className='animate-dash' />
          </svg>

          <div className={`relative space-y-16 md:space-y-32 ${classes.momentsContainer || ''}`}>
            {moments.map((moment, index) => (
              <div key={moment.id} ref={(el) => { momentRefs.current[index] = el; }}
                className={`flex items-center ${index % 2 === 0 ? 'md:justify-start justify-start' : 'md:justify-end justify-start'} ${classes.momentCard || ''}`}>
                <div className={`relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 w-full md:max-w-md ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} group hover:bg-white/10 hover:border-white/20 transition-all duration-500 ${visibleMoments.has(index) ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-8'}`}
                  style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  <div className={`absolute inset-0 ${moment.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 ${classes.momentGlow || ''}`} />
                  <div className={`absolute top-1/2 ${index % 2 === 0 ? 'md:-right-12 -left-8' : 'md:-left-12 -left-8'} w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br ${moment.color} rounded-full shadow-lg flex items-center justify-center transform -translate-y-1/2 group-hover:scale-125 transition-transform duration-300 ${classes.momentDot || ''}`}>
                    <Heart className='w-3 h-3 md:w-5 md:h-5 text-white' fill='white' />
                  </div>
                  <div className={`absolute -top-2 -right-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${classes.momentIcon || ''}`}>
                    <Sparkles className='w-5 h-5 md:w-6 md:h-6' />
                  </div>
                  <div className={`text-5xl md:text-7xl mb-4 md:mb-6 text-center relative ${classes.momentIcon || ''}`}>
                    <div className='relative'>{moment.image}</div>
                  </div>
                  <div className='text-center space-y-3'>
                    <h3 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${moment.color} bg-clip-text text-transparent ${classes.momentTitle || ''}`}>{moment.title}</h3>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 ${classes.momentDate || ''}`}>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${moment.color} ${classes.momentDateDot || ''}`} />
                      <p className='text-xs md:text-sm text-gray-300 font-medium'>{moment.date}</p>
                    </div>
                    <p className={`text-sm md:text-base text-gray-300 leading-relaxed pt-2 ${classes.momentDescription || ''}`}>{moment.description}</p>
                  </div>
                  <div className={`absolute -top-1 -right-1 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${moment.color} opacity-10 rounded-3xl blur-xl ${classes.momentGlow || ''}`} />
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-24 md:mt-40 mb-20 px-4 ${classes.endingContainer || ''}`}>
            <div className='inline-flex items-center gap-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-6 md:px-10 py-4 md:py-5 shadow-2xl hover:bg-white/15 transition-all duration-300 group'>
              <Heart className='w-6 h-6 md:w-8 md:h-8 text-pink-400' fill='currentColor' />
              <p className={`text-xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 bg-clip-text text-transparent ${classes.endingText || ''}`}>To be continued...</p>
              <Sparkles className={`w-6 h-6 md:w-8 md:h-8 text-yellow-300 group-hover:rotate-12 transition-transform duration-300 ${classes.endingIcon || ''}`} />
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce ${classes.scrollIndicator || ''}`}>
        <div className={`text-gray-400 text-xs md:text-sm font-medium ${classes.scrollLabel || ''}`}>Scroll Down</div>
        <div className={`text-2xl text-pink-400 ${classes.scrollArrow || ''}`}>↓</div>
      </div>
    </div>
  );
}
