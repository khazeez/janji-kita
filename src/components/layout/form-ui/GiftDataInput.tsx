import { useState } from 'react';
import { Plus, Trash2, Home, CreditCard, Wallet, ChevronDown, Landmark } from 'lucide-react';
import {
  InvitationGift,
  InvitationGiftBank,
  InvitationGiftWallet,
} from '@/types/interface';

type GiftDataInputProps = {
  data: InvitationGift;
  onChange: (data: InvitationGift) => void;
};

interface EVMChain {
  value: string;
  label: string;
  color: string;
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface WalletAddress {
  chain: string;
  address: string;
}

export default function GiftDataInput({ data, onChange }: GiftDataInputProps) {
  const setGiftData = (update: Partial<InvitationGift>) => {
    onChange({ ...data, ...update });
  };

  const evmChains: EVMChain[] = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', color: 'text-blue-400' },
    { value: 'ethereum', label: 'Ethereum (ETH)', color: 'text-blue-400' },
    { value: 'usdt', label: 'USDT', color: 'text-blue-400' },
    { value: 'polygon', label: 'Polygon (MATIC)', color: 'text-purple-400' },
    { value: 'bsc', label: 'BNB Smart Chain (BSC)', color: 'text-yellow-400' },
    { value: 'arbitrum', label: 'Arbitrum (ARB)', color: 'text-blue-300' },
    { value: 'optimism', label: 'Optimism (OP)', color: 'text-red-400' },
    {
      value: 'avalanche',
      label: 'Avalanche C-Chain (AVAX)',
      color: 'text-red-500',
    },
    { value: 'base', label: 'Base', color: 'text-blue-500' },
    { value: 'fantom', label: 'Fantom (FTM)', color: 'text-blue-400' },
  ];

  const getBankEntry = (owner: 'BRIDE' | 'GROOM'): InvitationGiftBank => {
    const existing = data.invitationGiftBank.find((b) => b.owner === owner);
    if (existing) return existing;

    const newEntry: InvitationGiftBank = {
      giftBankId: `bank_${owner.toLowerCase()}_${Date.now()}`,
      giftId: data.giftId,
      account: [],
      owner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newEntry;
  };

  const getWalletEntry = (owner: 'BRIDE' | 'GROOM'): InvitationGiftWallet => {
    const existing = data.invitationGiftWallet.find((w) => w.owner === owner);
    if (existing) return existing;

    const newEntry: InvitationGiftWallet = {
      giftWalletId: `wallet_${owner.toLowerCase()}_${Date.now()}`,
      giftId: data.giftId,
      address: [],
      owner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newEntry;
  };

  const addBankAccount = (owner: 'BRIDE' | 'GROOM') => {
    const newAccount: BankAccount = {
      bankName: '',
      accountNumber: '',
      accountName: '',
    };

    const existingBankIndex = data.invitationGiftBank.findIndex(
      (b) => b.owner === owner
    );

    if (existingBankIndex >= 0) {
      const updatedBanks = [...data.invitationGiftBank];
      updatedBanks[existingBankIndex] = {
        ...updatedBanks[existingBankIndex],
        account: [...updatedBanks[existingBankIndex].account, newAccount],
        updatedAt: new Date().toISOString(),
      };
      setGiftData({ invitationGiftBank: updatedBanks });
    } else {
      const newBankEntry = getBankEntry(owner);
      newBankEntry.account = [newAccount];
      setGiftData({
        invitationGiftBank: [...data.invitationGiftBank, newBankEntry],
      });
    }
  };

  const updateBankAccount = (
    owner: 'BRIDE' | 'GROOM',
    index: number,
    field: keyof BankAccount,
    value: string
  ) => {
    const bankIndex = data.invitationGiftBank.findIndex(
      (b) => b.owner === owner
    );
    if (bankIndex < 0) return;

    const updatedBanks = [...data.invitationGiftBank];
    const updatedAccounts = [...updatedBanks[bankIndex].account];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    updatedBanks[bankIndex] = {
      ...updatedBanks[bankIndex],
      account: updatedAccounts,
      updatedAt: new Date().toISOString(),
    };

    setGiftData({ invitationGiftBank: updatedBanks });
  };

  const deleteBankAccount = (owner: 'BRIDE' | 'GROOM', index: number) => {
    const bankIndex = data.invitationGiftBank.findIndex(
      (b) => b.owner === owner
    );
    if (bankIndex < 0) return;

    const updatedBanks = [...data.invitationGiftBank];
    const updatedAccounts = updatedBanks[bankIndex].account.filter(
      (_, i) => i !== index
    );
    updatedBanks[bankIndex] = {
      ...updatedBanks[bankIndex],
      account: updatedAccounts,
      updatedAt: new Date().toISOString(),
    };

    setGiftData({ invitationGiftBank: updatedBanks });
  };

  const addWallet = (owner: 'BRIDE' | 'GROOM') => {
    const newWallet: WalletAddress = {
      address: '',
      chain: 'ethereum',
    };

    const existingWalletIndex = data.invitationGiftWallet.findIndex(
      (w) => w.owner === owner
    );

    if (existingWalletIndex >= 0) {
      const updatedWallets = [...data.invitationGiftWallet];
      updatedWallets[existingWalletIndex] = {
        ...updatedWallets[existingWalletIndex],
        address: [...updatedWallets[existingWalletIndex].address, newWallet],
        updatedAt: new Date().toISOString(),
      };
      setGiftData({ invitationGiftWallet: updatedWallets });
    } else {
      const newWalletEntry = getWalletEntry(owner);
      newWalletEntry.address = [newWallet];
      setGiftData({
        invitationGiftWallet: [...data.invitationGiftWallet, newWalletEntry],
      });
    }
  };

  const updateWallet = (
    owner: 'BRIDE' | 'GROOM',
    index: number,
    field: keyof WalletAddress,
    value: string
  ) => {
    const walletIndex = data.invitationGiftWallet.findIndex(
      (w) => w.owner === owner
    );
    if (walletIndex < 0) return;

    const updatedWallets = [...data.invitationGiftWallet];
    const updatedAddresses = [...updatedWallets[walletIndex].address];
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
    updatedWallets[walletIndex] = {
      ...updatedWallets[walletIndex],
      address: updatedAddresses,
      updatedAt: new Date().toISOString(),
    };

    setGiftData({ invitationGiftWallet: updatedWallets });
  };

  const deleteWallet = (owner: 'BRIDE' | 'GROOM', index: number) => {
    const walletIndex = data.invitationGiftWallet.findIndex(
      (w) => w.owner === owner
    );
    if (walletIndex < 0) return;

    const updatedWallets = [...data.invitationGiftWallet];
    const updatedAddresses = updatedWallets[walletIndex].address.filter(
      (_, i) => i !== index
    );
    updatedWallets[walletIndex] = {
      ...updatedWallets[walletIndex],
      address: updatedAddresses,
      updatedAt: new Date().toISOString(),
    };

    setGiftData({ invitationGiftWallet: updatedWallets });
  };

  const getBrideAccounts = () => {
    const brideBank = data.invitationGiftBank.find((b) => b.owner === 'BRIDE');
    return (brideBank?.account || []) as BankAccount[];
  };

  const getGroomAccounts = () => {
    const groomBank = data.invitationGiftBank.find((b) => b.owner === 'GROOM');
    return (groomBank?.account || []) as BankAccount[];
  };

  const getBrideWallets = () => {
    const brideWallet = data.invitationGiftWallet.find(
      (w) => w.owner === 'BRIDE'
    );
    return (brideWallet?.address || []) as WalletAddress[];
  };

  const getGroomWallets = () => {
    const groomWallet = data.invitationGiftWallet.find(
      (w) => w.owner === 'GROOM'
    );
    return (groomWallet?.address || []) as WalletAddress[];
  };

  const inputClasses = "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300";
  const selectClasses = "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-[#1a1f2e] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 appearance-none cursor-pointer";

  return (
    <div className='space-y-10'>
      {/* Alamat Rumah */}
      <div className='space-y-6'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
            <Home size={20} />
          </div>
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Kirim Kado Ke Rumah</h3>
            <p className='text-xs text-white/40'>Alamat pengiriman untuk kado fisik</p>
          </div>
        </div>
        
        <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6'>
          <div className="space-y-1.5">
            <label className='block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1'>Alamat Lengkap</label>
            <textarea
              value={data.address || ''}
              onChange={(e) => setGiftData({ address: e.target.value })}
              className={`${inputClasses} resize-none`}
              placeholder='Masukkan alamat lengkap untuk pengiriman hadiah'
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* REKENING & WALLET BRIDE */}
      <div className='space-y-8'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Mempelai Wanita</h3>
            <p className='text-xs text-white/40'>Data rekening dan wallet untuk kado digital</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Bank Accounts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Rekening Bank</span>
              <button
                onClick={() => addBankAccount('BRIDE')}
                className="text-[10px] font-bold text-pink-500 hover:text-pink-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <Plus size={12} /> Tambah Bank
              </button>
            </div>

            <div className="grid gap-4">
              {getBrideAccounts().map((account, index) => (
                <div key={index} className='relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 group transition-all hover:bg-white/[0.04]'>
                  <button
                    onClick={() => deleteBankAccount('BRIDE', index)}
                    className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg transition-all'
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Nama Bank</label>
                      <div className="relative">
                        <Landmark size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                          type='text'
                          value={account.bankName}
                          onChange={(e) => updateBankAccount('BRIDE', index, 'bankName', e.target.value)}
                          className={`${inputClasses} pl-10`}
                          placeholder='BCA, Mandiri, BNI'
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Nomor Rekening</label>
                        <input
                          type='text'
                          value={account.accountNumber}
                          onChange={(e) => updateBankAccount('BRIDE', index, 'accountNumber', e.target.value)}
                          className={inputClasses}
                          placeholder='1234567890'
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Atas Nama</label>
                        <input
                          type='text'
                          value={account.accountName}
                          onChange={(e) => updateBankAccount('BRIDE', index, 'accountName', e.target.value)}
                          className={inputClasses}
                          placeholder='Nama pemilik'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {getBrideAccounts().length === 0 && (
                <div className="py-6 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-center">
                  <p className="text-xs text-white/20 font-medium">Belum ada rekening bank</p>
                </div>
              )}
            </div>
          </div>

          {/* Wallets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Web3 Wallet</span>
              <button
                onClick={() => addWallet('BRIDE')}
                className="text-[10px] font-bold text-pink-500 hover:text-pink-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <Plus size={12} /> Tambah Wallet
              </button>
            </div>

            <div className="grid gap-4">
              {getBrideWallets().map((wallet, index) => (
                <div key={index} className='relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 group transition-all hover:bg-white/[0.04]'>
                  <button
                    onClick={() => deleteWallet('BRIDE', index)}
                    className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg transition-all'
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Chain / Network</label>
                      <div className="relative">
                        <select
                          value={wallet.chain}
                          onChange={(e) => updateWallet('BRIDE', index, 'chain', e.target.value)}
                          className={selectClasses}
                        >
                          {evmChains.map((chain) => (
                            <option key={chain.value} value={chain.value}>{chain.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Alamat Wallet</label>
                      <div className="relative">
                        <Wallet size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                          type='text'
                          value={wallet.address}
                          onChange={(e) => updateWallet('BRIDE', index, 'address', e.target.value)}
                          className={`${inputClasses} pl-10 font-mono`}
                          placeholder='0x...'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {getBrideWallets().length === 0 && (
                <div className="py-6 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-center">
                  <p className="text-xs text-white/20 font-medium">Belum ada crypto wallet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5 mx-2" />

      {/* REKENING & WALLET GROOM */}
      <div className='space-y-8'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className='text-lg font-bold text-white tracking-tight'>Mempelai Pria</h3>
            <p className='text-xs text-white/40'>Data rekening dan wallet untuk kado digital</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Bank Accounts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Rekening Bank</span>
              <button
                onClick={() => addBankAccount('GROOM')}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <Plus size={12} /> Tambah Bank
              </button>
            </div>

            <div className="grid gap-4">
              {getGroomAccounts().map((account, index) => (
                <div key={index} className='relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 group transition-all hover:bg-white/[0.04]'>
                  <button
                    onClick={() => deleteBankAccount('GROOM', index)}
                    className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg transition-all'
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Nama Bank</label>
                      <div className="relative">
                        <Landmark size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                          type='text'
                          value={account.bankName}
                          onChange={(e) => updateBankAccount('GROOM', index, 'bankName', e.target.value)}
                          className={`${inputClasses} pl-10`}
                          placeholder='BCA, Mandiri, BNI'
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Nomor Rekening</label>
                        <input
                          type='text'
                          value={account.accountNumber}
                          onChange={(e) => updateBankAccount('GROOM', index, 'accountNumber', e.target.value)}
                          className={inputClasses}
                          placeholder='1234567890'
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Atas Nama</label>
                        <input
                          type='text'
                          value={account.accountName}
                          onChange={(e) => updateBankAccount('GROOM', index, 'accountName', e.target.value)}
                          className={inputClasses}
                          placeholder='Nama pemilik'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {getGroomAccounts().length === 0 && (
                <div className="py-6 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-center">
                  <p className="text-xs text-white/20 font-medium">Belum ada rekening bank</p>
                </div>
              )}
            </div>
          </div>

          {/* Wallets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Web3 Wallet</span>
              <button
                onClick={() => addWallet('GROOM')}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <Plus size={12} /> Tambah Wallet
              </button>
            </div>

            <div className="grid gap-4">
              {getGroomWallets().map((wallet, index) => (
                <div key={index} className='relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 group transition-all hover:bg-white/[0.04]'>
                  <button
                    onClick={() => deleteWallet('GROOM', index)}
                    className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg transition-all'
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Chain / Network</label>
                      <div className="relative">
                        <select
                          value={wallet.chain}
                          onChange={(e) => updateWallet('GROOM', index, 'chain', e.target.value)}
                          className={selectClasses}
                        >
                          {evmChains.map((chain) => (
                            <option key={chain.value} value={chain.value}>{chain.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className='block text-[10px] font-bold text-white/20 uppercase tracking-wider ml-1'>Alamat Wallet</label>
                      <div className="relative">
                        <Wallet size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                          type='text'
                          value={wallet.address}
                          onChange={(e) => updateWallet('GROOM', index, 'address', e.target.value)}
                          className={`${inputClasses} pl-10 font-mono`}
                          placeholder='0x...'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {getGroomWallets().length === 0 && (
                <div className="py-6 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-center">
                  <p className="text-xs text-white/20 font-medium">Belum ada crypto wallet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
