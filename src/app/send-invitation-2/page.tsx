'use client';
import React, { useState } from 'react';
import { Send, Copy, Check, Users } from 'lucide-react';

// ✅ Tambahkan interface untuk kontak
interface Contact {
  name: string[];
  tel: string[];
}

// ✅ Tambahkan interface untuk navigator.contacts
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

  const handlePickContacts = async () => {
    // ✅ aman untuk browser lain
    if (!navigator.contacts?.select) {
      alert('Fitur pilih kontak tidak didukung di browser ini. Gunakan Chrome Android.');
      return;
    }

    try {
      const selected = await navigator.contacts.select(['name', 'tel'], { multiple: true });
      const formatted = selected
        .filter((c) => c.tel?.length)
        .map((c) => ({
          name: c.name[0],
          tel: c.tel[0].replace(/\D/g, ''),
        }));
      setContacts(formatted);
    } catch (err) {
      console.error('Contact selection canceled or failed', err);
    }
  };

  const handleSendAll = () => {
    if (!slug) {
      alert('Isi slug undangan terlebih dahulu');
      return;
    }
    if (!contacts.length) {
      alert('Pilih minimal satu kontak');
      return;
    }

    contacts.forEach((c, i) => {
      const link = `${baseUrl}/${slug}?to=${encodeURIComponent(c.name)}`;
      const message = customMessage
        .replace('{nama}', c.name)
        .replace('{link}', link);
      const waMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${c.tel}?text=${waMessage}`;
      setTimeout(() => window.open(waUrl, '_blank'), i * 800);
    });
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
              Kirim Undangan Massal
            </h1>
            <p className="text-gray-400">
              Pilih banyak kontak dan kirim undangan otomatis via WhatsApp
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

            {contacts.length > 0 && (
              <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto text-sm">
                {contacts.map((c, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-gray-800">
                    <span>{c.name}</span>
                    <span className="text-gray-400">{c.tel}</span>
                  </div>
                ))}
              </div>
            )}
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

          {/* Send Button */}
          <button
            onClick={handleSendAll}
            disabled={!slug || !contacts.length}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg"
          >
            <Send className="w-6 h-6" />
            Kirim ke {contacts.length || 0} Kontak
          </button>
        </div>
      </div>
    </div>
  );
}
