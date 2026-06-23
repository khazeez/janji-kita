'use client';
import { CreditCard, Banknote, QrCode, Wallet, ExternalLink, XCircle, AlertCircle } from 'lucide-react';
import CopyButton from './CopyButton';

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

interface Props {
  data: {
    paymentMethod: string | null;
    paymentDetails: PaymentDetailData | null;
    grossAmount: string | null;
    transactionTime: string | null;
  };
  onClose: () => void;
}

function formatCurrency(amount: string) {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

export default function PaymentDetailModal({ data, onClose }: Props) {
  const { paymentDetails, paymentMethod, grossAmount, transactionTime } = data;

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
          {grossAmount && (
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Pembayaran</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(grossAmount)}</p>
            </div>
          )}

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

          {paymentDetails?.type === 'qris' && paymentDetails.actions && (
            <div className="space-y-3">
              {paymentDetails.actions
                .filter((a) => /qr[- ]?code/i.test(a.name) && /generate|image/i.test(a.name))
                .map((action, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 flex flex-col items-center">
                    <img
                      src={`/api/midtrans/qr-proxy?url=${encodeURIComponent(action.url)}`}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                    <p className="text-gray-500 text-xs mt-2">Scan QR code di atas untuk membayar</p>
                  </div>
                ))}
              {paymentDetails.actions
                .filter((a) => /deeplink|deep[- ]link/i.test(a.name))
                .map((action, i) => (
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
              {paymentDetails.actions.filter((a) => /qr[- ]?code/i.test(a.name) && /generate|image/i.test(a.name)).length === 0 && (
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <QrCode className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs">Kode QR tidak tersedia. Gunakan tombol di bawah untuk membayar.</p>
                </div>
              )}
            </div>
          )}

          {(paymentDetails?.type === 'gopay' || paymentDetails?.type === 'e_wallet') && paymentDetails.actions && (
            <div className="space-y-2">
              {paymentDetails.actions
                .filter((a) => /deeplink|redirect|deep[- ]link/i.test(a.name))
                .map((action, i) => (
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
              {paymentDetails.actions.filter((a) => /deeplink|redirect|deep[- ]link/i.test(a.name)).length === 0 && paymentDetails.actions.length > 0 && (
                <div className="space-y-2">
                  {paymentDetails.actions.map((action, i) => (
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

          {paymentDetails?.type === 'other' && (
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <CreditCard className="w-10 h-10 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Metode pembayaran: {paymentDetails.rawType || paymentMethod || '-'}</p>
              <p className="text-gray-500 text-xs mt-1">Detail pembayaran tidak tersedia saat ini</p>
            </div>
          )}

          {!paymentDetails && (
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Detail pembayaran belum tersedia</p>
              <p className="text-gray-500 text-xs mt-1">Silakan cek status pembayaran secara berkala</p>
            </div>
          )}
        </div>

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
