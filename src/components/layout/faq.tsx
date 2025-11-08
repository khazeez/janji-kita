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
    newOpenItems.has(index)
      ? newOpenItems.delete(index)
      : newOpenItems.add(index);
    setOpenItems(newOpenItems);
  };

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

  return (
    <section className='bg-black min-h-screen py-24 px-6 text-white'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <p className='text-xl uppercase text-slate-400 mb-4 tracking-widest'>
            FAQ
          </p>
          <h2
            className='lg:text-4xl text-2xl font-semibold mb-4 group 
  bg-gradient-to-r from-pink-700 to-pink-400 
  text-white px-6 py-3 rounded-xl inline-block'
          >
            Pertanyaan Umum
          </h2>

          <p className='text-slate-400 max-w-xl mx-auto'>
            Jawaban atas pertanyaan yang sering diajukan tentang platform kami.
          </p>
        </div>

        {/* FAQ Items */}
        <div className='space-y-4'>
          {faqData.map((item, index) => (
            <div
              key={index}
              className='border border-slate-700 rounded-xl overflow-hidden transition-all'
            >
              <button
                onClick={() => toggleItem(index)}
                className='w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800 transition-colors'
              >
                <span className='text-lg font-medium'>{item.question}</span>
                <span>
                  {openItems.has(index) ? (
                    <Minus className='w-5 h-5 text-pink-400' />
                  ) : (
                    <Plus className='w-5 h-5 text-pink-400' />
                  )}
                </span>
              </button>
              <div
                className={`px-6 pb-5 transition-all duration-300 text-slate-400 text-base leading-relaxed ${
                  openItems.has(index)
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
