'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useData';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Search,
  Receipt,
  Package,
  ArrowUpDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface TransactionData {
  TRANSACTION_ID: string;
  USER_ID: string;
  INVITATION_ID: string;
  PRODUCT_ID: string;
  PROMO_ID: string | null;
  ORIGINAL_AMOUNT: number;
  DISCOUNT_AMOUNT: number;
  FINAL_AMOUNT: number;
  PAYMENT_STATUS: string;
  PAYMENT_METHOD: string | null;
  GATEWAY_ORDER_ID: string;
  GATEWAY_TRANSACTION_ID: string | null;
  PAYMENT_PROOF_URL: string | null;
  PAID_AT: string | null;
  CANCELLED_AT: string | null;
  REFUNDED_AT: string | null;
  EXPIRED_AT: string | null;
  CREATED_AT: string;
  UPDATED_AT: string;
}

type StatusFilter = 'ALL' | 'PAID' | 'PENDING' | 'INITIATED' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';

export default function TransactionPage() {
  const { data: user, isLoading: loadingUser } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  async function checkStatus(transactionId: string) {
    setCheckingId(transactionId);
    try {
      const res = await fetch('/api/midtrans/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal cek status');
      setTransactions(prev =>
        prev.map(t =>
          t.TRANSACTION_ID === transactionId
            ? { ...t, PAYMENT_STATUS: result.currentStatus, PAYMENT_METHOD: result.paymentMethod || t.PAYMENT_METHOD }
            : t
        )
      );
    } catch (error) {
      console.error('Check status error:', error);
    } finally {
      setCheckingId(null);
    }
  }

  async function retryPayment(trx: TransactionData) {
    setRetryingId(trx.TRANSACTION_ID);
    try {
      const res = await fetch('/api/midtrans/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: trx.TRANSACTION_ID }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Gagal memproses pembayaran' }));
        throw new Error(err.message);
      }
      const { snapToken, invitationId } = await res.json();
      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: async () => {
          await fetch('/api/midtrans/success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invitationId }),
          });
          window.location.reload();
        },
        onPending: () => setRetryingId(null),
        onError: () => setRetryingId(null),
        onClose: () => setRetryingId(null),
      });
    } catch (error) {
      console.error('Retry payment error:', error);
      setRetryingId(null);
    }
  }

  async function loadTransactions() {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/transactions');
      const result = await res.json();
      if (res.status === 401) {
        setError('Sesi login tidak ditemukan. Silakan login ulang.');
        return;
      }
      if (!res.ok) {
        throw new Error(result.error || `Gagal memuat (${res.status})`);
      }
      if (result.error) {
        throw new Error(result.error);
      }
      setTransactions(result.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError(error instanceof Error ? error.message : 'Gagal memuat transaksi');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadTransactions();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID':
        return { label: 'Berhasil', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle };
      case 'PENDING':
        return { label: 'Menunggu', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock };
      case 'INITIATED':
        return { label: 'Pending', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', icon: Clock };
      case 'FAILED':
        return { label: 'Gagal', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle };
      case 'EXPIRED':
        return { label: 'Kadaluarsa', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', icon: AlertTriangle };
      case 'CANCELLED':
        return { label: 'Dibatalkan', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20', icon: XCircle };
      case 'REFUNDED':
        return { label: 'Dikembalikan', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', icon: RefreshCw };
      default:
        return { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10 border-gray-500/20', icon: Clock };
    }
  };

  const formatPaymentMethod = (method: string | null) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'Transfer Bank';
      case 'E_WALLET': return 'E-Wallet';
      case 'CREDIT_CARD': return 'Kartu Kredit';
      case 'QRIS': return 'QRIS';
      default: return method || '-';
    }
  };

  const filteredTransactions = transactions
    .filter(trx => {
      const matchesSearch =
        trx.GATEWAY_ORDER_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.TRANSACTION_ID.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || trx.PAYMENT_STATUS === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.CREATED_AT).getTime();
      const dateB = new Date(b.CREATED_AT).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const stats = {
    total: transactions.length,
    paid: transactions.filter(t => t.PAYMENT_STATUS === 'PAID').length,
    pending: transactions.filter(t => t.PAYMENT_STATUS === 'PENDING' || t.PAYMENT_STATUS === 'INITIATED').length,
    totalSpent: transactions
      .filter(t => t.PAYMENT_STATUS === 'PAID')
      .reduce((acc, t) => acc + t.FINAL_AMOUNT, 0),
  };

  if (loadingUser || loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
          <p className="text-gray-400 text-xs">Memuat transaksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-gray-300 font-medium">{error}</p>
          <button
            onClick={loadTransactions}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-24 lg:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">Riwayat Transaksi</h1>
        <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1">Pantau seluruh transaksi pembelian undanganmu.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total Transaksi</p>
            <Receipt className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gray-600" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-green-500/5 border border-green-500/20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-green-500/70 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Berhasil</p>
            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-green-500" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-500">{stats.paid}</p>
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-yellow-500/70 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Pending</p>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-yellow-500" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>

        <div className="bg-pink-500/5 border border-pink-500/20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-pink-500/70 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total Belanja</p>
            <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-pink-500" />
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-pink-500">{formatCurrency(stats.totalSpent)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-700/50 flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-between items-stretch sm:items-center">
          <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-sm lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Cari produk atau order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">Berhasil</option>
              <option value="PENDING">Menunggu</option>
              <option value="INITIATED">Inisialisasi</option>
              <option value="FAILED">Gagal</option>
              <option value="EXPIRED">Kadaluarsa</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="p-2 sm:p-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
              title={sortOrder === 'newest' ? 'Terbaru dulu' : 'Terlama dulu'}
            >
              <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={loadTransactions}
              className="p-2 sm:p-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-gray-700/50">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-gray-900/50 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
              </div>
              <p className="text-gray-400 font-medium text-sm sm:text-base">Belum ada transaksi</p>
              <p className="text-gray-600 text-[10px] sm:text-xs mt-1">Transaksi akan muncul setelah kamu melakukan pembelian.</p>
            </div>
          ) : (
            filteredTransactions.map((trx) => {
              const statusConfig = getStatusConfig(trx.PAYMENT_STATUS);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={trx.TRANSACTION_ID} className="p-3 sm:p-4 lg:p-6 hover:bg-gray-700/10 transition-colors">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 flex-shrink-0 border border-gray-700/50">
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white truncate">
                            Undangan Digital
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                            {trx.GATEWAY_ORDER_ID}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase border flex-shrink-0 flex items-center gap-1 ${statusConfig.bg} ${statusConfig.color}`}>
                            <StatusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">{statusConfig.label}</span>
                          </span>
                          <button
                            onClick={() => checkStatus(trx.TRANSACTION_ID)}
                            disabled={checkingId === trx.TRANSACTION_ID}
                            className="p-1 rounded-lg hover:bg-gray-700 transition-colors text-gray-500 hover:text-gray-300 disabled:opacity-50"
                            title="Cek status terbaru dari Midtrans"
                          >
                            <RefreshCw className={`w-3 h-3 ${checkingId === trx.TRANSACTION_ID ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Details Row */}
                      <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-2 sm:mt-2.5">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-white">
                          {formatCurrency(trx.FINAL_AMOUNT)}
                        </span>

                        {trx.DISCOUNT_AMOUNT > 0 && (
                          <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                            {formatCurrency(trx.ORIGINAL_AMOUNT)}
                          </span>
                        )}

                        <span className="text-gray-700 hidden sm:block">&bull;</span>

                        <span className="text-[10px] sm:text-xs text-gray-500">
                          {new Date(trx.CREATED_AT).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {trx.PAYMENT_METHOD && (
                          <>
                            <span className="text-gray-700 hidden sm:block">&bull;</span>
                            <span className="text-[10px] sm:text-xs text-gray-500">
                              {formatPaymentMethod(trx.PAYMENT_METHOD)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Mobile status label */}
                      <div className="sm:hidden mt-1.5">
                        <span className={`text-[10px] font-bold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Retry button for INITIATED transactions */}
                      {trx.PAYMENT_STATUS === 'INITIATED' && (
                        <div className="mt-3">
                          <button
                            onClick={() => retryPayment(trx)}
                            disabled={retryingId === trx.TRANSACTION_ID}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-[10px] sm:text-xs font-medium transition-all disabled:opacity-50"
                          >
                            {retryingId === trx.TRANSACTION_ID ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CreditCard className="w-3 h-3" />
                            )}
                            {retryingId === trx.TRANSACTION_ID ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {filteredTransactions.length > 0 && (
          <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gray-900/30 border-t border-gray-700/50 flex justify-between items-center">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Menampilkan <span className="font-bold text-white">{filteredTransactions.length}</span> dari <span className="font-bold text-white">{transactions.length}</span> transaksi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
