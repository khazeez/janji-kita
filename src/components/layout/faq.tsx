'use client';
import React, { useState } from 'react';
import { MessageCircle, User } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const faqData: FAQItem[] = [
    {
      question: 'Apa yang membuat website undangan digital ini unik?',
      answer:
        'Kami menggabungkan desain elegan dengan teknologi modern untuk menciptakan undangan digital yang interaktif, mudah dibagikan, dan berkesan.',
    },
    {
      question: 'Bagaimana proses pembuatan undangannya?',
      answer:
        'Sangat mudah! Anda hanya perlu memilih template, mengisi data acara, dan undangan siap dibagikan dalam hitungan menit.',
    },
    {
      question: 'Apakah layanan ini sepadan dengan harganya?',
      answer:
        'Tentu. Banyak pengguna kami menghemat waktu dan biaya cetak, sekaligus mendapatkan hasil yang lebih modern dan menarik.',
    },
    {
      question: 'Seberapa aman data tamu dan informasi acara saya?',
      answer:
        'Keamanan adalah prioritas kami. Semua data terenkripsi dan hanya dapat diakses oleh Anda dan penerima undangan yang dituju.',
    },
    {
      question: 'Apakah ada dukungan jika saya mengalami kendala?',
      answer:
        'Ya! Tim support kami siap membantu Anda 24/7 melalui chat, email, atau WhatsApp.',
    },
    {
      question:
        'Bisakah undangan digital ini diintegrasikan dengan fitur lain?',
      answer:
        'Bisa. Undangan kami dapat dilengkapi dengan galeri foto, RSVP online, peta lokasi, hingga playlist musik.',
    },
    {
      question: 'Bagaimana jika saya ingin berhenti atau menghapus undangan?',
      answer:
        'Anda dapat menghapus atau menonaktifkan undangan kapan saja langsung dari dashboard pengguna.',
    },
    {
      question: 'Apakah ada panduan untuk membuat undangan?',
      answer:
        'Kami menyediakan panduan lengkap, video tutorial, dan template yang mudah digunakan untuk membantu Anda membuat undangan sempurna.',
    },
  ];

  const [showAll, setShowAll] = useState(false);

  const displayedFAQs = showAll ? faqData : [faqData[0]];

  return (
    <section className='bg-black min-h-screen py-24 px-6 text-white'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <p className='text-xl uppercase text-slate-400 tracking-widest'>
            FAQ
          </p>
          <h2 className='lg:text-4xl text-2xl font-semibold mb-4 text-white rounded-xl inline-block'>
            Pertanyaan Umum
          </h2>
          <p className='text-slate-400 max-w-xl mx-auto'>
            Jawaban atas pertanyaan yang sering diajukan tentang platform kami.
          </p>
        </div>

        {/* FAQ Items - Chat Style */}
        <div className='space-y-8 relative'>
          {displayedFAQs.map((item, index) => (
            <div key={index} className='space-y-4'>
              {/* Question - Right Side (User) */}
              <div className='flex justify-end items-start gap-3'>
                <div className='max-w-[75%] bg-gradient-to-r from-pink-700 to-pink-500 rounded-2xl rounded-tr-sm px-6 py-4 shadow-lg'>
                  <p className='text-base font-medium'>{item.question}</p>
                </div>
                {/* User Avatar */}
                <div className='w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0'>
                  <User className='w-5 h-5 text-white' />
                </div>
              </div>

              {/* Answer - Left Side (Bot) */}
              <div className='flex justify-start items-start gap-3'>
                {/* Bot Avatar */}
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0'>
                  <MessageCircle className='w-5 h-5 text-white' />
                </div>
                <div className='max-w-[75%] bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg'>
                  <p className='text-slate-300 text-base leading-relaxed'>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Blurred Preview */}
          {!showAll && (
            <div className='relative'>
              {/* Blur overlay */}
              <div className='pointer-events-none'>
                {faqData.slice(1, 3).map((item, index) => (
                  <div
                    key={index}
                    className='space-y-4 mb-8 blur-sm opacity-40'
                  >
                    {/* Question */}
                    <div className='flex justify-end items-start gap-3'>
                      <div className='max-w-[75%] bg-gradient-to-r from-pink-700 to-pink-500 rounded-2xl rounded-tr-sm px-6 py-4 shadow-lg'>
                        <p className='text-base font-medium'>{item.question}</p>
                      </div>
                      <div className='w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0'>
                        <User className='w-5 h-5 text-white' />
                      </div>
                    </div>

                    {/* Answer */}
                    <div className='flex justify-start items-start gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0'>
                        <MessageCircle className='w-5 h-5 text-white' />
                      </div>
                      <div className='max-w-[75%] bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg'>
                        <p className='text-slate-300 text-base leading-relaxed'>
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gradient overlay at bottom */}
              <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none'></div>
            </div>
          )}
        </div>

        {/* Show All Button */}
        {!showAll && (
          <div className='flex justify-center mt-12'>
            <button
              onClick={() => setShowAll(true)}
              className='px-8 py-4 bg-gradient-to-r from-pink-700 to-pink-500 hover:from-pink-600 hover:to-pink-400 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-pink-500/50 transform hover:scale-105'
            >
              Lihat Semua Pertanyaan ({faqData.length})
            </button>
          </div>
        )}

        {/* Show Less Button */}
        {showAll && (
          <div className='flex justify-center mt-12'>
            <button
              onClick={() => setShowAll(false)}
              className='px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-pink-400 font-semibold transition-all'
            >
              Tampilkan Lebih Sedikit
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;
