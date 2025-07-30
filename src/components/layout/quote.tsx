import React from 'react';

const DrBrandQuoteLayout = () => {
  return (
    <div className='min-h-screen shadow-md backdrop-blur-md bg-transparent flex items-center justify-center p-6'>
      <div className='max-w-6xl w-full'>
        <div className='flex flex-col lg:flex-row min-h-[70vh] items-center'>
          {/* Photo Section - Left Side */}
          <div className='flex-1 flex items-center justify-center p-16 relative'>
            {/* Subtle background glow */}
            <div className='absolute inset-0 bg-gradient-to-r from-slate-800/20 to-transparent rounded-3xl'></div>

            {/* Photo container */}
            <div className='relative z-10'>
              <div className='w-72 h-96 bg-gradient-to-b from-slate-800/60 to-slate-900/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm'>
                {/* Image placeholder - representing Dr. Brand */}
                <div className='w-full h-full bg-gradient-to-b from-slate-700/40 via-slate-800/60 to-slate-900/80 flex flex-col items-center justify-center relative'>
                  {/* Elegant silhouette */}
                  <div className='w-28 h-28 bg-gradient-to-b from-slate-600/70 to-slate-700/80 rounded-full mb-6 relative shadow-xl'>
                    <div className='absolute top-5 left-6 w-3 h-3 bg-slate-500/80 rounded-full'></div>
                    <div className='absolute top-5 right-6 w-3 h-3 bg-slate-500/80 rounded-full'></div>
                    <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-slate-500/80 rounded-full'></div>
                  </div>

                  {/* Elegant overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent'></div>

                  {/* Character info */}
                  <div className='absolute bottom-8 left-0 right-0 text-center'>
                    <p className='text-slate-300 text-lg font-light tracking-wide'>
                      Dr. Brand
                    </p>
                    <p className='text-slate-500 text-sm tracking-widest mt-1 font-light'>
                      INTERSTELLAR
                    </p>
                  </div>
                </div>
              </div>

              {/* Soft glow effect */}
              <div className='absolute -inset-8 bg-gradient-to-r from-slate-600/10 to-slate-700/10 rounded-full -z-10 blur-3xl'></div>
            </div>
          </div>

          {/* Quote Section - Right Side */}
          <div className='flex-1 flex items-center justify-center p-16 relative'>
            {/* Subtle background texture */}
            <div className='absolute inset-0 bg-gradient-to-l from-slate-800/10 to-transparent rounded-3xl'></div>

            {/* Quote Content */}
            <div className='text-center max-w-xl z-10 relative'>
              {/* Opening quote mark */}
              <div className='text-8xl text-slate-600/30 font-serif leading-none mb-4 select-none'>
                "
              </div>

              <blockquote className='text-3xl lg:text-4xl font-extralight text-slate-200 leading-relaxed tracking-wide italic mb-8'>
                Love is the one thing that transcends time and space. Maybe we
                should trust that, even if we cannot understand it
              </blockquote>

              {/* Closing quote mark */}
              <div className='text-8xl text-slate-600/30 font-serif leading-none mb-8 select-none flex justify-end'>
                "
              </div>

              {/* Attribution */}
              <div className='flex flex-col items-center space-y-6'>
                <div className='w-32 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent'></div>
                <div className='text-center'>
                  <p className='text-slate-400 font-light text-xl tracking-wide'>
                    Dr. Brand
                  </p>
                  <p className='text-slate-600 text-sm tracking-widest mt-2 font-light'>
                    INTERSTELLAR
                  </p>
                </div>
              </div>

              {/* Minimalist decorative dots */}
              <div className='flex justify-center space-x-4 mt-12'>
                <div className='w-1 h-1 bg-slate-500/60 rounded-full'></div>
                <div className='w-1 h-1 bg-slate-500/40 rounded-full'></div>
                <div className='w-1 h-1 bg-slate-500/60 rounded-full'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrBrandQuoteLayout;
