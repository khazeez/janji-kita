import { useState } from 'react';
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TransactionType {
  id: string;
  orderId: string;
  productName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  paymentMethod: string;
}

export default function TransactionHistory() {
  const [transactions] = useState<TransactionType[]>([
    {
      id: '1',
      orderId: 'ORD-2024-001',
      productName: 'Wedding Web - Premium Theme',
      amount: 500000,
      status: 'success',
      date: '10 Nov 2024, 14:30',
      paymentMethod: 'BCA Virtual Account',
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      productName: 'Wedding Video - Standard Package',
      amount: 750000,
      status: 'pending',
      date: '09 Nov 2024, 10:15',
      paymentMethod: 'Mandiri Virtual Account',
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      productName: 'Instagram Filter - Custom Design',
      amount: 300000,
      status: 'failed',
      date: '08 Nov 2024, 16:45',
      paymentMethod: 'GoPay',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <div className='flex items-center gap-2 text-green-400'>
            <CheckCircle size={16} />
            <span className='text-sm font-medium'>Berhasil</span>
          </div>
        );
      case 'pending':
        return (
          <div className='flex items-center gap-2 text-yellow-400'>
            <Clock size={16} />
            <span className='text-sm font-medium'>Pending</span>
          </div>
        );
      case 'failed':
        return (
          <div className='flex items-center gap-2 text-red-400'>
            <XCircle size={16} />
            <span className='text-sm font-medium'>Gagal</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-white'>Riwayat Transaksi</h2>

      {transactions.length === 0 ? (
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center'>
          <Package size={64} className='text-gray-600 mb-4' strokeWidth={1.5} />
          <p className='text-gray-400 text-center'>
            Belum ada riwayat transaksi
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className='bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-pink-500 transition-colors'
            >
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                {/* Left Side - Transaction Info */}
                <div className='flex-1'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h3 className='text-white font-bold text-lg mb-1'>
                        {transaction.productName}
                      </h3>
                      <p className='text-gray-400 text-sm'>
                        Order ID: {transaction.orderId}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mt-3'>
                    <span className='text-gray-400'>{transaction.date}</span>
                    <span className='hidden sm:block text-gray-600'>•</span>
                    <span className='text-gray-400'>
                      {transaction.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Right Side - Amount & Status */}
                <div className='flex flex-row md:flex-col items-start md:items-end gap-3 md:gap-2'>
                  <div className='flex-1 md:flex-none'>
                    <p className='text-2xl font-bold text-white'>
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div>{getStatusBadge(transaction.status)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
