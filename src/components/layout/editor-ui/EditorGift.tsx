'use client';
import { useState } from 'react';
import { InvitationGift, InvitationGiftBank, InvitationGiftWallet } from '@/types/interface';
import { Gift, MapPin, CreditCard, Wallet, Plus, Trash2, Building2 } from 'lucide-react';

type GiftTab = 'address' | 'bank' | 'wallet';

interface Props {
  data: InvitationGift;
  onChange: (data: InvitationGift) => void;
}

function BankAccountEditor({
  bank,
  onChange,
  onDelete,
}: {
  bank: InvitationGiftBank;
  onChange: (b: InvitationGiftBank) => void;
  onDelete: () => void;
}) {
  const addAccount = () => {
    onChange({
      ...bank,
      account: [...(bank.account || []), { bankName: '', accountNumber: '', accountName: '' }],
    });
  };

  const updateAccount = (i: number, field: string, value: string) => {
    const acc = [...(bank.account || [])];
    acc[i] = { ...acc[i], [field]: value };
    onChange({ ...bank, account: acc });
  };

  const removeAccount = (i: number) => {
    const acc = [...(bank.account || [])].filter((_, idx) => idx !== i);
    onChange({ ...bank, account: acc });
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Pemilik Rekening</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...bank, owner: 'GROOM' })}
            className={`text-[11px] px-3 py-1 rounded-full transition-colors ${
              bank.owner === 'GROOM'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            Mempelai Pria
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...bank, owner: 'BRIDE' })}
            className={`text-[11px] px-3 py-1 rounded-full transition-colors ${
              bank.owner === 'BRIDE'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            Mempelai Wanita
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {(bank.account || []).map((acc, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 items-start bg-black/20 rounded-lg p-3 relative">
          <div className="col-span-3 flex justify-between items-center mb-1">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Rekening #{i + 1}</span>
            <button
              type="button"
              onClick={() => removeAccount(i)}
              className="text-red-400/50 hover:text-red-400"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/30">Nama Bank</label>
            <input
              type="text"
              value={acc.bankName || ''}
              onChange={(e) => updateAccount(i, 'bankName', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 transition-all"
              placeholder="BCA"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/30">No. Rekening</label>
            <input
              type="text"
              value={acc.accountNumber || ''}
              onChange={(e) => updateAccount(i, 'accountNumber', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 transition-all"
              placeholder="1234567890"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/30">Atas Nama</label>
            <input
              type="text"
              value={acc.accountName || ''}
              onChange={(e) => updateAccount(i, 'accountName', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 transition-all"
              placeholder="JOHN DOE"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAccount}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 hover:border-pink-500/30 rounded-lg py-2 text-xs text-white/30 hover:text-pink-400 transition-all"
      >
        <Plus size={14} /> Tambah Rekening
      </button>
    </div>
  );
}

function WalletEditor({
  wallet,
  onChange,
  onDelete,
}: {
  wallet: InvitationGiftWallet;
  onChange: (w: InvitationGiftWallet) => void;
  onDelete: () => void;
}) {
  const addAddress = () => {
    onChange({
      ...wallet,
      address: [...(wallet.address || []), { walletName: '', walletNumber: '', walletHolder: '' }],
    });
  };

  const updateAddress = (i: number, field: string, value: string) => {
    const addr = [...(wallet.address || [])];
    addr[i] = { ...addr[i], [field]: value };
    onChange({ ...wallet, address: addr });
  };

  const removeAddress = (i: number) => {
    const addr = [...(wallet.address || [])].filter((_, idx) => idx !== i);
    onChange({ ...wallet, address: addr });
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Pemilik E-Wallet</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...wallet, owner: 'GROOM' })}
            className={`text-[11px] px-3 py-1 rounded-full transition-colors ${
              wallet.owner === 'GROOM'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            Mempelai Pria
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...wallet, owner: 'BRIDE' })}
            className={`text-[11px] px-3 py-1 rounded-full transition-colors ${
              wallet.owner === 'BRIDE'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            Mempelai Wanita
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {(wallet.address || []).map((addr, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 items-start bg-black/20 rounded-lg p-3 relative">
          <div className="col-span-3 flex justify-between items-center mb-1">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Dompet #{i + 1}</span>
            <button
              type="button"
              onClick={() => removeAddress(i)}
              className="text-red-400/50 hover:text-red-400"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/30">Nama E-Wallet</label>
            <input
              type="text"
              value={addr.walletName || ''}
              onChange={(e) => updateAddress(i, 'walletName', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 transition-all"
              placeholder="GoPay"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/30">Nomor</label>
            <input
              type="text"
              value={addr.walletNumber || ''}
              onChange={(e) => updateAddress(i, 'walletNumber', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 transition-all"
              placeholder="08123456789"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/30">Atas Nama</label>
            <input
              type="text"
              value={addr.walletHolder || ''}
              onChange={(e) => updateAddress(i, 'walletHolder', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 transition-all"
              placeholder="JOHN DOE"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAddress}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 hover:border-pink-500/30 rounded-lg py-2 text-xs text-white/30 hover:text-pink-400 transition-all"
      >
        <Plus size={14} /> Tambah Dompet Digital
      </button>
    </div>
  );
}

export default function EditorGift({ data, onChange }: Props) {
  const [tab, setTab] = useState<GiftTab>('address');

  const handleAddressChange = (value: string) => {
    onChange({ ...data, address: value });
  };

  const addBank = () => {
    const newBank: InvitationGiftBank = {
      giftBankId: `new_${Date.now()}`,
      giftId: data.giftId,
      account: [],
      owner: 'GROOM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onChange({ ...data, invitationGiftBank: [...(data.invitationGiftBank || []), newBank] });
  };

  const updateBank = (i: number, bank: InvitationGiftBank) => {
    const banks = [...(data.invitationGiftBank || [])];
    banks[i] = bank;
    onChange({ ...data, invitationGiftBank: banks });
  };

  const removeBank = (i: number) => {
    const banks = [...(data.invitationGiftBank || [])].filter((_, idx) => idx !== i);
    onChange({ ...data, invitationGiftBank: banks });
  };

  const addWallet = () => {
    const newWallet: InvitationGiftWallet = {
      giftWalletId: `new_${Date.now()}`,
      giftId: data.giftId,
      address: [],
      owner: 'BRIDE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onChange({ ...data, invitationGiftWallet: [...(data.invitationGiftWallet || []), newWallet] });
  };

  const updateWallet = (i: number, wallet: InvitationGiftWallet) => {
    const wallets = [...(data.invitationGiftWallet || [])];
    wallets[i] = wallet;
    onChange({ ...data, invitationGiftWallet: wallets });
  };

  const removeWallet = (i: number) => {
    const wallets = [...(data.invitationGiftWallet || [])].filter((_, idx) => idx !== i);
    onChange({ ...data, invitationGiftWallet: wallets });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-white font-bold flex items-center gap-2 text-lg">
        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
          <Gift size={18} />
        </div>
        Informasi Hadiah
      </h3>

      <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/5">
        {[
          { id: 'address', label: 'Alamat', icon: MapPin },
          { id: 'bank', label: 'Rekening', icon: Building2 },
          { id: 'wallet', label: 'E-Wallet', icon: Wallet },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as GiftTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all ${
                tab === t.id
                  ? 'bg-pink-500/10 text-pink-300 shadow-sm'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'address' && (
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-white/50">Alamat Kirim Hadiah</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-2.5 text-gray-500" />
            <textarea
              value={data.address || ''}
              onChange={(e) => handleAddressChange(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 h-32 resize-none"
              placeholder="Masukkan alamat lengkap untuk pengiriman kado fisik..."
            />
          </div>
        </div>
      )}

      {tab === 'bank' && (
        <div className="space-y-4">
          <p className="text-xs text-white/40 leading-relaxed">
            Kelola rekening bank untuk menerima hadiah transfer. Tamu dapat melihat informasi ini di halaman undangan.
          </p>
          {(data.invitationGiftBank || []).map((bank, i) => (
            <BankAccountEditor
              key={bank.giftBankId || i}
              bank={bank}
              onChange={(b) => updateBank(i, b)}
              onDelete={() => removeBank(i)}
            />
          ))}
          <button
            type="button"
            onClick={addBank}
            className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 hover:text-pink-400 py-3 rounded-xl text-sm text-white/30 transition-all"
          >
            <Plus size={18} /> Tambah Grup Rekening
          </button>
        </div>
      )}

      {tab === 'wallet' && (
        <div className="space-y-4">
          <p className="text-xs text-white/40 leading-relaxed">
            Kelola dompet digital (GoPay, OVO, Dana, dll) untuk menerima hadiah transfer.
          </p>
          {(data.invitationGiftWallet || []).map((wallet, i) => (
            <WalletEditor
              key={wallet.giftWalletId || i}
              wallet={wallet}
              onChange={(w) => updateWallet(i, w)}
              onDelete={() => removeWallet(i)}
            />
          ))}
          <button
            type="button"
            onClick={addWallet}
            className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 hover:text-pink-400 py-3 rounded-xl text-sm text-white/30 transition-all"
          >
            <Plus size={18} /> Tambah Grup E-Wallet
          </button>
        </div>
      )}
    </div>
  );
}
