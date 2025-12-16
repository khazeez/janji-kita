'use client';
import React, { useState } from 'react';
import { Send, Copy, Check, Users, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ====== TypeScript types ======
interface Contact {
  name: string[];
  tel: string[];
}

interface NavigatorContacts {
  select(
    properties: string[],
    options?: { multiple: boolean }
  ): Promise<Contact[]>;
}

declare global {
  interface Navigator {
    contacts?: NavigatorContacts;
  }
}

// ====== Component ======
export default function InvitationSender() {
  const [page, setPage] = useState<'setup' | 'send'>('setup');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] =
    useState(`Assalamu'alaikum Warahmatullahi Wabarakatuh

Kepada Yth.
Bapak/Ibu/Saudara/i
*{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

Berikut link undangan kami:
{link}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Atas kehadiran dan doa restunya, kami ucapkan terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`);

  const [contacts, setContacts] = useState<{ name: string; tel: string }[]>([]);
  const [sentContacts, setSentContacts] = useState<
    { name: string; tel: string }[]
  >([]);
  const [tab, setTab] = useState<'unsent' | 'sent'>('unsent');

  const baseUrl = 'https://janjikita.art';

  // ====== Pilih kontak (menambahkan tanpa menghapus yang lama) ======
  const handlePickContacts = async () => {
    if (!navigator.contacts?.select) {
      alert(
        'Fitur pilih kontak tidak didukung di browser ini. Gunakan Chrome Android.'
      );
      return;
    }

    try {
      const selected = await navigator.contacts.select(['name', 'tel'], {
        multiple: true,
      });

      const formatted = selected
        .filter((c) => c.tel?.length)
        .map((c) => {
          let tel = c.tel[0].replace(/\D/g, ''); // hapus karakter non-digit
          // Validasi: ubah prefix 0 menjadi 62
          if (tel.startsWith('0')) {
            tel = '62' + tel.substring(1);
          }
          return { name: c.name[0] || '', tel };
        });

      setContacts((prev) => {
        const combined = [...prev, ...formatted];
        // Hilangkan duplikasi berdasarkan nomor telepon
        const unique = combined.filter(
          (contact, index, self) =>
            index === self.findIndex((c) => c.tel === contact.tel)
        );
        return unique;
      });
    } catch (err) {
      console.error('Contact selection canceled or failed', err);
    }
  };

  // ====== Handle Name Change ======
  const handleNameChange = (index: number, newName: string) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, name: newName } : c))
    );
  };

  // ====== Kirim ke satu kontak ======
  const handleSendWhatsApp = (index: number, name: string, tel: string) => {
    if (!slug) {
      alert('Isi slug undangan terlebih dahulu');
      return;
    }

    if (!name.trim()) {
      alert('Nama tamu harus diisi');
      return;
    }

    const link = `${baseUrl}/${slug}?to=${encodeURIComponent(name)}`;
    const message = customMessage
      .replace('{nama}', name)
      .replace('{link}', link);

    const waMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${tel}?text=${waMessage}`;
    window.open(waUrl, '_blank');

    const sent = contacts[index];
    setSentContacts((prev) => [...prev, sent]);
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  // ====== Copy message ======
  const handleCopy = () => {
    if (!slug) return;

    const previewMessage = customMessage
      .replace('{nama}', 'Budi Santoso')
      .replace('{link}', `${baseUrl}/${slug}`);

    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ====== Preview Pesan ======
  const previewMessage = customMessage
    .replace('{nama}', 'Budi Santoso')
    .replace('{link}', `${baseUrl}/${slug || 'slug-undangan'}`);

  // ====== UI ======
  return (
    <div className='min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100'>
      <div className='max-w-3xl mx-auto'>
        {/* === PAGE 1: SETUP UNDANGAN === */}
        {page === 'setup' && (
          <motion.div
            key='setup'
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className='bg-transparent rounded-2xl shadow-xl p-6 md:p-8'
          >
            <div className='text-center mb-8'>
              <h1
                className='text-xl md:text-4xl font-bold mb-2 
             bg-gradient-to-r from-pink-200 via-pink-500 to-pink-400 
             bg-clip-text text-transparent'
              >
                Setup Undangan
              </h1>

              <p className='text-gray-400 text-sm'>
                Masukkan link dan ubah template pesan Anda
              </p>
            </div>

            {/* Slug */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-300 mb-2'>
                Link Undangan
              </label>
              <input
                type='text'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder='contoh: wedding-aziz-ana'
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:border-pink-400 focus:outline-none'
              />
              <p className='text-xs text-gray-500 mt-1'>
                URL akan menjadi: {baseUrl}/{slug || '...'}
              </p>
            </div>

            {/* Template */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-300 mb-2'>
                Template Pesan
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={10}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg font-mono text-sm focus:border-pink-400 focus:outline-none'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Gunakan <code>{'{nama}'}</code> dan <code>{'{link}'}</code>
              </p>
            </div>

            {/* Preview */}
            <h3 className='text-sm font-semibold text-gray-300 mb-2'>
              Preview:
            </h3>
            <div className='bg-gray-900 rounded-lg border border-gray-700 p-4 mb-6'>
              <pre className='whitespace-pre-wrap text-sm text-gray-300 leading-relaxed'>
                {previewMessage}
              </pre>
            </div>

            {/* Buttons */}
            <div className='flex items-center justify-between'>
              <button
                onClick={handleCopy}
                className='flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm text-gray-200 hover:bg-gray-600'
              >
                {copied ? (
                  <>
                    <Check className='w-4 h-4 text-green-400' />
                    <span className='text-green-400'>Pesan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className='w-4 h-4' />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setPage('send')}
                disabled={!slug}
                className='bg-gradient-to-r from-pink-700 to-pink-400 text-white text-sm py-2 px-6 rounded-lg disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed transition-all'
              >
                Lanjut
              </button>
            </div>
          </motion.div>
        )}

        {/* === PAGE 2: KIRIM UNDANGAN === */}
        {page === 'send' && (
          <motion.div
            key='send'
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className=' rounded-2xl shadow-xl p-6 md:p-8'
          >
            {/* Header */}
            <button
              onClick={() => setPage('setup')}
              className='flex items-center gap-1 text-gray-400 hover:text-white'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>
            <h2 className='lg:text-2xl text-xl pb-6 text-center font-bold bg-gradient-to-r from-pink-200 via-pink-500 to-pink-400 bg-clip-text text-transparent'>
              Kirim Undangan
            </h2>

            {/* Tombol pilih kontak */}
            <div className='mb-4'>
              <button
                onClick={handlePickContacts}
                className='flex items-center gap-2 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-all'
              >
                <Users className='w-5 h-5' />
                Pilih Kontak
              </button>
            </div>

            {/* Tabs */}
            <div className='flex justify-between items-center mb-3 border-b border-gray-700'>
              <div className='flex'>
                <button
                  className={`px-4 py-2 text-sm font-semibold ${
                    tab === 'unsent'
                      ? 'border-b-2 border-pink-500 text-pink-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setTab('unsent')}
                >
                  Belum Dikirim ({contacts.length})
                </button>
                <button
                  className={`px-4 py-2 text-sm font-semibold ${
                    tab === 'sent'
                      ? 'border-b-2 border-green-500 text-green-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setTab('sent')}
                >
                  Sudah Dikirim ({sentContacts.length})
                </button>
              </div>
            </div>

            {/* Daftar kontak */}
            <AnimatePresence mode='wait'>
              {tab === 'unsent' && (
                <motion.div
                  key='unsent'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {contacts.length === 0 ? (
                    <p className='text-gray-400 text-sm italic text-center py-6'>
                      Belum ada kontak yang dipilih
                    </p>
                  ) : (
                    contacts.map((c, i) => (
                      <div
                        key={c.tel}
                        className='flex items-center justify-between py-2 border-b border-gray-800'
                      >
                        <div>
                          {/* Input Nama Tamu */}
                          <input
                            type='text'
                            value={c.name}
                            onChange={(e) => handleNameChange(i, e.target.value)}
                            placeholder='Masukkan nama tamu...'
                            className='w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:border-pink-400 focus:outline-none mb-1'
                          />
                          <p className='text-gray-400 text-xs'>{c.tel}</p>
                        </div>
                        <button
                          onClick={() => handleSendWhatsApp(i, c.name, c.tel)}
                          disabled={!c.name.trim()}
                          className='flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <Send className='w-4 h-4' />
                          Kirim
                        </button>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {tab === 'sent' && (
                <motion.div
                  key='sent'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {sentContacts.length === 0 ? (
                    <p className='text-gray-400 text-sm italic text-center py-6'>
                      Belum ada yang dikirim
                    </p>
                  ) : (
                    sentContacts.map((c) => (
                      <div
                        key={c.tel}
                        className='flex items-center justify-between py-2 border-b border-gray-800'
                      >
                        <div>
                          <p className='font-medium text-green-400'>{c.name}</p>
                          <p className='text-gray-400 text-xs'>{c.tel}</p>
                        </div>
                        <span className='text-green-400 text-xs font-semibold'>
                          ✅ Terkirim
                        </span>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className='text-center mt-6 text-sm text-gray-400'>
          <p>Made with ❤️ for your special day</p>
        </div>
      </div>
    </div>
  );
}