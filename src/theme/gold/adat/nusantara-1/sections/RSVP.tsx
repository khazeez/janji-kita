import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Check, X } from 'lucide-react';
import { insertMessages } from '@/models/invitations';

interface Props {
  invitationId: string;
}

export default function RSVP({ invitationId }: Props) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'>('ATTENDING');
  const [pax, setPax] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await insertMessages({
        invitationId,
        guestName: name,
        attendanceStatus: status,
        guestCount: pax,
        message,
      });

      if (result.success) {
        setSuccess(true);
        setName('');
        setMessage('');
        setPax(1);
      } else {
        setError('Gagal mengirim RSVP. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 px-6 bg-gray-900 border-t border-yellow-900/30">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-700/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto bg-gray-950 border border-yellow-800/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-600/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-600/30 rounded-bl-2xl" />

        <div className="text-center mb-10 space-y-2">
          <h2 className="font-serif text-3xl font-bold text-yellow-500">
            RSVP
          </h2>
          <p className="text-gray-400 text-xs tracking-wide">
            Mohon konfirmasi kehadiran Anda
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Terima Kasih!</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Konfirmasi kehadiran Anda telah kami terima. Sampai jumpa di hari bahagia kami.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 text-yellow-600 text-xs font-bold hover:text-yellow-500 transition-colors"
            >
              Kirim RSVP Lain
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-900 border border-yellow-900/40 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/50 transition-all font-serif"
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Konfirmasi Kehadiran</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'ATTENDING', label: 'Hadir' },
                  { value: 'NOT_ATTENDING', label: 'Maaf Tidak' },
                  { value: 'MAYBE', label: 'Ragu-ragu' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value as any)}
                    className={`
                      px-4 py-3 rounded-lg text-xs font-bold transition-all border
                      ${status === option.value 
                        ? 'bg-yellow-600 text-white border-yellow-600 shadow-lg shadow-yellow-900/50' 
                        : 'bg-gray-900 text-gray-400 border-yellow-900/20 hover:border-yellow-700/50'}
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {status === 'ATTENDING' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-2"
              >
                <label className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Jumlah Tamu</label>
                <select
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-yellow-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-600 transition-all font-serif"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} Orang</option>
                  ))}
                </select>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Ucapan & Doa</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-yellow-900/40 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/50 transition-all font-serif resize-none"
                placeholder="Tuliskan ucapan selamat..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-xs">
                <X className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-yellow-900/20 hover:shadow-yellow-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Konfirmasi'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
