'use client';
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData: FAQItem[] = [
    {
      question: 'Apa yang membuat platform ini berbeda?',
      answer:
        'Kami mengombinasikan teknologi AI terdepan dengan desain yang intuitive untuk menciptakan pengalaman yang seamless. Platform kami dirancang dengan fokus pada simplicity tanpa mengorbankan powerful functionality, memberikan value yang unprecedented untuk setiap user.',
    },
    {
      question: 'Bagaimana proses onboarding berlangsung?',
      answer:
        'Onboarding kami dirancang untuk memberikan experience yang delightful. Dalam 5 menit pertama, Anda akan guided through personalized setup, intelligent recommendations, dan instant access ke semua core features. Our smart assistant akan membantu Anda setiap step of the way.',
    },
    {
      question: 'Apakah investasi ini worth it untuk bisnis saya?',
      answer:
        'Absolutely. Clients kami rata-rata mengalami 300% ROI dalam 6 bulan pertama. Kami offer comprehensive analytics, automation tools, dan strategic insights yang transform how you operate. Plus, dengan our flexible pricing, Anda hanya pay for what you actually use.',
    },
    {
      question: 'Seberapa secure data saya di platform ini?',
      answer:
        'Security adalah DNA kami. Kami menggunakan military-grade encryption, zero-trust architecture, dan comply dengan GDPR, SOC 2, dan ISO 27001. Your data adalah 100% yours - kami never access, share, atau monetize informasi Anda tanpa explicit permission.',
    },
    {
      question: 'Bagaimana dengan technical support?',
      answer:
        'Kami pride ourselves on white-glove support. Tim expert kami available 24/7 via multiple channels - live chat, video calls, atau dedicated account manager untuk enterprise clients. Average response time kami adalah under 2 minutes dengan 99.9% satisfaction rate.',
    },
    {
      question: 'Bisakah integrate dengan existing tools kami?',
      answer:
        'Tentu saja. Kami built dengan integration-first mindset. Connect seamlessly dengan 500+ applications including Salesforce, HubSpot, Slack, Microsoft 365, dan virtually semua major business tools. Our API adalah developer-friendly dengan comprehensive documentation.',
    },
    {
      question: 'Bagaimana jika kami perlu cancel subscription?',
      answer:
        "No hard feelings, no hidden fees. Cancel anytime dengan single click di dashboard Anda. Kami'll even help you export all your data dalam format apapun yang Anda butuhkan. Many clients yang cancel eventually return karena they realize the value kami provide.",
    },
    {
      question: 'Apakah ada training atau learning resources?',
      answer:
        'Absolutely! Kami provide extensive learning ecosystem: interactive tutorials, video masterclasses, live webinars, dan dedicated customer success manager. Plus access ke exclusive community dimana you can network dengan other successful users dan share best practices.',
    },
  ];

  return (
    <div className='min-h-screen shadow-md backdrop-blur-md bg-transparent'>
      {/* Ambient background effects */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 py-24 px-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-20'>
            <div className='inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 mb-8'>
              <span className='text-sm text-slate-400 tracking-wide'>
                FREQUENTLY ASKED
              </span>
            </div>
            <h1 className='text-6xl lg:text-7xl font-extralight text-white mb-6 tracking-tight'>
              Questions
            </h1>
            <p className='text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed'>
              Everything you need to know about our platform, answered with
              clarity and transparency.
            </p>
          </div>

          {/* FAQ Items */}
          <div className='space-y-2'>
            {faqData.map((item, index) => (
              <div
                key={index}
                className='group relative bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-slate-700/50 transition-all duration-500 overflow-hidden'
              >
                {/* Gradient hover */}
                <div className='absolute inset-0 bg-gradient-to-r from-slate-800/0 via-slate-800/5 to-slate-800/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                <button
                  onClick={() => toggleItem(index)}
                  className='relative w-full px-8 py-8 text-left focus:outline-none focus:ring-2 focus:ring-slate-600/50 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300'
                >
                  <div className='flex items-start justify-between'>
                    <h3 className='text-xl font-light text-white pr-8 leading-relaxed group-hover:text-slate-100 transition-colors duration-300'>
                      {item.question}
                    </h3>
                    <div className='flex-shrink-0 mt-1'>
                      <div className='w-8 h-8 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50 group-hover:bg-slate-700/50 group-hover:border-slate-600/50 transition-all duration-300'>
                        {openItems.has(index) ? (
                          <Minus className='w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors duration-300' />
                        ) : (
                          <Plus className='w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors duration-300' />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    openItems.has(index)
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className='px-8 pb-8'>
                    <div className='w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-6'></div>
                    <p className='text-slate-300 leading-relaxed font-light text-lg'>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className='mt-24'>
            <div className='relative bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-800/50 overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5'></div>
              <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-slate-700/50 to-transparent'></div>

              <div className='relative z-10 text-center'>
                <h2 className='text-4xl font-extralight text-white mb-4'>
                  Still have questions?
                </h2>
                <p className='text-slate-400 mb-10 max-w-md mx-auto font-light text-lg'>
                  Our team of experts is here to help you succeed. Get
                  personalized support whenever you need it.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <button className='group relative px-8 py-4 bg-white text-slate-900 rounded-full font-medium overflow-hidden transition-all duration-300 hover:scale-105'>
                    <div className='absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <span className='relative'>Start Conversation</span>
                  </button>
                  <button className='group px-8 py-4 border border-slate-600/50 text-slate-300 rounded-full font-medium hover:border-slate-500/50 hover:text-white transition-all duration-300 hover:scale-105'>
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
