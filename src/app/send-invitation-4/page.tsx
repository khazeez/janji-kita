'use client';
import React, { useState } from 'react';
import { Send, Copy, Check, Users, ChevronLeft, Plus, Upload, Download } from 'lucide-react';
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

interface WAHAConfig {
  apiUrl: string;
  sessionName: string;
  apiKey?: string;
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
  
  // State untuk input manual
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualTel, setManualTel] = useState('');
  
  // State untuk dropdown dan metode
  const [selectedMethod, setSelectedMethod] = useState<'picker' | 'manual' | 'csv' | null>(null);

  // ========================================
  // KONFIGURASI WAHA - DIISI OLEH DEVELOPER
  // ========================================
  const WAHA_CONFIG: WAHAConfig = {
    apiUrl: 'http://localhost:3000', // Ganti dengan URL WAHA server Anda
    sessionName: 'default', // Ganti dengan session name Anda
    apiKey: '' // Opsional: Ganti jika pakai API Key
  };
  
  const USE_WAHA = true; // Set false untuk disable WAHA, gunakan WhatsApp Web biasa
  // ========================================

  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });

  const baseUrl = 'https://janjikita.art';

  // ====== Fungsi kirim via WAHA ======
  const sendViaWAHA = async (tel: string, message: string): Promise<boolean> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (WAHA_CONFIG.apiKey) {
        headers['X-Api-Key'] = WAHA_CONFIG.apiKey;
      }

      const response = await fetch(
        `${WAHA_CONFIG.apiUrl}/api/sendText`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            session: WAHA_CONFIG.sessionName,
            chatId: `${tel}@c.us`,
            text: message
          })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error sending via WAHA:', error);
      return false;
    }
  };

  // ====== Kirim Bulk via WAHA ======
  const handleSendBulkWAHA = async () => {
    if (!slug) {
      alert('Isi slug undangan terlebih dahulu');
      return;
    }

    if (contacts.length === 0) {
      alert('Tidak ada kontak untuk dikirim');
      return;
    }

    // Validasi kontak
    const invalidContacts = contacts.filter(c => !c.name.trim());
    if (invalidContacts.length > 0) {
      alert(`Ada ${invalidContacts.length} kontak yang belum memiliki nama. Mohon lengkapi nama semua kontak.`);
      return;
    }

    const confirmSend = confirm(
      `Kirim undangan ke ${contacts.length} kontak via WAHA?\n\nPesan akan dikirim otomatis dengan delay 2 detik per kontak.`
    );
    if (!confirmSend) return;

    setIsSendingBulk(true);
    setSendProgress({ current: 0, total: contacts.length });

    const successContacts: { name: string; tel: string }[] = [];
    const failedContacts: { name: string; tel: string }[] = [];

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const link = `${baseUrl}/${slug}?to=${encodeURIComponent(contact.name)}`;
      const message = customMessage
        .replace('{nama}', contact.name)
        .replace('{link}', link);

      const success = await sendViaWAHA(contact.tel, message);
      
      setSendProgress({ current: i + 1, total: contacts.length });

      if (success) {
        successContacts.push(contact);
      } else {
        failedContacts.push(contact);
      }

      // Delay 2 detik antar pengiriman untuk menghindari spam
      if (i < contacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Update state
    setSentContacts(prev => [...prev, ...successContacts]);
    setContacts(failedContacts);
    setIsSendingBulk(false);

    // Notifikasi hasil
    if (failedContacts.length === 0) {
      alert(`✅ Berhasil mengirim ke semua ${successContacts.length} kontak!`);
    } else {
      alert(
        `✅ Berhasil: ${successContacts.length} kontak\n❌ Gagal: ${failedContacts.length} kontak\n\nKontak yang gagal masih ada di daftar "Belum Dikirim".`
      );
    }
  };

  // ====== Download Template CSV ======
  const handleDownloadTemplate = () => {
    const csvContent = 'nama,nomor\nBudi Santoso,628123456789\nSiti Aminah,628987654321\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_kontak.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ====== Upload CSV ======
  const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header
      const dataLines = lines.slice(1);
      
      const parsed = dataLines.map(line => {
        const [name, tel] = line.split(',').map(s => s.trim());
        let cleanTel = tel.replace(/\D/g, '');
        
        // Validasi: ubah prefix 0 menjadi 62
        if (cleanTel.startsWith('0')) {
          cleanTel = '62' + cleanTel.substring(1);
        }
        
        return { name, tel: cleanTel };
      }).filter(c => c.name && c.tel);

      setContacts((prev) => {
        const combined = [...prev, ...parsed];
        // Hilangkan duplikasi berdasarkan nomor telepon
        const unique = combined.filter(
          (contact, index, self) =>
            index === self.findIndex((c) => c.tel === contact.tel)
        );
        return unique;
      });
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  // ====== Input Manual ======
  const handleAddManual = () => {
    if (!manualName.trim() || !manualTel.trim()) {
      alert('Nama dan nomor harus diisi');
      return;
    }

    let cleanTel = manualTel.replace(/\D/g, '');
    
    // Validasi: ubah prefix 0 menjadi 62
    if (cleanTel.startsWith('0')) {
      cleanTel = '62' + cleanTel.substring(1);
    }

    // Check duplikasi
    if (contacts.some(c => c.tel === cleanTel)) {
      alert('Nomor sudah ada dalam daftar');
      return;
    }

    setContacts((prev) => [...prev, { name: manualName, tel: cleanTel }]);
    setManualName('');
    setManualTel('');
    setShowManualInput(false);
  };

  // ====== Pilih kontak (Chrome Android) ======
  const handlePickContacts = async () => {
    if (!navigator.contacts?.select) {
      alert(
        'Fitur pilih kontak tidak didukung di browser ini. Gunakan input manual atau upload CSV.'
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
          let tel = c.tel[0].replace(/\D/g, '');
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

    // Jika menggunakan WAHA
    if (USE_WAHA) {
      sendViaWAHA(tel, message).then(success => {
        if (success) {
          const sent = contacts[index];
          setSentContacts((prev) => [...prev, sent]);
          setContacts((prev) => prev.filter((_, i) => i !== index));
          alert('✅ Pesan berhasil dikirim via WAHA');
        } else {
          alert('❌ Gagal mengirim pesan via WAHA. Cek koneksi atau konfigurasi WAHA.');
        }
      });
    } else {
      // Kirim via WhatsApp Web (default)
      const waMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${tel}?text=${waMessage}`;
      window.open(waUrl, '_blank');

      const sent = contacts[index];
      setSentContacts((prev) => [...prev, sent]);
      setContacts((prev) => prev.filter((_, i) => i !== index));
    }
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
              className='flex items-center gap-1 text-gray-400 hover:text-white mb-4'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>
            <h2 className='lg:text-2xl text-xl pb-6 text-center font-bold bg-gradient-to-r from-pink-200 via-pink-500 to-pink-400 bg-clip-text text-transparent'>
              Kirim Undangan
            </h2>

            {/* Status Mode Pengiriman */}
            {/* {USE_WAHA && (
              <div className='mb-4 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700 rounded-lg p-3'>
                <div className='flex items-start gap-2'>
                  <div className='w-2 h-2 bg-green-400 rounded-full mt-1.5 animate-pulse'></div>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold text-green-300'>Mode WAHA Aktif</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      Pesan akan dikirim otomatis via API tanpa membuka WhatsApp Web
                    </p>
                  </div>
                </div>
              </div>
            )} */}

            {/* Dropdown Pilih Metode */}
            <div className='mb-4'>
              <label className='block text-sm font-semibold text-gray-300 mb-2'>
                Pilih Metode
              </label>
              <select
                value={selectedMethod || ''}
                onChange={(e) => {
                  setSelectedMethod(e.target.value as 'picker' | 'manual' | 'csv' || null);
                  // Reset manual input form ketika ganti metode
                  setShowManualInput(false);
                  setManualName('');
                  setManualTel('');
                }}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:border-pink-400 focus:outline-none'
              >
                <option value=''>-- Pilih metode tambah kontak --</option>
                <option value='picker'>Pilih dari Kontak (Android only)</option>
                <option value='manual'>Input Manual</option>
                <option value='csv'>Upload CSV</option>
              </select>
            </div>

            {/* Tombol Aksi berdasarkan Metode */}
            <AnimatePresence mode='wait'>
              {selectedMethod === 'picker' && (
                <motion.div
                  key='picker'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='mb-4'
                >
                  <button
                    onClick={handlePickContacts}
                    className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-700 to-pink-400 text-white rounded-lg hover:from-pink-600 hover:to-pink-500 transition-all font-semibold'
                  >
                    <Users className='w-5 h-5' />
                    Pilih Kontak
                  </button>
                </motion.div>
              )}

              {selectedMethod === 'manual' && (
                <motion.div
                  key='manual'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='mb-4'
                >
                  {!showManualInput ? (
                    <button
                      onClick={() => setShowManualInput(true)}
                      className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-700 to-pink-400 text-white rounded-lg hover:from-pink-600 hover:to-pink-500 transition-all font-semibold'
                    >
                      <Plus className='w-5 h-5' />
                      Tambah Kontak Manual
                    </button>
                  ) : null}
                </motion.div>
              )}

              {selectedMethod === 'csv' && (
                <motion.div
                  key='csv'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='mb-4 flex gap-2'
                >
                  <button
                    onClick={handleDownloadTemplate}
                    className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-all'
                  >
                    <Download className='w-5 h-5' />
                    <span className='hidden sm:inline'>Download Template</span>
                    <span className='sm:hidden'>Template</span>
                  </button>
                  
                  <label className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-700 to-pink-400 text-white rounded-lg hover:from-pink-600 hover:to-pink-500 transition-all font-semibold cursor-pointer'>
                    <Upload className='w-5 h-5' />
                    <span className='hidden sm:inline'>Upload CSV</span>
                    <span className='sm:hidden'>Upload</span>
                    <input
                      type='file'
                      accept='.csv'
                      onChange={handleUploadCSV}
                      className='hidden'
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Input Manual */}
            <AnimatePresence>
              {showManualInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mb-4 bg-gray-800 border border-gray-700 rounded-lg p-4'
                >
                  <h3 className='text-sm font-semibold text-gray-300 mb-3'>Tambah Kontak Manual</h3>
                  <div className='flex flex-col gap-3'>
                    <input
                      type='text'
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder='Nama Tamu'
                      className='w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm focus:border-pink-400 focus:outline-none'
                    />
                    <input
                      type='tel'
                      value={manualTel}
                      onChange={(e) => setManualTel(e.target.value)}
                      placeholder='Nomor Telepon (contoh: 08123456789)'
                      className='w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm focus:border-pink-400 focus:outline-none'
                    />
                    <div className='flex gap-2'>
                      <button
                        onClick={handleAddManual}
                        className='flex-1 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-all'
                      >
                        Tambah
                      </button>
                      <button
                        onClick={() => {
                          setShowManualInput(false);
                          setManualName('');
                          setManualTel('');
                        }}
                        className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all'
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

            {/* Tombol Kirim Bulk (WAHA) */}
            {USE_WAHA && contacts.length > 0 && tab === 'unsent' && (
              <div className='mb-4'>
                <button
                  onClick={handleSendBulkWAHA}
                  disabled={isSendingBulk}
                  className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all font-semibold disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed'
                >
                  {isSendingBulk ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      <span>Mengirim... ({sendProgress.current}/{sendProgress.total})</span>
                    </>
                  ) : (
                    <>
                      <Send className='w-5 h-5' />
                      <span>Kirim Semua ({contacts.length} kontak)</span>
                    </>
                  )}
                </button>
                <p className='text-xs text-gray-400 mt-2 text-center'>
                  Delay otomatis 2 detik per kontak • Klik untuk memulai pengiriman
                </p>
              </div>
            )}

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