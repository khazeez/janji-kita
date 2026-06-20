'use client';

import { useState } from 'react';

interface Props {
  invitationId: string;
}

export default function RSVP({ invitationId }: Props) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'hadir' | 'tidak hadir' | ''>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !attendance) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/guest-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, name: name.trim(), attendance, message: message.trim() }),
      });
      if (res.ok) {
        setSuccess(true);
        setName('');
        setAttendance('');
        setMessage('');
      }
    } catch {} finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='relative bg-white px-8 py-16' id='rsvp'>
      <div className='max-w-sm mx-auto space-y-6'>
        <div className='text-center space-y-3'>
          <h2 className='text-2xl font-serif text-[#3d2b1f]'>Konfirmasi Kehadiran</h2>
          <div className='w-12 h-0.5 bg-[#c9a96e] mx-auto' />
        </div>

        {success ? (
          <div className='text-center py-8 space-y-3'>
            <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto'>
              <svg className='w-8 h-8 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
            </div>
            <p className='text-[#3d2b1f] font-medium'>Terima kasih! Konfirmasi Anda telah diterima.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              placeholder='Nama Anda'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-4 py-3 rounded-xl bg-[#f5f0e8] border border-[#c9a96e]/30 text-[#3d2b1f] placeholder:text-[#6b5b4e]/50 focus:outline-none focus:border-[#c9a96e] text-sm'
              required
            />
            <div className='flex gap-3'>
              {(['hadir', 'tidak hadir'] as const).map((opt) => (
                <button
                  key={opt}
                  type='button'
                  onClick={() => setAttendance(opt)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    attendance === opt
                      ? 'bg-[#c9a96e] text-white border-[#c9a96e]'
                      : 'bg-[#f5f0e8] text-[#6b5b4e] border-[#c9a96e]/30 hover:border-[#c9a96e]'
                  }`}
                >
                  {opt === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                </button>
              ))}
            </div>
            <textarea
              placeholder='Ucapan & doa (opsional)'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className='w-full px-4 py-3 rounded-xl bg-[#f5f0e8] border border-[#c9a96e]/30 text-[#3d2b1f] placeholder:text-[#6b5b4e]/50 focus:outline-none focus:border-[#c9a96e] text-sm resize-none'
            />
            <button
              type='submit'
              disabled={submitting || !name.trim() || !attendance}
              className='w-full py-3 bg-[#c9a96e] hover:bg-[#b8954d] disabled:opacity-50 text-white rounded-xl font-medium transition-all text-sm'
            >
              {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
