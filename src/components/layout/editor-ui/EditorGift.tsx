'use client';
import { InvitationGift } from '@/types/interface';
import { Gift, MapPin, CreditCard, Trash2, Wallet } from 'lucide-react';

interface Props {
  data: InvitationGift;
  onChange: (data: InvitationGift) => void;
}

export default function EditorGift({ data, onChange }: Props) {
  const handleChange = (field: keyof InvitationGift, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-pink-400 font-medium flex items-center gap-2'>
        <Gift size={16} /> Informasi Hadiah Fisik
      </h3>

      <div className='grid gap-4'>
        <div>
          <label className='block text-xs text-gray-400 mb-1'>Alamat Kirim Hadiah</label>
           <div className="relative">
              <MapPin size={14} className="absolute left-3 top-2.5 text-gray-500" />
              <textarea
                value={data.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className='w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 h-32 resize-none'
                placeholder='Masukkan alamat lengkap untuk pengiriman kado fisik...'
              />
            </div>
        </div>
      </div>
      
      {/* BANK ACCOUNTS */}
      <div className='space-y-4 pt-4 border-t border-white/5'>
        <div className='flex items-center justify-between'>
          <h3 className='text-pink-400 font-medium flex items-center gap-2'>
            <CreditCard size={16} /> Rekening Bank
          </h3>
          <button
            onClick={() => {
              const newBank: any = {
                giftBankId: `new-${Date.now()}`,
                giftId: data.giftId,
                bankName: '',
                account: '',
                accountHolder: '',
                owner: 'GROOM',
              };
              onChange({
                ...data,
                invitationGiftBank: [...(data.invitationGiftBank || []), newBank],
              });
            }}
            className='text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/5 transition-all'
          >
            + Tambah
          </button>
        </div>

        <div className='grid gap-4'>
          {(data.invitationGiftBank || []).map((bank, index) => (
            <div key={bank.giftBankId || index} className='bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3 relative group'>
              <div className='absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                 <button 
                    onClick={() => {
                        const newBanks = [...data.invitationGiftBank];
                        newBanks.splice(index, 1);
                        onChange({...data, invitationGiftBank: newBanks});
                    }}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                 >
                    <Trash2 size={14} />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-wider">Milik</label>
                    <select
                        value={bank.owner}
                        onChange={(e) => {
                            const newBanks = [...data.invitationGiftBank];
                            newBanks[index] = { ...bank, owner: e.target.value as any };
                            onChange({...data, invitationGiftBank: newBanks});
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                    >
                        <option value="GROOM">Mempelai Pria</option>
                        <option value="BRIDE">Mempelai Wanita</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-wider">Nama Bank</label>
                    <input
                        type="text"
                        value={bank.bankName || ''}
                        onChange={(e) => {
                            const newBanks = [...data.invitationGiftBank];
                            newBanks[index] = { ...bank, bankName: e.target.value };
                            onChange({...data, invitationGiftBank: newBanks});
                        }}
                        placeholder="Contoh: BCA"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">Nomor Rekening</label>
                <input
                    type="text"
                    value={bank.account || ''}
                    onChange={(e) => {
                        const newBanks = [...data.invitationGiftBank];
                        newBanks[index] = { ...bank, account: e.target.value };
                        onChange({...data, invitationGiftBank: newBanks});
                    }}
                    placeholder="Contoh: 1234567890"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">Atas Nama</label>
                <input
                    type="text"
                    value={bank.accountHolder || ''}
                    onChange={(e) => {
                        const newBanks = [...data.invitationGiftBank];
                        newBanks[index] = { ...bank, accountHolder: e.target.value };
                        onChange({...data, invitationGiftBank: newBanks});
                    }}
                    placeholder="Nama pemilik rekening"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                />
              </div>
            </div>
          ))}
          {(data.invitationGiftBank?.length || 0) === 0 && (
             <p className="text-center text-xs text-white/30 py-4 italic">Belum ada rekening bank</p>
          )}
        </div>
      </div>

       {/* E-WALLETS */}
      <div className='space-y-4 pt-4 border-t border-white/5'>
        <div className='flex items-center justify-between'>
          <h3 className='text-pink-400 font-medium flex items-center gap-2'>
            <Wallet size={16} /> E-Wallet
          </h3>
          <button
            onClick={() => {
              const newWallet: any = {
                giftWalletId: `new-${Date.now()}`,
                giftId: data.giftId,
                walletName: '',
                account: '', // For phone number
                accountHolder: '',
                owner: 'GROOM',
              };
              onChange({
                ...data,
                invitationGiftWallet: [...(data.invitationGiftWallet || []), newWallet],
              });
            }}
            className='text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/5 transition-all'
          >
            + Tambah
          </button>
        </div>

        <div className='grid gap-4'>
          {(data.invitationGiftWallet || []).map((wallet, index) => (
            <div key={wallet.giftWalletId || index} className='bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3 relative group'>
               <div className='absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                 <button 
                    onClick={() => {
                        const newWallets = [...data.invitationGiftWallet];
                        newWallets.splice(index, 1);
                        onChange({...data, invitationGiftWallet: newWallets});
                    }}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                 >
                    <Trash2 size={14} />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-wider">Milik</label>
                    <select
                        value={wallet.owner}
                        onChange={(e) => {
                            const newWallets = [...data.invitationGiftWallet];
                            newWallets[index] = { ...wallet, owner: e.target.value as any };
                            onChange({...data, invitationGiftWallet: newWallets});
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                    >
                        <option value="GROOM">Mempelai Pria</option>
                        <option value="BRIDE">Mempelai Wanita</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-wider">Platform</label>
                    <input
                        type="text"
                        value={wallet.walletName || ''}
                        onChange={(e) => {
                            const newWallets = [...data.invitationGiftWallet];
                            newWallets[index] = { ...wallet, walletName: e.target.value };
                            onChange({...data, invitationGiftWallet: newWallets});
                        }}
                        placeholder="Contoh: GoPay, OVO"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">Nomor HP / Akun</label>
                <input
                    type="text"
                    value={wallet.account || ''}
                    onChange={(e) => {
                        const newWallets = [...data.invitationGiftWallet];
                        newWallets[index] = { ...wallet, account: e.target.value };
                        onChange({...data, invitationGiftWallet: newWallets});
                    }}
                    placeholder="Contoh: 08123xxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">Atas Nama</label>
                <input
                    type="text"
                    value={wallet.accountHolder || ''}
                    onChange={(e) => {
                        const newWallets = [...data.invitationGiftWallet];
                        newWallets[index] = { ...wallet, accountHolder: e.target.value };
                        onChange({...data, invitationGiftWallet: newWallets});
                    }}
                    placeholder="Nama pemilik akun"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                />
              </div>
            </div>
          ))}
           {(data.invitationGiftWallet?.length || 0) === 0 && (
             <p className="text-center text-xs text-white/30 py-4 italic">Belum ada e-wallet</p>
          )}
        </div>
      </div>
    </div>
  );
}
