import { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface OrderType {
  id: string;
  orderId: string;
  productName: string;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'expired';
  orderStatus: 'processing' | 'completed' | 'cancelled' | 'waiting_payment';
  orderDate: string;
  paymentMethod: string;
  paymentDeadline?: string;
  virtualAccount?: string;
}

export default function PaymentStatus() {
  const [activeTab, setActiveTab] = useState<'inprogress' | 'history'>(
    'inprogress'
  );
  const [orders] = useState<OrderType[]>([
    {
      id: '1',
      orderId: 'ORD-2024-001',
      productName: 'Wedding Web - Premium Theme',
      amount: 500000,
      paymentStatus: 'paid',
      orderStatus: 'completed',
      orderDate: '10 Nov 2024, 14:30',
      paymentMethod: 'BCA Virtual Account',
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      productName: 'Wedding Video - Standard Package',
      amount: 750000,
      paymentStatus: 'pending',
      orderStatus: 'waiting_payment',
      orderDate: '09 Nov 2024, 10:15',
      paymentMethod: 'Mandiri Virtual Account',
      paymentDeadline: '10 Nov 2024, 10:15',
      virtualAccount: '8877012345678901',
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      productName: 'Instagram Filter - Custom Design',
      amount: 300000,
      paymentStatus: 'paid',
      orderStatus: 'processing',
      orderDate: '08 Nov 2024, 16:45',
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-full'>
            <CheckCircle size={14} className='text-green-400' />
            <span className='text-xs font-medium text-green-400'>Lunas</span>
          </div>
        );
      case 'pending':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-yellow-900/30 border border-yellow-700 rounded-full'>
            <Clock size={14} className='text-yellow-400' />
            <span className='text-xs font-medium text-yellow-400'>
              Menunggu
            </span>
          </div>
        );
      case 'failed':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 border border-red-700 rounded-full'>
            <XCircle size={14} className='text-red-400' />
            <span className='text-xs font-medium text-red-400'>Gagal</span>
          </div>
        );
      case 'expired':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/30 border border-gray-700 rounded-full'>
            <AlertCircle size={14} className='text-gray-400' />
            <span className='text-xs font-medium text-gray-400'>
              Kadaluarsa
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-full'>
            <CheckCircle size={14} className='text-green-400' />
            <span className='text-xs font-medium text-green-400'>Selesai</span>
          </div>
        );
      case 'processing':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/30 border border-blue-700 rounded-full'>
            <Truck size={14} className='text-blue-400' />
            <span className='text-xs font-medium text-blue-400'>Diproses</span>
          </div>
        );
      case 'waiting_payment':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-yellow-900/30 border border-yellow-700 rounded-full'>
            <Clock size={14} className='text-yellow-400' />
            <span className='text-xs font-medium text-yellow-400'>
              Menunggu Pembayaran
            </span>
          </div>
        );
      case 'cancelled':
        return (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 border border-red-700 rounded-full'>
            <XCircle size={14} className='text-red-400' />
            <span className='text-xs font-medium text-red-400'>Dibatalkan</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Filter orders based on active tab
  const inProgressOrders = orders.filter(
    (order) =>
      order.paymentStatus === 'pending' || order.orderStatus === 'processing'
  );

  const historyOrders = orders.filter(
    (order) =>
      order.paymentStatus !== 'pending' && order.orderStatus !== 'processing'
  );

  const currentOrders =
    activeTab === 'inprogress' ? inProgressOrders : historyOrders;

  return (
    <div className='min-h-screen bg-transparent md:p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Tabs */}
        <h2 className='text-xl md:text-2xl font-bold mb-4 -mt-7 md:mb-6 text-white text-center'>
          Status Pembayaran
        </h2>
        <div className='flex gap-2 mb-6 border-b border-gray-100 top-0 bg-gray-900 z-10'>
          <button
            onClick={() => setActiveTab('inprogress')}
            className={`px-4 py-3 text-sm md:text-base font-medium transition-colors relative ${
              activeTab === 'inprogress'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Transaksi inprogress
            {inProgressOrders.length > 0 && (
              <span className='ml-2 px-2 py-0.5 bg-pink-600 text-white text-xs rounded-full'>
                {inProgressOrders.length}
              </span>
            )}
            {activeTab === 'inprogress' && (
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500'></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-10 py-3 text-sm md:text-base font-medium transition-colors relative pl-10 ${
              activeTab === 'history'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Riwayat Transaksi
            {activeTab === 'history' && (
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500'></div>
            )}
          </button>
        </div>

        {currentOrders.length === 0 ? (
          <div className='bg-gray-800 border border-gray-700 rounded-lg p-8 md:p-12 flex flex-col items-center justify-center'>
            <Package
              size={48}
              className='text-gray-600 mb-3 md:mb-4 md:w-16 md:h-16'
              strokeWidth={1.5}
            />
            <p className='text-gray-400 text-center text-sm md:text-base'>
              {activeTab === 'inprogress'
                ? 'Belum ada pembayaran yang sedang berlangsung'
                : 'Belum ada riwayat transaksi'}
            </p>
          </div>
        ) : (
          <div className='space-y-3 md:space-y-4'>
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className='bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 hover:border-pink-500 transition-colors'
              >
                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4'>
                  <div className='flex-1'>
                    <h3 className='text-white font-bold text-base md:text-lg mb-1'>
                      {order.productName}
                    </h3>
                    <p className='text-gray-400 text-xs md:text-sm'>
                      Order ID: {order.orderId}
                    </p>
                    <p className='text-gray-500 text-xs mt-1'>
                      {order.orderDate}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg md:text-xl font-bold text-white mb-2'>
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {getPaymentStatusBadge(order.paymentStatus)}
                  {getOrderStatusBadge(order.orderStatus)}
                </div>

                {/* Payment Info */}
                <div className='border-t border-gray-700 pt-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                    <div>
                      <p className='text-gray-400 text-xs mb-1'>
                        Metode Pembayaran
                      </p>
                      <p className='text-white'>{order.paymentMethod}</p>
                    </div>
                    {order.virtualAccount && (
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>
                          Virtual Account
                        </p>
                        <p className='text-white font-mono'>
                          {order.virtualAccount}
                        </p>
                      </div>
                    )}
                    {order.paymentDeadline &&
                      order.paymentStatus === 'pending' && (
                        <div className='sm:col-span-2'>
                          <p className='text-gray-400 text-xs mb-1'>
                            Batas Waktu Pembayaran
                          </p>
                          <p className='text-yellow-400 font-medium'>
                            {order.paymentDeadline}
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Action Button */}
                  {order.paymentStatus === 'pending' && (
                    <button className='mt-4 w-full sm:w-auto px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors'>
                      Bayar Sekarang
                    </button>
                  )}
                  {order.orderStatus === 'completed' && (
                    <button className='mt-4 w-full sm:w-auto px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors'>
                      Lihat Detail
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
