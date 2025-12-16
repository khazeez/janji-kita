'use client'
import React, { useState } from 'react';
import { Send, Copy, Check } from 'lucide-react';

export default function InvitationSender() {
  const [slug, setSlug] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState(`Assalamu'alaikum Warahmatullahi Wabarakatuh

Kepada Yth.
Bapak/Ibu/Saudara/i
*{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

Berikut link undangan kami:
{link}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Atas kehadiran dan doa restunya, kami ucapan terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`);

  const baseUrl = 'https://janjikita.art';
  const invitationLink =
    slug && guestName ? `${baseUrl}/${slug}?to=${encodeURIComponent(guestName)}` : '';

  const invitationMessage = customMessage
    .replace('{nama}', guestName || '{nama}')
    .replace('{link}', invitationLink || '{link}');

  const handleCopy = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendWhatsApp = () => {
    if (!guestName || !invitationMessage) {
      alert('Mohon isi nama tamu terlebih dahulu');
      return;
    }

    const waMessage = encodeURIComponent(invitationMessage);
    let waUrl = `https://wa.me/`;

    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      waUrl += `${cleanNumber}?text=${waMessage}`;
    } else {
      waUrl = `https://api.whatsapp.com/send?text=${waMessage}`;
    }

    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Kirim Undangan
            </h1>
            <p className="text-gray-400">
              Buat dan kirim undangan pernikahan Anda dengan mudah
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 mb-8">
            {/* Slug */}
            <div>
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

            {/* Guest Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nama Tamu
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="contoh: Budi Santoso"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nomor WhatsApp (Opsional)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="contoh: 628123456789"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:border-pink-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Kosongkan jika ingin memilih kontak manual di WhatsApp
              </p>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Template Pesan Undangan
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg font-mono text-sm focus:border-pink-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Gunakan <span className="font-mono bg-gray-800 px-1 rounded">{'{nama}'}</span> dan{' '}
                <span className="font-mono bg-gray-800 px-1 rounded">{'{link}'}</span>
              </p>
            </div>
          </div>

          {/* Preview */}
          {guestName && slug && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border-2 border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">Preview Pesan</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg text-sm text-gray-200 hover:bg-gray-600"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-3 border border-gray-700">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                  {invitationMessage}
                </pre>
              </div>

              <div className="bg-gray-900 rounded-lg p-3 border-2 border-pink-500/40">
                <p className="text-xs text-gray-500 mb-1 font-medium">Link Undangan:</p>
                <p className="text-sm text-pink-400 font-medium break-all">
                  {invitationLink}
                </p>
              </div>
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSendWhatsApp}
            disabled={!guestName || !slug}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg"
          >
            <Send className="w-6 h-6" />
            Kirim via WhatsApp
          </button>

          {(!guestName || !slug) && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Mohon lengkapi slug dan nama tamu untuk mengirim undangan
            </p>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          <p>Made with ❤️ for your special day</p>
        </div>
      </div>
    </div>
  );
}
