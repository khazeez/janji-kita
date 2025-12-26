import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
  bank: string;
  accountNumber: string;
  accountName: string;
}

interface WalletAddress {
  network: string;
  walletAddress: string;
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

  // Helper to get or create bank entry for owner
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

  // Helper to get or create wallet entry for owner
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
      bank: '',
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
      walletAddress: '',
      network: 'ethereum',
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

  // Get accounts for specific owner
  const getBrideAccounts = () => {
    const brideBank = data.invitationGiftBank.find((b) => b.owner === 'BRIDE');
    return brideBank?.account || [];
  };

  const getGroomAccounts = () => {
    const groomBank = data.invitationGiftBank.find((b) => b.owner === 'GROOM');
    return groomBank?.account || [];
  };

  const getBrideWallets = () => {
    const brideWallet = data.invitationGiftWallet.find(
      (w) => w.owner === 'BRIDE'
    );
    return brideWallet?.address || [];
  };

  const getGroomWallets = () => {
    const groomWallet = data.invitationGiftWallet.find(
      (w) => w.owner === 'GROOM'
    );
    return groomWallet?.address || [];
  };

  return (
    <div className='min-h-screen bg-gray-900 p-6'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Alamat Rumah */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-white mb-4'>
            Alamat Rumah
          </h3>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Alamat Lengkap
            </label>
            <textarea
              value={data.address || ''}
              onChange={(e) => setGiftData({ address: e.target.value })}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none'
              placeholder='Masukkan alamat lengkap untuk pengiriman hadiah'
              rows={3}
            />
          </div>
        </div>

        {/* Rekening Mempelai Wanita */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-pink-400'>
              Rekening Mempelai Wanita
            </h3>
            <button
              onClick={() => addBankAccount('BRIDE')}
              className='flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {getBrideAccounts().map((account, index) => (
              <div
                key={index}
                className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
              >
                <button
                  onClick={() => deleteBankAccount('BRIDE', index)}
                  className='absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors'
                >
                  <Trash2 size={18} />
                </button>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Nama Bank
                  </label>
                  <input
                    type='text'
                    value={account.bankName}
                    onChange={(e) =>
                      updateBankAccount(
                        'BRIDE',
                        index,
                        'bank',
                        e.target.value
                      )
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='BCA, Mandiri, BNI'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Nomor Rekening
                  </label>
                  <input
                    type='text'
                    value={account.accountNumber}
                    onChange={(e) =>
                      updateBankAccount(
                        'BRIDE',
                        index,
                        'accountNumber',
                        e.target.value
                      )
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='1234567890'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Atas Nama
                  </label>
                  <input
                    type='text'
                    value={account.accountName}
                    onChange={(e) =>
                      updateBankAccount(
                        'BRIDE',
                        index,
                        'accountName',
                        e.target.value
                      )
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none'
                    placeholder='Nama pemilik'
                  />
                </div>
              </div>
            ))}

            {getBrideAccounts().length === 0 && (
              <p className='text-gray-400 text-sm text-center py-4'>
                Belum ada rekening ditambahkan
              </p>
            )}
          </div>
        </div>

        {/* Wallet Mempelai Wanita */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-pink-400'>
              Web3 Wallet Mempelai Wanita
            </h3>
            <button
              onClick={() => addWallet('BRIDE')}
              className='flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {getBrideWallets().map((wallet, index) => (
              <div
                key={index}
                className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
              >
                <button
                  onClick={() => deleteWallet('BRIDE', index)}
                  className='absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors'
                >
                  <Trash2 size={18} />
                </button>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Chain / Network
                  </label>
                  <select
                    value={wallet.chain}
                    onChange={(e) =>
                      updateWallet('BRIDE', index, 'network', e.target.value)
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none'
                  >
                    {evmChains.map((chain) => (
                      <option key={chain.value} value={chain.value}>
                        {chain.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Alamat Wallet
                  </label>
                  <input
                    type='text'
                    value={wallet.address}
                    onChange={(e) =>
                      updateWallet('BRIDE', index, 'walletAddress', e.target.value)
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono'
                    placeholder='0x...'
                  />
                </div>
              </div>
            ))}

            {getBrideWallets().length === 0 && (
              <p className='text-gray-400 text-sm text-center py-4'>
                Belum ada wallet ditambahkan
              </p>
            )}
          </div>
        </div>

        {/* Rekening Mempelai Pria */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-blue-400'>
              Rekening Mempelai Pria
            </h3>
            <button
              onClick={() => addBankAccount('GROOM')}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {getGroomAccounts().map((account, index) => (
              <div
                key={index}
                className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
              >
                <button
                  onClick={() => deleteBankAccount('GROOM', index)}
                  className='absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors'
                >
                  <Trash2 size={18} />
                </button>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Nama Bank
                  </label>
                  <input
                    type='text'
                    value={account.bankName}
                    onChange={(e) =>
                      updateBankAccount(
                        'GROOM',
                        index,
                        'bank',
                        e.target.value
                      )
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    placeholder='BCA, Mandiri, BNI'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Nomor Rekening
                  </label>
                  <input
                    type='text'
                    value={account.accountNumber}
                    onChange={(e) =>
                      updateBankAccount(
                        'GROOM',
                        index,
                        'accountNumber',
                        e.target.value
                      )
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    placeholder='1234567890'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Atas Nama
                  </label>
                  <input
                    type='text'
                    value={account.accountName}
                    onChange={(e) =>
                      updateBankAccount(
                        'GROOM',
                        index,
                        'accountName',
                        e.target.value
                      )
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    placeholder='Nama pemilik'
                  />
                </div>
              </div>
            ))}

            {getGroomAccounts().length === 0 && (
              <p className='text-gray-400 text-sm text-center py-4'>
                Belum ada rekening ditambahkan
              </p>
            )}
          </div>
        </div>

        {/* Wallet Mempelai Pria */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-blue-400'>
              Web3 Wallet Mempelai Pria
            </h3>
            <button
              onClick={() => addWallet('GROOM')}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {getGroomWallets().map((wallet, index) => (
              <div
                key={index}
                className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
              >
                <button
                  onClick={() => deleteWallet('GROOM', index)}
                  className='absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors'
                >
                  <Trash2 size={18} />
                </button>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Chain / Network
                  </label>
                  <select
                    value={wallet.chain}
                    onChange={(e) =>
                      updateWallet('GROOM', index, 'network', e.target.value)
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  >
                    {evmChains.map((chain) => (
                      <option key={chain.value} value={chain.value}>
                        {chain.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-300 mb-1'>
                    Alamat Wallet
                  </label>
                  <input
                    type='text'
                    value={wallet.address}
                    onChange={(e) =>
                      updateWallet('GROOM', index, 'walletAddress', e.target.value)
                    }
                    className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono'
                    placeholder='0x...'
                  />
                </div>
              </div>
            ))}

            {getGroomWallets().length === 0 && (
              <p className='text-gray-400 text-sm text-center py-4'>
                Belum ada wallet ditambahkan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
