import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { GiftData, Wallet, BankAccount, EVMChain } from '@/types/form';

type GiftDataInputProps = {
  data: GiftData;
  onChange: (data: GiftData) => void;
};

export default function GiftDataInput({ data, onChange }: GiftDataInputProps) {
  const setGiftData = (update: Partial<GiftData>) => {
    onChange({ ...data, ...update });
  };

  const evmChains: EVMChain[] = [
    { value: 'ethereum', label: 'Ethereum (ETH)', color: 'text-blue-400' },
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

  const addBankAccount = (owner: 'bride' | 'groom') => {
    const newAccount = {
      id: Date.now().toString(),
      bankName: '',
      accountNumber: '',
      accountName: '',
      owner,
    };
    setGiftData({ accounts: [...data.accounts, newAccount] });
  };

  const updateBankAccount = (
    id: string,
    field: keyof Omit<BankAccount, 'id' | 'owner'>,
    value: string
  ) => {
    setGiftData({
      accounts: data.accounts.map((acc) =>
        acc.id === id ? { ...acc, [field]: value } : acc
      ),
    });
  };

  const deleteBankAccount = (id: string) => {
    setGiftData({
      accounts: data.accounts.filter((acc) => acc.id !== id),
    });
  };

  const addWallet = (owner: 'bride' | 'groom') => {
    const newWallet = {
      id: Date.now().toString(),
      address: '',
      chain: 'ethereum',
      owner,
    };
    setGiftData({ wallets: [...data.wallets, newWallet] });
  };

  const updateWallet = (
    id: string,
    field: keyof Omit<Wallet, 'id' | 'owner'>,
    value: string
  ) => {
    setGiftData({
      wallets: data.wallets.map((wallet) =>
        wallet.id === id ? { ...wallet, [field]: value } : wallet
      ),
    });
  };

  const deleteWallet = (id: string) => {
    setGiftData({
      wallets: data.wallets.filter((wallet) => wallet.id !== id),
    });
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
              value={data.address}
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
              onClick={() => addBankAccount('bride')}
              className='flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {data.accounts
              .filter((acc) => acc.owner === 'bride')
              .map((account) => (
                <div
                  key={account.id}
                  className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
                >
                  <button
                    onClick={() => deleteBankAccount(account.id)}
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
                          account.id,
                          'bankName',
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
                          account.id,
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
                          account.id,
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

            {data.accounts.filter((acc) => acc.owner === 'bride').length ===
              0 && (
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
              onClick={() => addWallet('bride')}
              className='flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {data.wallets
              .filter((wallet) => wallet.owner === 'bride')
              .map((wallet) => (
                <div
                  key={wallet.id}
                  className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
                >
                  <button
                    onClick={() => deleteWallet(wallet.id)}
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
                        updateWallet(wallet.id, 'chain', e.target.value)
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
                        updateWallet(wallet.id, 'address', e.target.value)
                      }
                      className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono'
                      placeholder='0x...'
                    />
                  </div>
                </div>
              ))}

            {data.wallets.filter((wallet) => wallet.owner === 'bride')
              .length === 0 && (
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
              onClick={() => addBankAccount('groom')}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {data.accounts
              .filter((acc) => acc.owner === 'groom')
              .map((account) => (
                <div
                  key={account.id}
                  className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
                >
                  <button
                    onClick={() => deleteBankAccount(account.id)}
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
                          account.id,
                          'bankName',
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
                          account.id,
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
                          account.id,
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

            {data.accounts.filter((acc) => acc.owner === 'groom').length ===
              0 && (
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
              onClick={() => addWallet('groom')}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors'
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className='space-y-4'>
            {data.wallets
              .filter((wallet) => wallet.owner === 'groom')
              .map((wallet) => (
                <div
                  key={wallet.id}
                  className='bg-gray-700 rounded-lg p-4 space-y-3 relative'
                >
                  <button
                    onClick={() => deleteWallet(wallet.id)}
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
                        updateWallet(wallet.id, 'chain', e.target.value)
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
                        updateWallet(wallet.id, 'address', e.target.value)
                      }
                      className='w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono'
                      placeholder='0x...'
                    />
                  </div>
                </div>
              ))}

            {data.wallets.filter((wallet) => wallet.owner === 'groom')
              .length === 0 && (
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
