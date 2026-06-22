'use client';

import { useState, useEffect, useCallback } from 'react';
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
  AlertCircle,
  Copy,
  Check,
  Banknote,
  QrCode,
  Wallet,
  ExternalLink,
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

interface PaymentDetailData {
  type: string;
  vaNumbers?: { bank: string; va_number: string }[];
  billKey?: string;
  billerCode?: string;
  actions?: { name: string; url: string }[];
  bank?: string;
  maskedCard?: string;
  rawType?: string;
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
  const [detailTid, setDetailTid] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<{
    transactionId: string;
    paymentMethod: string | null;
    paymentDetails: PaymentDetailData | null;
    grossAmount: string | null;
    transactionTime: string | null;
    currentStatus: string;
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  async function showPaymentDetail(trx: TransactionData) {
    setDetailTid(trx.TRANSACTION_ID);
    setDetailLoading(true);
    try {
      const res = await fetch('/api/midtrans/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: trx.TRANSACTION_ID }),
      });
      const result = await res.json();
      console.log('[PAYMENT DETAIL] API response:', result);
      if (res.ok) {
        setDetailData({
          transactionId: result.transactionId,
          paymentMethod: result.paymentMethod,
          paymentDetails: result.paymentDetails,
          grossAmount: result.grossAmount,
          transactionTime: result.transactionTime,
          currentStatus: result.currentStatus,
        });
        // Also update the transaction status in the list
        setTransactions(prev =>
          prev.map(t =>
            t.TRANSACTION_ID === trx.TRANSACTION_ID
              ? { ...t, PAYMENT_STATUS: result.currentStatus, PAYMENT_METHOD: result.paymentMethod || t.PAYMENT_METHOD }
              : t
          )
        );
      }
    } catch (error) {
      console.error('Fetch payment detail error:', error);
    } finally {
      setDetailLoading(false);
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

  // Auto-check status for pending transactions on load
  useEffect(() => {
    if (transactions.length === 0) return;
    const pending = transactions.filter(t => t.PAYMENT_STATUS === 'PENDING');
    if (pending.length === 0) return;
    pending.forEach(trx => {
      checkStatus(trx.TRANSACTION_ID);
    });
  }, [transactions.length > 0]);

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

                      {/* Payment detail button for PENDING */}
                      {(trx.PAYMENT_STATUS === 'PENDING') && (
                        <div className="mt-3">
                          <button
                            onClick={() => showPaymentDetail(trx)}
                            disabled={detailLoading && detailTid === trx.TRANSACTION_ID}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] sm:text-xs font-medium transition-all disabled:opacity-50"
                          >
                            {detailLoading && detailTid === trx.TRANSACTION_ID ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Receipt className="w-3 h-3" />
                            )}
                            {detailLoading && detailTid === trx.TRANSACTION_ID ? 'Memuat...' : 'Lihat Detail Pembayaran'}
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

      {/* Payment detail modal */}
      {detailData && (
        <PaymentDetailModal
          data={detailData}
          onClose={() => setDetailData(null)}
        />
      )}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-gray-300 transition-all"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? 'Tersalin' : label}
    </button>
  );
}

function PaymentDetailModal({
  data,
  onClose,
}: {
  data: {
    paymentMethod: string | null;
    paymentDetails: PaymentDetailData | null;
    grossAmount: string | null;
    transactionTime: string | null;
  };
  onClose: () => void;
}) {
  const { paymentDetails, paymentMethod, grossAmount, transactionTime } = data;

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getMethodIcon = () => {
    if (!paymentDetails) return <CreditCard className="w-5 h-5" />;
    switch (paymentDetails.type) {
      case 'bank_transfer':
      case 'mandiri_bill':
        return <Banknote className="w-5 h-5" />;
      case 'qris':
        return <QrCode className="w-5 h-5" />;
      case 'gopay':
      case 'e_wallet':
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getMethodLabel = () => {
    if (!paymentDetails) return paymentMethod || '-';
    switch (paymentDetails.type) {
      case 'bank_transfer': {
        const va = paymentDetails.vaNumbers?.[0];
        if (va?.bank === 'permata') return 'Permata Virtual Account';
        return `${va?.bank?.toUpperCase() || ''} Virtual Account`.trim();
      }
      case 'mandiri_bill': return 'Mandiri Bill Payment';
      case 'qris': return 'QRIS';
      case 'gopay': return 'GoPay';
      case 'e_wallet': return 'E-Wallet';
      case 'credit_card': return 'Kartu Kredit';
      default: return paymentMethod || '-';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
              {getMethodIcon()}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Detail Pembayaran</h3>
              <p className="text-gray-400 text-[11px]">{getMethodLabel()}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Amount */}
          {grossAmount && (
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Pembayaran</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(grossAmount)}</p>
            </div>
          )}

          {/* Bank Transfer VA */}
          {paymentDetails?.type === 'bank_transfer' && paymentDetails.vaNumbers && (
            <div className="space-y-3">
              {paymentDetails.vaNumbers.map((va, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">
                    {va.bank === 'permata' ? 'Permata Bank' : `Bank ${va.bank.toUpperCase()}`}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold font-mono text-white tracking-wider">{va.va_number}</p>
                    <CopyButton text={va.va_number} label="Salin" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mandiri Bill */}
          {paymentDetails?.type === 'mandiri_bill' && (
            <div className="space-y-3">
              {paymentDetails.billerCode && (
                <div className="bg-gray-900/50 rounded-xl p-4 space-y-1.5">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Kode Biller</p>
                  <p className="text-lg font-bold font-mono text-white tracking-wider">{paymentDetails.billerCode}</p>
                </div>
              )}
              {paymentDetails.billKey && (
                <div className="bg-gray-900/50 rounded-xl p-4 space-y-1.5">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Kode Bayar</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold font-mono text-white tracking-wider">{paymentDetails.billKey}</p>
                    <CopyButton text={paymentDetails.billKey} label="Salin" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QRIS */}
          {paymentDetails?.type === 'qris' && paymentDetails.actions && (
            <div className="space-y-3">
              {paymentDetails.actions
                .filter((a: { name: string }) => /qr[- ]?code/i.test(a.name) && /generate|image/i.test(a.name))
                .map((action: { url: string }, i: number) => (
                  <div key={i} className="bg-white rounded-xl p-4 flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/midtrans/qr-proxy?url=${encodeURIComponent(action.url)}`}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                    <p className="text-gray-500 text-xs mt-2">Scan QR code di atas untuk membayar</p>
                  </div>
                ))}
              {paymentDetails.actions
                .filter((a: { name: string }) => /deeplink|deep[- ]link/i.test(a.name))
                .map((action: { url: string }, i: number) => (
                  <a
                    key={i}
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka Aplikasi Pembayaran
                  </a>
                ))}
              {/* If no QR image action found, show a fallback */}
              {paymentDetails.actions.filter((a: { name: string }) => /qr[- ]?code/i.test(a.name) && /generate|image/i.test(a.name)).length === 0 && (
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <QrCode className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs">Kode QR tidak tersedia. Gunakan tombol di bawah untuk membayar.</p>
                </div>
              )}
            </div>
          )}

          {/* E-Wallet (GoPay, ShopeePay, etc.) */}
          {(paymentDetails?.type === 'gopay' || paymentDetails?.type === 'e_wallet') && paymentDetails.actions && (
            <div className="space-y-2">
              {paymentDetails.actions
                .filter((a: { name: string }) => /deeplink|redirect|deep[- ]link/i.test(a.name))
                .map((action: { url: string }, i: number) => (
                  <a
                    key={i}
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka {paymentDetails.type === 'gopay' ? 'GoPay' : 'E-Wallet'}
                  </a>
                ))}
              {/* Fallback: show raw action URLs if no named action matched */}
              {paymentDetails.actions.filter((a: { name: string }) => /deeplink|redirect|deep[- ]link/i.test(a.name)).length === 0 && paymentDetails.actions.length > 0 && (
                <div className="space-y-2">
                  {paymentDetails.actions.map((action: { name: string; url: string }, i: number) => (
                    <a
                      key={i}
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {action.name || 'Bayar Sekarang'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Credit Card */}
          {paymentDetails?.type === 'credit_card' && (
            <div className="space-y-2">
              <div className="bg-gray-900/50 rounded-xl p-4 space-y-1.5">
                {paymentDetails.bank && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Bank</span>
                    <span className="text-white text-xs font-medium">{paymentDetails.bank}</span>
                  </div>
                )}
                {paymentDetails.maskedCard && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Kartu</span>
                    <span className="text-white text-xs font-medium font-mono">{paymentDetails.maskedCard}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transaction time */}
          {transactionTime && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
              <span className="text-gray-400 text-xs">Waktu Transaksi</span>
              <span className="text-gray-300 text-xs">
                {new Date(transactionTime).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          )}

          {/* Unknown payment type fallback */}
          {paymentDetails?.type === 'other' && (
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <CreditCard className="w-10 h-10 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Metode pembayaran: {paymentDetails.rawType || paymentMethod || '-'}</p>
              <p className="text-gray-500 text-xs mt-1">Detail pembayaran tidak tersedia saat ini</p>
            </div>
          )}

          {/* No payment details at all — show fallback */}
          {!paymentDetails && (
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Detail pembayaran belum tersedia</p>
              <p className="text-gray-500 text-xs mt-1">Silakan cek status pembayaran secara berkala</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-5 py-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
