import { InvitationGift } from '@/types/interface';
import {
  MapPin,
  CreditCard,
  Wallet,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export interface Props {
  data: InvitationGift;
}

export default function Gift({ data }: Props) {
  const [activeTab, setActiveTab] = useState<'address' | 'bank' | 'wallet'>(
    'address'
  );
  const [copiedText, setCopiedText] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<{
    [key: string]: number | null;
  }>({});
  const [selectedWallet, setSelectedWallet] = useState<{
    [key: string]: number | null;
  }>({});
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.keys(dropdownRefs.current).every((key) => {
        const ref = dropdownRefs.current[key];
        return ref && !ref.contains(event.target as Node);
      });

      if (clickedOutside) {
        setDropdownOpen({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const toggleDropdown = (key: string) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!data) {
    return (
      <div className='text-center text-white/60 py-12 text-sm'>
        Tidak ada data hadiah tersedia.
      </div>
    );
  }

  const tabs = [
    {
      id: 'address' as const,
      label: 'Alamat',
      icon: MapPin,
      show: !!data.address,
    },
    {
      id: 'bank' as const,
      label: 'Rekening',
      icon: CreditCard,
      show:
        data.invitationGiftBank &&
        Array.isArray(data.invitationGiftBank) &&
        data.invitationGiftBank.length > 0,
    },
    {
      id: 'wallet' as const,
      label: 'Wallet',
      icon: Wallet,
      show:
        data.invitationGiftWallet &&
        Array.isArray(data.invitationGiftWallet) &&
        data.invitationGiftWallet.length > 0,
    },
  ].filter((tab) => tab.show);

  return (
    <section className='relative py-12 px-4'>
      {/* Title Section */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-amalfi text-white mb-2'>Wedding Gift</h1>
        <div className='flex items-center justify-center gap-3'>
          <div className='h-px bg-white/30 w-12'></div>
          <p className='text-white/80 text-xs'>Send Your Love</p>
          <div className='h-px bg-white/30 w-12'></div>
        </div>
      </div>

      <div className='max-w-lg mx-auto'>
        {/* Tabs Navigation */}
        <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-white text-gray-800 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
              >
                <Icon className='w-4 h-4' />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-h-[300px]'>
          {/* Alamat Rumah Tab */}
          {activeTab === 'address' && data.address && (
            <div className='animate-fadeIn'>
              <div className='flex items-start gap-3 mb-4'>
                <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                  <MapPin className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg font-bold text-white mb-3 font-brown-sugar tracking-wider'>
                    Alamat Pengiriman
                  </h3>
                  <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4'>
                    <p className='text-white/90 text-sm leading-relaxed'>
                      {data.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rekening Bank Tab */}
          {activeTab === 'bank' &&
            data.invitationGiftBank &&
            Array.isArray(data.invitationGiftBank) && (
              <div className='animate-fadeIn space-y-5'>
                {data.invitationGiftBank.map((bank, bankIndex) => {
                  const bankKey = `bank-${bankIndex}`;
                  const selectedIndex = selectedBank[bankKey] ?? null;
                  const isDropdownOpen = dropdownOpen[bankKey] || false;

                  return (
                    <div key={bank.giftBankId || bankIndex}>
                      <div className='flex items-center gap-2 mb-3'>
                        <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                          <CreditCard className='w-5 h-5 text-white' />
                        </div>
                        <h3 className='text-base font-bold text-white font-brown-sugar tracking-wider'>
                          {bank.owner === 'GROOM'
                            ? 'Mempelai Pria'
                            : 'Mempelai Wanita'}
                        </h3>
                      </div>

                      <div className='space-y-3'>
                        {/* Bank Dropdown Selector */}
                        <div
                          className='relative'
                          ref={(el) => {
                            dropdownRefs.current[bankKey] = el;
                          }}
                        >
                          <button
                            onClick={() => toggleDropdown(bankKey)}
                            className='w-full bg-white/10 border border-white/20 rounded-xl p-4 text-left flex items-center justify-between hover:bg-white/15 transition-all duration-300'
                          >
                            <div className='flex items-center gap-2'>
                              <CreditCard className='w-4 h-4 text-white' />
                              <span className='text-white text-sm font-medium'>
                                {selectedIndex !== null
                                  ? bank.account[selectedIndex].bankName
                                  : 'Pilih Bank'}
                              </span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <div className='absolute z-10 w-full mt-2 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-xl animate-fadeIn'>
                              {bank.account.map((acc, accIndex) => (
                                <button
                                  key={accIndex}
                                  onClick={() => {
                                    setSelectedBank({
                                      ...selectedBank,
                                      [bankKey]: accIndex,
                                    });
                                    setDropdownOpen({
                                      ...dropdownOpen,
                                      [bankKey]: false,
                                    });
                                  }}
                                  className={`w-full p-3 text-left text-sm hover:bg-white/10 transition-all duration-200 ${selectedIndex === accIndex
                                      ? 'bg-white/10'
                                      : ''
                                    }`}
                                >
                                  <p className='text-white font-medium'>
                                    {acc.bank}
                                  </p>
                                  <p className='text-white/60 text-xs mt-1'>
                                    {acc.accountName}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bank Account Details */}
                        {selectedIndex !== null &&
                          bank.account[selectedIndex] && (
                            <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-fadeIn'>
                              <div className='mb-3'>
                                <p className='text-xs text-white/60 uppercase tracking-wider mb-1'>
                                  Bank
                                </p>
                                <p className='text-white font-semibold text-base'>
                                  {bank.account[selectedIndex].bank}
                                </p>
                              </div>

                              <div className='mb-3'>
                                <p className='text-xs text-white/60 uppercase tracking-wider mb-1'>
                                  Nomor Rekening
                                </p>
                                <div className='flex items-center gap-2 bg-black/20 rounded-lg p-3'>
                                  <p className='text-white font-mono text-sm flex-1'>
                                    {bank.account[selectedIndex].accountNumber}
                                  </p>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        bank.account[selectedIndex]
                                          .accountNumber,
                                        `bank-${bankIndex}-${selectedIndex}`
                                      )
                                    }
                                    className='p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 flex-shrink-0'
                                    title='Copy nomor rekening'
                                  >
                                    {copiedText ===
                                      `bank-${bankIndex}-${selectedIndex}` ? (
                                      <Check className='w-4 h-4 text-green-400' />
                                    ) : (
                                      <Copy className='w-4 h-4 text-white' />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <p className='text-xs text-white/60 uppercase tracking-wider mb-1'>
                                  Atas Nama
                                </p>
                                <p className='text-white font-medium text-sm'>
                                  {bank.account[selectedIndex].accountName}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          {/* Crypto Wallet Tab */}
          {activeTab === 'wallet' &&
            data.invitationGiftWallet &&
            Array.isArray(data.invitationGiftWallet) && (
              <div className='animate-fadeIn space-y-5'>
                {data.invitationGiftWallet.map((wallet, walletIndex) => {
                  const walletKey = `wallet-${walletIndex}`;
                  const selectedIndex = selectedWallet[walletKey] ?? null;
                  const isDropdownOpen = dropdownOpen[walletKey] || false;

                  return (
                    <div key={wallet.giftWalletId || walletIndex}>
                      <div className='flex items-center gap-2 mb-3'>
                        <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                          <Wallet className='w-5 h-5 text-white' />
                        </div>
                        <h3 className='text-base font-bold text-white font-brown-sugar tracking-wider'>
                          {wallet.owner === 'BRIDE'
                            ? 'Mempelai Wanita'
                            : 'Mempelai Pria'}
                        </h3>
                      </div>

                      <div className='space-y-3'>
                        {/* Network Dropdown Selector */}
                        <div className='relative'>
                          <button
                            onClick={() => toggleDropdown(walletKey)}
                            className='w-full bg-white/10 border border-white/20 rounded-xl p-4 text-left flex items-center justify-between hover:bg-white/15 transition-all duration-300'
                          >
                            <div className='flex items-center gap-2'>
                              <Wallet className='w-4 h-4 text-white' />
                              <span className='text-white text-sm font-medium'>
                                {selectedIndex !== null
                                  ? wallet.address[selectedIndex].network
                                  : 'Pilih Jaringan'}
                              </span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <div className='absolute z-10 w-full mt-2 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-xl animate-fadeIn'>
                              {wallet.address.map((addr, addrIndex) => (
                                <button
                                  key={addrIndex}
                                  onClick={() => {
                                    setSelectedWallet({
                                      ...selectedWallet,
                                      [walletKey]: addrIndex,
                                    });
                                    toggleDropdown(walletKey);
                                  }}
                                  className={`w-full p-3 text-left text-sm hover:bg-white/10 transition-all duration-200 ${selectedIndex === addrIndex
                                      ? 'bg-white/10'
                                      : ''
                                    }`}
                                >
                                  <p className='text-white font-medium'>
                                    {addr.network}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Wallet Address Display */}
                        {selectedIndex !== null &&
                          wallet.address[selectedIndex] && (
                            <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-fadeIn'>
                              <p className='text-xs text-white/60 uppercase tracking-wider mb-2'>
                                {wallet.address[selectedIndex].network} Address
                              </p>
                              <div className='flex items-start gap-2 bg-black/20 rounded-lg p-3'>
                                <p className='text-white font-mono text-xs break-all flex-1 leading-relaxed'>
                                  {wallet.address[selectedIndex].walletAddress}
                                </p>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      wallet.address[selectedIndex]
                                        .walletAddress,
                                      `wallet-${walletIndex}-${selectedIndex}`
                                    )
                                  }
                                  className='p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 flex-shrink-0'
                                  title='Copy wallet address'
                                >
                                  {copiedText ===
                                    `wallet-${walletIndex}-${selectedIndex}` ? (
                                    <Check className='w-4 h-4 text-green-400' />
                                  ) : (
                                    <Copy className='w-4 h-4 text-white' />
                                  )}
                                </button>
                              </div>
                              <p className='text-xs text-white/50 mt-2 italic'>
                                Pastikan Anda mengirim ke jaringan yang benar
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
