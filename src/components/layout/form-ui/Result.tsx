import { CheckCircle, CreditCard, Home } from 'lucide-react';
import Link from 'next/link';

export default function ResultScreenSuccsess() {
  const userId = 'skdksjksdkscnsnckskkcsncnc';
  const invitationId = 'jsdjsjdsdsjdshjd';

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4'>
      <div className='bg-gray-800 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-700 animate-in fade-in zoom-in duration-300'>
        {/* Success Icon */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center'>
            <CheckCircle size={48} className='text-white' />
          </div>
        </div>

        {/* Title */}
        <h2 className='text-2xl font-bold text-white text-center mb-3'>
          Data anda berhasil terkirim
        </h2>

        {/* Description */}
        <p className='text-gray-400 text-center mb-8'>
          Lakukan aktivasi dengan melakukan pembayaran terlebih dahulu. Tenang,
          data masih bisa diubah setelah aktivasi
        </p>

        {/* Buttons */}
        <div className='space-y-3'>
          {/* Button Lanjutkan Pembayaran */}
          <Link
            href={`/payment`}
            className='w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            <CreditCard size={20} />
            Lanjutkan Pembayaran
          </Link>

          {/* Button Kembali ke Dashboard */}
          <Link
            href={`/dashboard/invitation/${userId}/preview/${invitationId}`}
            className='w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200'
          >
            <Home size={20} />
            Lihat undangan saya
          </Link>
        </div>

        {/* Info Text */}
        <p className='text-xs text-gray-500 text-center mt-6'>
          Anda dapat melakukan pembayaran nanti dari halaman dashboard
        </p>
      </div>
    </div>
  );
}
