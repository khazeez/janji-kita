'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

type PaymentState = 'success' | 'pending' | 'error';

function resolvePaymentState(status?: string): PaymentState {
  if (!status) return 'error';

  if (status === 'settlement' || status === 'capture') {
    return 'success';
  }

  if (status === 'pending') {
    return 'pending';
  }

  return 'error';
}

export default function PaymentStatusPage() {
  const params = useSearchParams();
  const router = useRouter();

  const transactionStatus = params.get('transaction_status') || '';
  const orderId = params.get('order_id') || '-';

  const state = resolvePaymentState(transactionStatus);

  const UI = {
    success: {
      icon: <CheckCircle className='w-20 h-20 text-green-500' />,
      title: 'Pembayaran Berhasil',
      desc: 'Terima kasih, pembayaran Anda telah berhasil diproses.',
      bg: 'bg-green-500/10',
    },
    pending: {
      icon: <Clock className='w-20 h-20 text-yellow-500 animate-pulse' />,
      title: 'Menunggu Pembayaran',
      desc: 'Silakan selesaikan pembayaran Anda sesuai instruksi.',
      bg: 'bg-yellow-500/10',
    },
    error: {
      icon: <XCircle className='w-20 h-20 text-red-500' />,
      title: 'Pembayaran Gagal',
      desc: 'Pembayaran tidak dapat diproses atau telah dibatalkan.',
      bg: 'bg-red-500/10',
    },
  }[state];

  return (
    <div className='min-h-screen bg-gray-950 flex items-center justify-center px-4'>
      <div
        className={`w-full max-w-md rounded-2xl p-8 text-center shadow-xl border border-white/10 ${UI.bg}`}
      >
        <div className='flex justify-center mb-6'>{UI.icon}</div>

        <h1 className='text-white text-xl font-semibold mb-2'>{UI.title}</h1>

        <p className='text-white/70 text-sm mb-6'>{UI.desc}</p>

        <div className='text-left text-xs text-white/60 bg-black/40 rounded-lg p-4 mb-6'>
          <div className='flex justify-between mb-1'>
            <span>Order ID</span>
            <span className='text-white'>{orderId}</span>
          </div>
          <div className='flex justify-between'>
            <span>Status</span>
            <span className='text-white'>{transactionStatus}</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className='
            w-full flex items-center justify-center gap-2
            bg-white text-black
            py-3 rounded-lg font-medium
            hover:bg-gray-200 transition
          '
        >
          <ArrowLeft size={16} />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
