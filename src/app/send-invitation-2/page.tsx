'use client';
import React, { useState } from 'react';
import { Send, Copy, Check, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Definisi tipe tambahan untuk TypeScript
interface Contact {
  name: string[];
  tel: string[];
}

interface NavigatorContacts {
  select(properties: string[], options?: { multiple: boolean }): Promise<Contact[]>;
}

declare global {
  interface Navigator {
    contacts?: NavigatorContacts;
  }
}

export default function InvitationSender() {
  const [slug, setSlug] = useState('');
  const [contacts, setContacts] = useState<{ name: string; tel: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState(`Assalamu'alaikum Warahmatullahi Wabarakatuh

Kepada Yth.
Bapak/Ibu/Saudara/i
*{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

Berikut link undangan kami:
{link}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Atas kehadiran dan doa restunya, kami ucapkan terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`);

  const baseUrl = 'https://janjikita.art';

  // ✅ Pilih banyak kontak
  const handlePickContacts = async () => {
    if (!navigator.contacts?.select) {
      alert('Fitur pilih kontak tidak didukung di browser ini. Gunakan Chrome Android.');
      return;
    }

    try {
      const selected = await navigator.contacts.select(['name', 'tel'], { multiple: true });
      const formatted = selected
        .filter((c) => c.tel?.length)
        .map((c) => ({ name: c.name[0], tel: c.tel[0].replace(/\D/g, '') }));
      setContacts(formatted);
    } catch (err) {
      console.error('Contact selection canceled or failed', err);
    }
  };

  // ✅ Kirim WhatsApp ke satu kontak dan hapus dari daftar
  const handleSendWhatsApp = (index: number, name: string, tel: string) => {
    if (!slug) {
      alert('Isi slug undangan terlebih dahulu');
      return;
    }

    const link = `${baseUrl}/${slug}?to=${encodeURIComponent(name)}`;
    const message = customMessage
      .replace('{nama}', name)
      .replace('{link}', link);

    const waMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${tel}?text=${waMessage}`;
    window.open(waUrl, '_blank');

    // Hapus kontak dari daftar setelah dikirim
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopy = () => {
    if (!slug) return;
    const link = `${baseUrl}/${slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Kirim Undangan
            </h1>
            <p className="text-gray-400">
              Pilih kontak lalu kirim undangan satu per satu
            </p>
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Slug Undangan
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="contoh: wedding-john-jane"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:border-pink-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL akan menjadi: {baseUrl}/{slug || '...'}
            </p>
          </div>

          {/* Pick Contacts */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Pilih Kontak
            </label>
            <button
              onClick={handlePickContacts}
              className="flex items-center gap-2 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              <Users className="w-5 h-5" />
              Pilih dari Kontak HP
            </button>

            <AnimatePresence>
              {contacts.length > 0 && (
                <motion.div
                  className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-3 max-h-64 overflow-y-auto text-sm divide-y divide-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {contacts.map((c, i) => (
                    <motion.div
                      key={c.tel}
                      className="flex items-center justify-between py-2"
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                    >
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.tel}</p>
                      </div>
                      <button
                        onClick={() => handleSendWhatsApp(i, c.name, c.tel)}
                        className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <Send className="w-4 h-4" />
                        Kirim
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {contacts.length === 0 && (
              <p className="text-xs text-gray-500 mt-2 italic">Belum ada kontak dipilih</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Browser yang didukung: Chrome / Edge Android
            </p>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Template Pesan
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg font-mono text-sm focus:border-pink-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Gunakan <code>{'{nama}'}</code> dan <code>{'{link}'}</code> untuk mengganti otomatis
            </p>
          </div>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg mb-6 text-sm text-gray-200 hover:bg-gray-600"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Link Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Link Dasar</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          <p>Made with ❤️ for your special day</p>
        </div>
      </div>
    </div>
  );
}
