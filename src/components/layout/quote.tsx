import React from 'react';
import Image from 'next/image';

const DrBrandQuoteLayout = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center p-6 relative overflow-hidden'>
      {/* Space-like starfield background */}
      <div className='absolute inset-0'>
        <div className='absolute top-[10%] left-[20%] w-1 h-1 bg-white/60 rounded-full animate-pulse'></div>
        <div className='absolute top-[25%] right-[15%] w-0.5 h-0.5 bg-blue-200/40 rounded-full'></div>
        <div className='absolute top-[60%] left-[10%] w-0.5 h-0.5 bg-white/50 rounded-full animate-pulse'></div>
        <div className='absolute bottom-[30%] right-[25%] w-1 h-1 bg-blue-100/30 rounded-full'></div>
        <div className='absolute top-[40%] left-[80%] w-0.5 h-0.5 bg-white/70 rounded-full animate-pulse'></div>
        <div className='absolute bottom-[60%] left-[60%] w-0.5 h-0.5 bg-blue-200/50 rounded-full'></div>
        <div className='absolute top-[80%] right-[40%] w-1 h-1 bg-white/40 rounded-full animate-pulse'></div>
        <div className='absolute top-[15%] left-[70%] w-0.5 h-0.5 bg-blue-100/60 rounded-full'></div>
      </div>

      {/* Black hole gravitational effect */}
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none'>
        <div
          className='absolute inset-0 rounded-full bg-gradient-radial from-transparent via-slate-800/10 to-slate-600/20 animate-spin'
          style={{ animationDuration: '30s' }}
        ></div>
        <div
          className='absolute inset-4 rounded-full bg-gradient-radial from-transparent via-slate-700/15 to-slate-500/25 animate-spin'
          style={{ animationDuration: '25s', animationDirection: 'reverse' }}
        ></div>
        <div
          className='absolute inset-8 rounded-full bg-gradient-radial from-transparent via-slate-600/20 to-slate-400/30 animate-spin'
          style={{ animationDuration: '20s' }}
        ></div>
      </div>

      {/* Gravitational lensing effect */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/5 to-transparent'></div>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_45%_55%,_var(--tw-gradient-stops))] from-slate-800/10 via-transparent to-transparent'></div>

      <div className='max-w-7xl w-full relative z-10'>
        <div className='flex flex-col lg:flex-row min-h-[80vh] items-center gap-8'>

          {/* Photo Section - Left Side */}
          <div className='flex-1 flex items-center justify-center p-12 relative'>
            {/* Gravitational distortion effect around photo */}
            <div className='absolute inset-0 bg-gradient-to-br from-slate-800/5 via-slate-700/3 to-transparent rounded-[3rem] backdrop-blur-sm'></div>
            <div
              className='absolute -inset-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600/8 via-slate-700/4 to-transparent rounded-full blur-2xl animate-pulse'
              style={{ animationDuration: '4s' }}
            ></div>

            {/* Photo container with space-enhanced luxury */}
            <div className='relative z-10 group'>
              <div className='w-80 h-[26rem] bg-gradient-to-b from-slate-900/60 via-slate-950/80 to-black/90 rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md border border-slate-600/30 transition-all duration-700 group-hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,1)] group-hover:border-slate-500/40'>

                {/* Image container */}
                <div className='relative w-full h-full'>
                  <Image
                    src="/drbrand.jpg"
                    alt="Dr. Brand from Interstellar"
                    fill
                    className='object-cover'
                    priority
                  />

                  {/* Space overlay effects */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-slate-900/20 to-slate-800/10'></div>
                  <div className='absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_30%_70%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:15px_15px]'></div>

                  {/* Floating cosmic particles */}
                  <div className='absolute top-16 right-12 w-1 h-1 bg-blue-200/40 rounded-full animate-pulse'></div>
                  <div className='absolute bottom-20 left-8 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse'></div>
                  <div className='absolute top-32 left-16 w-0.5 h-0.5 bg-blue-100/50 rounded-full'></div>

                  {/* Character info overlay */}
                  <div className='absolute bottom-10 left-0 right-0 text-center'>
                    <p className='text-slate-100 text-xl font-light tracking-[0.2em] mb-2 drop-shadow-lg'>
                      Dr. Brand
                    </p>
                    <div className='w-16 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent mx-auto mb-3'></div>
                    <p className='text-slate-400 text-xs tracking-[0.4em] font-extralight'>
                      INTERSTELLAR
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced gravitational glow effects */}
              <div
                className='absolute -inset-12 bg-gradient-to-r from-blue-900/8 via-slate-600/12 to-blue-900/8 rounded-full -z-10 blur-3xl transition-all duration-700 group-hover:from-blue-800/12 group-hover:via-slate-500/16 group-hover:to-blue-800/12 animate-pulse'
                style={{ animationDuration: '6s' }}
              ></div>
              <div className='absolute -inset-6 bg-gradient-to-r from-transparent via-blue-400/8 to-transparent rounded-full -z-10 blur-2xl'></div>
            </div>
          </div>

          {/* Quote Section - Right Side */}
          <div className='flex-1 flex items-center justify-center p-12 relative'>
            {/* Space-time distortion background */}
            <div className='absolute inset-0 bg-gradient-to-l from-slate-900/8 via-slate-800/4 to-transparent rounded-[3rem] backdrop-blur-sm'></div>
            <div
              className='absolute -inset-4 bg-[radial-gradient(ellipse_at_70%_30%,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent rounded-full blur-xl animate-pulse'
              style={{ animationDuration: '8s' }}
            ></div>

            {/* Quote Content with cosmic styling */}
            <div className='text-center max-w-2xl z-10 relative'>
              {/* Elegant opening quote with cosmic glow */}

              <blockquote className='text-3xl lg:text-4xl xl:text-[2.75rem] font-extralight text-slate-50 leading-[1.4] tracking-wide mb-10 relative'>
                <span className='bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 bg-clip-text text-transparent italic drop-shadow-sm'>
                  "Cinta adalah satu-satunya hal yang melampaui ruang dan waktu.
                  Mungkin kita harus mempercayainya, meski tak sanggup memahaminya."
                </span>

                {/* Cosmic particles around text */}
                <div className='absolute -top-4 left-8 w-0.5 h-0.5 bg-blue-200/60 rounded-full animate-pulse'></div>
                <div className='absolute top-12 right-4 w-1 h-1 bg-white/40 rounded-full animate-pulse'></div>
                <div className='absolute bottom-8 left-16 w-0.5 h-0.5 bg-blue-100/50 rounded-full'></div>
              </blockquote>


              {/* Premium attribution section with space theme */}
              <div className='flex flex-col items-center space-y-8'>
                {/* Cosmic divider with gravitational effect */}
                <div className='relative'>
                  <div className='w-40 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent'></div>
                  <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300/40 rounded-full -translate-y-1/2 animate-pulse'></div>
                  <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-400/10 rounded-full -translate-y-1/2 blur-sm animate-pulse'></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrBrandQuoteLayout;