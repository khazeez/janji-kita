"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    newOpenItems.has(index) ? newOpenItems.delete(index) : newOpenItems.add(index);
    setOpenItems(newOpenItems);
  };

  const faqData: FAQItem[] = [
    {
      question: "Apa yang membuat platform ini unik?",
      answer: "Kami memadukan AI canggih dengan desain minimalis untuk pengalaman pengguna yang cepat, mudah, dan efisien.",
    },
    {
      question: "Bagaimana proses onboarding-nya?",
      answer: "Hanya butuh beberapa menit. Kami bantu Anda mengatur semuanya secara otomatis dan intuitif.",
    },
    {
      question: "Apakah investasi ini sepadan?",
      answer: "Ya. Banyak klien kami mendapatkan ROI signifikan dalam beberapa bulan berkat efisiensi dan otomatisasi yang kami tawarkan.",
    },
    {
      question: "Seberapa aman data saya?",
      answer: "Keamanan adalah prioritas utama. Kami menggunakan enkripsi tingkat tinggi dan sepenuhnya patuh terhadap standar industri.",
    },
    {
      question: "Bagaimana dengan dukungan teknis?",
      answer: "Tim support kami siap membantu 24/7 melalui chat, email, atau panggilan langsung.",
    },
    {
      question: "Bisakah platform ini diintegrasikan dengan tools lain?",
      answer: "Tentu. Platform kami mendukung integrasi dengan lebih dari 500 aplikasi populer.",
    },
    {
      question: "Bagaimana jika ingin berhenti berlangganan?",
      answer: "Anda bisa membatalkan kapan saja langsung dari dashboard. Tanpa biaya tersembunyi.",
    },
    {
      question: "Apakah tersedia panduan atau pelatihan?",
      answer: "Kami menyediakan dokumentasi lengkap, video tutorial, webinar, dan komunitas aktif untuk membantu Anda.",
    },
  ];

  return (
    <section className="bg-black min-h-screen py-24 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase text-slate-400 mb-4 tracking-widest">
            FAQ
          </p>
          <h2 className="text-4xl font-semibold mb-4">Pertanyaan Umum</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Jawaban atas pertanyaan yang sering diajukan tentang platform kami.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-slate-700 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800 transition-colors"
              >
                <span className="text-lg font-medium">{item.question}</span>
                <span>
                  {openItems.has(index) ? (
                    <Minus className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400" />
                  )}
                </span>
              </button>
              <div
                className={`px-6 pb-5 transition-all duration-300 text-slate-400 text-base leading-relaxed ${
                  openItems.has(index)
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="mt-24 text-center">
          <h3 className="text-2xl font-medium mb-4">Masih punya pertanyaan?</h3>
          <p className="text-slate-400 mb-6">
            Tim kami siap membantu Anda kapan saja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 rounded-full bg-white text-black hover:opacity-90 transition">
              Hubungi Kami
            </button>
            <button className="px-6 py-3 rounded-full border border-slate-600 hover:border-slate-400 text-white transition">
              Jadwalkan Demo
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FAQ;
