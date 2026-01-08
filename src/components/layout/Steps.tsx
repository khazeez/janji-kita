'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LayoutTemplate, Users, CreditCard, Share2 } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: 'Pilih Template',
    description: 'Temukan desain elegan yang paling mewakili kisah cintamu.',
    icon: LayoutTemplate,
  },
  {
    step: 2,
    title: 'Masukkan Data',
    description: 'Sesuaikan nama, tanggal, dan detail acara dengan mudah.',
    icon: Users,
  },
  {
    step: 3,
    title: 'Aktivasi',
    description: 'Aktifkan undanganmu secara instan dengan pembayaran aman',
    icon: CreditCard,
  },
  {
    step: 4,
    title: 'Sebar Undangan',
    description:
      'Sebarkan undangan ke keluarga dan sahabat hanya lewat satu link.',
    icon: Share2,
  },
];

export default function StepsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={containerRef} className=' py-20 overflow-hidden'>
      <div className='container mx-auto px-6'>
        {/* Header */}
        <h2 className='text-3xl md:text-6xl font-bold text-center mb-4 text-white leading-tight'>
          Siap dibagikan hanya dengan{' '}
          <span className='relative inline-block text-pink-500'>
            4 langkah mudah
            <svg
              className='absolute left-0 -bottom-1 w-full h-4 text-pink-200'
              viewBox='0 0 100 20'
              preserveAspectRatio='none'
            >
              <path
                d='M 2 15 Q 50 2, 98 12'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                opacity='0.8'
              />
            </svg>
          </span>
        </h2>

        <p className='text-center lg:text-xl text-white/80 mb-16'>
          Cepat, simpel, tinggal klak-klik sambil rebahan di kasur
        </p>

        {/* Steps */}
        <motion.div style={{ y }} className='relative max-w-3xl mx-auto'>
          {steps.map(({ step, title, description, icon: Icon }, index) => {
            const isEven = index % 2 === 1;
            const isLast = index === steps.length - 1;

            return (
              <div key={step} className='relative'>
                {/* Step Card */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className={`relative z-10 flex ${
                    isEven ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-center gap-4 max-w-xs ${
                      isEven ? 'flex-row-reverse text-right' : ''
                    }`}
                  >
                    {/* Icon Circle */}
                    <div className='relative flex-shrink-0'>
                      <div className='w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg backdrop-blur-md bg-black/20 border border-pink-500/30 flex items-center justify-center'>
                        <Icon
                          className='w-7 h-7 md:w-8 md:h-8 text-pink-500'
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Step Number */}
                      <div className='absolute -top-2 -right-2 w-7 h-7 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow'>
                        {step}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className='text-lg md:text-xl font-bold mb-1 text-white'>
                        {title}
                      </h3>
                      <p className='text-sm text-white/80'>
                        {description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Connecting Line */}
                {!isLast && (
                  <svg
                    className='w-full h-24 md:h-28 my-2 text-pink-500/40'
                    viewBox='0 0 400 100'
                    preserveAspectRatio='none'
                  >
                    <path
                      d={
                        isEven
                          ? 'M 320 0 Q 320 50, 200 50 Q 80 50, 80 100'
                          : 'M 80 0 Q 80 50, 200 50 Q 320 50, 320 100'
                      }
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeDasharray='4 10'
                      strokeLinecap='round'
                      fill='none'
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
